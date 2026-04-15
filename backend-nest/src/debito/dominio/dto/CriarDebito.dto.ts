import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { TipoDebito } from '../enuns/TipoDebito.enum';
import { StatusDebito } from '../enuns/StatusDebito.enum';

export class CriarDebitoDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  veiculoId: number;

  @ApiProperty({ enum: TipoDebito })
  @IsEnum(TipoDebito)
  tipo: TipoDebito;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 800.00 })
  @IsNumber()
  @IsPositive()
  valor: number;

  @ApiPropertyOptional({ example: 10, description: 'Percentual de multa (ex: 10 = 10%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  percentualMulta?: number = 0;

  @ApiPropertyOptional({ example: 5, description: 'Percentual de juros (ex: 5 = 5%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  percentualJuros?: number = 0;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  vencimento: string;

  @ApiPropertyOptional({ enum: StatusDebito })
  @IsOptional()
  @IsEnum(StatusDebito)
  status?: StatusDebito = StatusDebito.PENDENTE;
}
