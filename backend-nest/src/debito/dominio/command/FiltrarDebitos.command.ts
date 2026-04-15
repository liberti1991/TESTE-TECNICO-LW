import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusDebito } from '../enuns/StatusDebito.enum';
import { TipoDebito } from '../enuns/TipoDebito.enum';

export class FiltrarDebitosCommand {
  veiculoId?: number;

  @ApiPropertyOptional({ enum: StatusDebito })
  @IsOptional()
  @IsEnum(StatusDebito)
  status?: StatusDebito;

  @ApiPropertyOptional({ enum: TipoDebito })
  @IsOptional()
  @IsEnum(TipoDebito)
  tipo?: TipoDebito;
}
