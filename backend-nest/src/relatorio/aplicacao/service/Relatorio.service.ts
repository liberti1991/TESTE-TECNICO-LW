import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';
import { calcularDebito } from 'src/common/utils/calcularDebito.util';
import { arredondarMoeda } from 'src/common/utils/moeda.util';
import { StatusDebito } from 'src/debito/dominio/enuns/StatusDebito.enum';
import {
  ItemRelatorioInadimplenciaQuery,
  RelatorioInadimplenciaQuery,
} from 'src/relatorio/dominio/query/RelatorioInadimplencia.query';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectRepository(Debito)
    private readonly debitoRepository: Repository<Debito>,
  ) {}

  private calcularValorTotalVencido(debito: Debito): number {
    const { valorTotal } = calcularDebito({
      valor: debito.valor,
      percentualMulta: debito.percentualMulta,
      percentualJuros: debito.percentualJuros,
    });

    return valorTotal;
  }

  async inadimplencia(): Promise<RelatorioInadimplenciaQuery> {
    const debitosVencidos = await this.debitoRepository.find({
      where: { status: StatusDebito.VENCIDO },
      relations: ['veiculo'],
    });

    const agrupadoPorVeiculo = debitosVencidos.reduce<Map<number, ItemRelatorioInadimplenciaQuery>>(
      (acumulado, debito) => {
        if (!debito.veiculo || debito.veiculo.id === undefined) {
          return acumulado;
        }

        const veiculoId = debito.veiculo.id;
        const valorTotalDebito = this.calcularValorTotalVencido(debito);
        const itemAtual = acumulado.get(veiculoId);

        if (itemAtual) {
          itemAtual.totalDebitosVencidos += 1;
          itemAtual.valorTotalVencido = arredondarMoeda(itemAtual.valorTotalVencido + valorTotalDebito);
          return acumulado;
        }

        acumulado.set(veiculoId, {
          placa: debito.veiculo.placa,
          proprietario: debito.veiculo.proprietario,
          modelo: debito.veiculo.modelo,
          totalDebitosVencidos: 1,
          valorTotalVencido: valorTotalDebito,
        });

        return acumulado;
      },
      new Map<number, ItemRelatorioInadimplenciaQuery>(),
    );

    const veiculos = Array.from(agrupadoPorVeiculo.values()).sort(
      (a, b) => b.valorTotalVencido - a.valorTotalVencido,
    );

    const valorTotalGeral = arredondarMoeda(
      veiculos.reduce((total, veiculo) => total + veiculo.valorTotalVencido, 0),
    );

    return {
      veiculos,
      totalVeiculos: veiculos.length,
      valorTotalGeral,
    };
  }
}
