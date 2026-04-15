import { ApiProperty } from '@nestjs/swagger';

export class ItemRelatorioInadimplenciaQuery {
  @ApiProperty()
  placa: string;

  @ApiProperty()
  proprietario: string;

  @ApiProperty()
  modelo: string;

  @ApiProperty()
  totalDebitosVencidos: number;

  @ApiProperty()
  valorTotalVencido: number;
}

export class RelatorioInadimplenciaQuery {
  @ApiProperty({ type: () => [ItemRelatorioInadimplenciaQuery] })
  veiculos: ItemRelatorioInadimplenciaQuery[];

  @ApiProperty()
  totalVeiculos: number;

  @ApiProperty()
  valorTotalGeral: number;
}
