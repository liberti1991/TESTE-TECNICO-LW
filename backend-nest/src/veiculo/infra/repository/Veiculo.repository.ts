import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from 'src/veiculo/dominio/entity/Veiculo.entity';
import { FiltrarVeiculosCommand } from 'src/veiculo/dominio/command/FiltrarVeiculos.command';
import { ListarVeiculosQuery } from 'src/veiculo/dominio/query/ListarVeiculos.query';
import { IVeiculoRepository } from 'src/veiculo/dominio/interfaces/IVeiculoRepository.interface';

@Injectable()
export class VeiculoRepository implements IVeiculoRepository {
  constructor(@InjectRepository(Veiculo) private readonly repository: Repository<Veiculo>) {}

  async listar(command: FiltrarVeiculosCommand): Promise<ListarVeiculosQuery> {
    const { page = 1, limit = 10, proprietario, modelo, anoMin, anoMax } = command;
    const offset = (page - 1) * limit;

    const query = this.repository.createQueryBuilder('v');

    const [data, total] = await Promise.all([
      query.skip(offset).take(limit).getMany(),
      query.getCount(),
    ]);

    return { data, total, page, limit };
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    return this.repository.findOne({ where: { placa: placa.toUpperCase() } });
  }

  async buscarPorId(id: number): Promise<Veiculo | null> {
    return this.repository.findOne({ where: { id } });
  }

  async inserir(dados: Partial<Veiculo>): Promise<Veiculo> {
    const veiculo = this.repository.create({
      ...dados,
      placa: dados.placa?.toUpperCase(),
    });
    return this.repository.save(veiculo);
  }
}
