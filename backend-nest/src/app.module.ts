import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthModule } from './auth/Auth.module';
import { VeiculoModule } from './veiculo/Veiculo.module';
import { DebitoModule } from './debito/Debito.module';
import { RelatorioModule } from './relatorio/Relatorio.module';
import { Usuario } from './auth/dominio/entity/Usuario.entity';
import { Veiculo } from './veiculo/dominio/entity/Veiculo.entity';
import { Debito } from './debito/dominio/entity/Debito.entity';
import { TipoDebito } from './debito/dominio/enuns/TipoDebito.enum';
import { StatusDebito } from './debito/dominio/enuns/StatusDebito.enum';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: process.env.DB_PATH || './database.sqlite',
      entities: [Usuario, Veiculo, Debito],
      synchronize: true,
    }),
    AuthModule,
    VeiculoModule,
    DebitoModule,
    RelatorioModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const usuarioRepo = this.dataSource.getRepository(Usuario);
    const veiculoRepo = this.dataSource.getRepository(Veiculo);
    const debitoRepo = this.dataSource.getRepository(Debito);

    const jaExiste = await usuarioRepo.findOne({ where: { email: 'admin@consultaveicular.com' } });
    if (jaExiste) return;

    const senhaHash = await bcrypt.hash('admin123', 10);
    await usuarioRepo.save({ nome: 'Administrador', email: 'admin@consultaveicular.com', senhaHash });

    const veiculosSeed = [
      { placa: 'ABC1234', renavam: '12345678901', proprietario: 'João da Silva', modelo: 'Fiat Uno', ano: 2019, cor: 'Branco' },
      { placa: 'DEF5678', renavam: '23456789012', proprietario: 'Maria Oliveira', modelo: 'Honda Civic', ano: 2021, cor: 'Prata' },
      { placa: 'GHI9012', renavam: '34567890123', proprietario: 'Carlos Santos', modelo: 'VW Gol', ano: 2018, cor: 'Preto' },
      { placa: 'JKL3E45', renavam: '45678901234', proprietario: 'Ana Costa', modelo: 'Hyundai HB20', ano: 2022, cor: 'Azul' },
      { placa: 'MNO6F78', renavam: '56789012345', proprietario: 'Pedro Souza', modelo: 'Toyota Corolla', ano: 2020, cor: 'Vermelho' },
      { placa: 'PQR9G01', renavam: '67890123456', proprietario: 'Fernanda Lima', modelo: 'Renault Kwid', ano: 2023, cor: 'Laranja' },
      { placa: 'STU2H34', renavam: '78901234567', proprietario: 'Roberto Alves', modelo: 'Chevrolet Onix', ano: 2021, cor: 'Branco' },
      { placa: 'VWX5I67', renavam: '89012345678', proprietario: 'Juliana Martins', modelo: 'Ford Fiesta', ano: 2019, cor: 'Prata' },
    ];

    for (const dados of veiculosSeed) {
      const veiculo = await veiculoRepo.save(veiculoRepo.create(dados));

      await debitoRepo.save(debitoRepo.create({
        veiculoId: veiculo.id,
        tipo: TipoDebito.IPVA,
        descricao: `IPVA ${veiculo.ano} - ${veiculo.modelo}`,
        valor: 800 + Math.random() * 400,
        percentualMulta: 10,
        percentualJuros: 5,
        vencimento: '2024-03-31',
        status: StatusDebito.PENDENTE,
      }));

      await debitoRepo.save(debitoRepo.create({
        veiculoId: veiculo.id,
        tipo: TipoDebito.LICENCIAMENTO,
        descricao: `Licenciamento ${veiculo.ano}`,
        valor: 89.50,
        percentualMulta: 0,
        percentualJuros: 0,
        vencimento: '2024-06-30',
        status: Math.random() > 0.5 ? StatusDebito.PAGO : StatusDebito.PENDENTE,
      }));

      if (Math.random() > 0.4) {
        await debitoRepo.save(debitoRepo.create({
          veiculoId: veiculo.id,
          tipo: TipoDebito.MULTA,
          descricao: 'Auto de infração - Excesso de velocidade',
          valor: 293.47,
          percentualMulta: 10,
          percentualJuros: 1,
          vencimento: '2024-01-15',
          status: StatusDebito.VENCIDO,
        }));
      }
    }
  }
}
