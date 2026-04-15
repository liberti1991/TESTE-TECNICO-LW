import { Debito } from '../entity/Debito.entity';
import { FiltrarDebitosCommand } from '../command/FiltrarDebitos.command';

export interface IDebitoRepository {
  listar(command: FiltrarDebitosCommand): Promise<Debito[]>;
  buscarPorId(id: number): Promise<Debito | null>;
  inserir(debito: Partial<Debito>): Promise<Debito>;
  atualizar(id: number, dados: Partial<Debito>): Promise<boolean>;
}
