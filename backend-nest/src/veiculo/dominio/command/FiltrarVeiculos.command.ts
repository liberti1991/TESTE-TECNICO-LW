import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FiltrarVeiculosCommand {
  @ApiPropertyOptional({ description: 'Filtrar por parte do nome do proprietário' })
  @IsOptional()
  @IsString()
  proprietario?: string;

  @ApiPropertyOptional({ description: 'Filtrar por modelo' })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiPropertyOptional({ description: 'Ano mínimo de fabricação', example: 2018 })
  @IsOptional()
  @IsInt()
  @Min(1950)
  anoMin?: number;

  @ApiPropertyOptional({ description: 'Ano máximo de fabricação', example: 2024 })
  @IsOptional()
  @IsInt()
  @Min(1950)
  anoMax?: number;

  @ApiPropertyOptional({ description: 'Página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
