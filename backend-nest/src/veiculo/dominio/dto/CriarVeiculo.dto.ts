import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';

export class CriarVeiculoDto {
  @ApiProperty({ example: 'ABC1D23', description: 'Placa no formato antigo (ABC1234) ou Mercosul (ABC1D23)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{3}[\d][A-Za-z0-9][\d]{2}$/, {
    message: 'Placa inválida. Formatos aceitos: ABC1234 ou ABC1D23',
  })
  placa: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  renavam: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  proprietario: string;

  @ApiProperty({ example: 'Fiat Uno' })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ example: 2021 })
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear() + 1)
  ano: number;

  @ApiProperty({ example: 'Branco' })
  @IsString()
  @IsNotEmpty()
  cor: string;
}
