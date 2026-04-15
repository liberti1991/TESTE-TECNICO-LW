import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebitoController } from './aplicacao/controller/Debito.controller';
import { DebitoService } from './aplicacao/service/Debito.service';
import { DebitoRepository } from './infra/repository/Debito.repository';
import { Debito } from './dominio/entity/Debito.entity';
import { VeiculoModule } from 'src/veiculo/Veiculo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debito]), VeiculoModule],
  controllers: [DebitoController],
  providers: [DebitoService, DebitoRepository],
  exports: [DebitoService, DebitoRepository],
})
export class DebitoModule {}
