import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';

@Entity('veiculos')
export class Veiculo {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ unique: true })
  placa: string;

  @ApiProperty()
  @Column({ unique: true })
  renavam: string;

  @ApiProperty()
  @Column()
  proprietario: string;

  @ApiProperty()
  @Column()
  modelo: string;

  @ApiProperty()
  @Column()
  ano: number;

  @ApiProperty()
  @Column()
  cor: string;

  @ApiPropertyOptional()
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @ApiPropertyOptional({ type: () => [Debito] })
  @OneToMany(() => Debito, (debito) => debito.veiculo)
  debitos?: Debito[];
}
