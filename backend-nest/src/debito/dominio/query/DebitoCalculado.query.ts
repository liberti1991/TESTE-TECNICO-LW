import { ApiProperty } from '@nestjs/swagger';
import { Debito } from '../entity/Debito.entity';

export class DebitoCalculadoQuery extends Debito {
  @ApiProperty()
  valorMulta: number;

  @ApiProperty()
  valorJuros: number;

  @ApiProperty()
  valorTotal: number;
}
