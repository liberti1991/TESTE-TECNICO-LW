import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VeiculoRepository } from 'src/veiculo/infra/repository/Veiculo.repository';
import { Veiculo } from 'src/veiculo/dominio/entity/Veiculo.entity';
import { CriarVeiculoDto } from 'src/veiculo/dominio/dto/CriarVeiculo.dto';
import { FiltrarVeiculosCommand } from 'src/veiculo/dominio/command/FiltrarVeiculos.command';
import { ListarVeiculosQuery } from 'src/veiculo/dominio/query/ListarVeiculos.query';

@Injectable()
export class VeiculoService {
  constructor(private readonly veiculoRepository: VeiculoRepository) {}

  async listar(command: FiltrarVeiculosCommand): Promise<ListarVeiculosQuery> {
    return this.veiculoRepository.listar(command);
  }

  async buscarPorPlaca(placa: string): Promise<Veiculo> {
    const veiculo = await this.veiculoRepository.buscarPorPlaca(placa);

    if (!veiculo) {
      throw new NotFoundException(`Veículo com placa ${placa} não encontrado`);
    }

    return veiculo;
  }

  async criar(dto: CriarVeiculoDto): Promise<Veiculo> {
    const existente = await this.veiculoRepository.buscarPorPlaca(dto.placa);

    if (existente) {
      throw new ConflictException(`Já existe um veículo com a placa ${dto.placa}`);
    }

    return this.veiculoRepository.inserir(dto);
  }
}
