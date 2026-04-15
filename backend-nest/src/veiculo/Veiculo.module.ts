import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoController } from './aplicacao/controller/Veiculo.controller';
import { VeiculoService } from './aplicacao/service/Veiculo.service';
import { VeiculoRepository } from './infra/repository/Veiculo.repository';
import { Veiculo } from './dominio/entity/Veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo])],
  controllers: [VeiculoController],
  providers: [VeiculoService, VeiculoRepository],
  exports: [VeiculoService, VeiculoRepository],
})
export class VeiculoModule {}
