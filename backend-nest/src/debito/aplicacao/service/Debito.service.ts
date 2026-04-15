import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FiltrarDebitosCommand } from 'src/debito/dominio/command/FiltrarDebitos.command';
import { CriarDebitoDto } from 'src/debito/dominio/dto/CriarDebito.dto';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';
import { StatusDebito } from 'src/debito/dominio/enuns/StatusDebito.enum';
import { DebitoCalculadoQuery } from 'src/debito/dominio/query/DebitoCalculado.query';
import { ResumoDebitosQuery } from 'src/debito/dominio/query/ResumoDebitos.query';
import { DebitoRepository } from 'src/debito/infra/repository/Debito.repository';
import { arredondarMoeda } from 'src/common/utils/moeda.util';
import { calcularDebito } from 'src/common/utils/calcularDebito.util';
import { VeiculoRepository } from 'src/veiculo/infra/repository/Veiculo.repository';
import { normalizarPlaca } from 'src/common/utils/placa.util';

@Injectable()
export class DebitoService {
  constructor(
    private readonly debitoRepository: DebitoRepository,
    private readonly veiculoRepository: VeiculoRepository,
  ) {}

  calcularTotais(debito: Debito): DebitoCalculadoQuery {
    const { valorBase, valorMulta, valorJuros, valorTotal } = calcularDebito({
      valor: debito.valor,
      percentualMulta: debito.percentualMulta,
      percentualJuros: debito.percentualJuros,
    });

    return {
      ...debito,
      valor: valorBase,
      valorMulta,
      valorJuros,
      valorTotal,
    };
  }

  async listarPorPlaca(placa: string, command: FiltrarDebitosCommand): Promise<DebitoCalculadoQuery[]> {
    const veiculo = await this.veiculoRepository.buscarPorPlaca(normalizarPlaca(placa));

    if (!veiculo) {
      throw new NotFoundException(`Veículo com placa ${placa} não encontrado`);
    }

    const debitos = await this.debitoRepository.listar({
      ...command,
      veiculoId: veiculo.id,
    });

    return debitos.map((d) => this.calcularTotais(d));
  }

  async buscarPorId(id: number): Promise<DebitoCalculadoQuery> {
    const debito = await this.debitoRepository.buscarPorId(id);

    if (!debito) {
      throw new NotFoundException(`Débito ${id} não encontrado`);
    }

    return this.calcularTotais(debito);
  }

  async criar(dto: CriarDebitoDto): Promise<DebitoCalculadoQuery> {
    const veiculo = await this.veiculoRepository.buscarPorId(dto.veiculoId);

    if (!veiculo) {
      throw new NotFoundException(`Veículo ${dto.veiculoId} não encontrado`);
    }

    const debito = await this.debitoRepository.inserir({
      ...dto,
      status: dto.status ?? StatusDebito.PENDENTE,
      percentualMulta: dto.percentualMulta ?? 0,
      percentualJuros: dto.percentualJuros ?? 0,
    });

    return this.calcularTotais(debito);
  }

  async atualizarStatus(id: number, status: StatusDebito): Promise<void> {
    const atualizado = await this.debitoRepository.atualizar(id, { status });

    if (!atualizado) {
      throw new NotFoundException(`Débito ${id} não encontrado`);
    }
  }

  async quitar(id: number): Promise<void> {
    const debito = await this.debitoRepository.buscarPorId(id);

    if (!debito) {
      throw new NotFoundException(`Débito ${id} não encontrado`);
    }

    if (debito.status === StatusDebito.PAGO) {
      throw new ConflictException(`Débito ${id} já está pago`);
    }

    await this.debitoRepository.atualizar(id, { status: StatusDebito.PAGO });
  }

  async resumo(placa: string): Promise<ResumoDebitosQuery> {
    const veiculo = await this.veiculoRepository.buscarPorPlaca(normalizarPlaca(placa));

    if (!veiculo) {
      throw new NotFoundException(`Veículo com placa ${placa} não encontrado`);
    }

    const debitos = await this.debitoRepository.buscarPorVeiculoId(veiculo.id as number);
    const debitosCalculados = debitos.map((debito) => this.calcularTotais(debito));

    const porTipo = debitosCalculados.reduce<Record<string, number>>((acumulado, debito) => {
      const valorAtual = acumulado[debito.tipo] ?? 0;
      acumulado[debito.tipo] = arredondarMoeda(valorAtual + debito.valorTotal);
      return acumulado;
    }, {});

    const valorTotal = arredondarMoeda(
      debitosCalculados.reduce((total, debito) => total + debito.valorTotal, 0),
    );

    return {
      placa: veiculo.placa,
      proprietario: veiculo.proprietario,
      totalDebitos: debitosCalculados.length,
      valorTotal,
      porTipo,
    };
  }
}
