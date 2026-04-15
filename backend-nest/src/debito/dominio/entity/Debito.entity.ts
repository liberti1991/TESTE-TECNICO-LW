import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoDebito } from '../enuns/TipoDebito.enum';
import { StatusDebito } from '../enuns/StatusDebito.enum';
import { Veiculo } from 'src/veiculo/dominio/entity/Veiculo.entity';

@Entity('debitos')
export class Debito {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ enum: TipoDebito })
  @Column({ type: 'simple-enum', enum: TipoDebito })
  tipo: TipoDebito;

  @ApiProperty()
  @Column({ type: 'text' })
  descricao: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  valor: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0, name: 'percentual_multa' })
  percentualMulta: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0, name: 'percentual_juros' })
  percentualJuros: number;

  @ApiProperty()
  @Column()
  vencimento: string;

  @ApiProperty({ enum: StatusDebito })
  @Column({ type: 'simple-enum', enum: StatusDebito, default: StatusDebito.PENDENTE })
  status: StatusDebito;

  @ApiPropertyOptional()
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @Column({ name: 'veiculo_id' })
  veiculoId: number;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.debitos)
  @JoinColumn({ name: 'veiculo_id' })
  veiculo?: Veiculo;
}
