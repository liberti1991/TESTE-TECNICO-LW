import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'senha_hash' })
  senhaHash: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;
}
