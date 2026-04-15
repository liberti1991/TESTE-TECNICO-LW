import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusDebito } from '../enuns/StatusDebito.enum';

export class AtualizarStatusDebitoDto {
  @ApiProperty({ enum: StatusDebito })
  @IsEnum(StatusDebito)
  status: StatusDebito;
}
