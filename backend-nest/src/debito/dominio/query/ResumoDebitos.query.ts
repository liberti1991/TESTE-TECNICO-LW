import { ApiProperty } from '@nestjs/swagger';

export class ResumoDebitosQuery {
  @ApiProperty()
  placa: string;

  @ApiProperty()
  proprietario: string;

  @ApiProperty()
  totalDebitos: number;

  @ApiProperty()
  valorTotal: number;

  @ApiProperty({
    example: { IPVA: 800.0, MULTA: 293.47, LICENCIAMENTO: 89.5 },
  })
  porTipo: Record<string, number>;
}
