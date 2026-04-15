import { ApiProperty } from '@nestjs/swagger';
import { Veiculo } from '../entity/Veiculo.entity';

export class ListarVeiculosQuery {
  @ApiProperty({ type: () => [Veiculo] })
  data: Veiculo[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
