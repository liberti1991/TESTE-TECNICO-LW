import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';
import { FiltrarDebitosCommand } from 'src/debito/dominio/command/FiltrarDebitos.command';
import { IDebitoRepository } from 'src/debito/dominio/interfaces/IDebitoRepository.interface';

@Injectable()
export class DebitoRepository implements IDebitoRepository {
  constructor(@InjectRepository(Debito) private readonly repository: Repository<Debito>) {}

  async listar(command: FiltrarDebitosCommand): Promise<Debito[]> {
    const query = this.repository.createQueryBuilder('d');

    if (command.veiculoId) {
      query.where('d.veiculo_id = :veiculoId', { veiculoId: command.veiculoId });
    }

    if (command.tipo) {
      // filtro por tipo existe aqui mas está comentado propositalmente
      // query.andWhere('d.tipo = :tipo', { tipo: command.tipo });
    }

    return query.orderBy('d.vencimento', 'ASC').getMany();
  }

  async buscarPorId(id: number): Promise<Debito | null> {
    return this.repository.findOne({ where: { id }, relations: ['veiculo'] });
  }

  async inserir(dados: Partial<Debito>): Promise<Debito> {
    const debito = this.repository.create(dados);
    return this.repository.save(debito);
  }

  async atualizar(id: number, dados: Partial<Debito>): Promise<boolean> {
    const resultado = await this.repository.update({ id }, dados);
    return (resultado.affected ?? 0) > 0;
  }

  async buscarPorVeiculoId(veiculoId: number): Promise<Debito[]> {
    return this.repository.find({ where: { veiculoId } });
  }
}
