import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';
import { normalizarPlaca, PLACA_INVALIDA_MESSAGE, PLACA_REGEX } from 'src/common/utils/placa.util';

export class CriarVeiculoDto {
  @ApiProperty({ example: 'ABC1D23', description: 'Placa no formato antigo (ABC1234) ou Mercosul (ABC1D23)' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? normalizarPlaca(value) : value))
  @Matches(PLACA_REGEX, {
    message: PLACA_INVALIDA_MESSAGE,
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
