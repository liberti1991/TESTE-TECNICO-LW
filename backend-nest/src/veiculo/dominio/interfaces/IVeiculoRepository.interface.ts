import { Veiculo } from '../entity/Veiculo.entity';
import { FiltrarVeiculosCommand } from '../command/FiltrarVeiculos.command';
import { ListarVeiculosQuery } from '../query/ListarVeiculos.query';

export interface IVeiculoRepository {
  listar(command: FiltrarVeiculosCommand): Promise<ListarVeiculosQuery>;
  buscarPorPlaca(placa: string): Promise<Veiculo | null>;
  buscarPorId(id: number): Promise<Veiculo | null>;
  inserir(veiculo: Partial<Veiculo>): Promise<Veiculo>;
}
