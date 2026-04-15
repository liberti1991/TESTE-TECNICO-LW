import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatorioController } from './aplicacao/controller/Relatorio.controller';
import { RelatorioService } from './aplicacao/service/Relatorio.service';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Debito])],
  controllers: [RelatorioController],
  providers: [RelatorioService],
})
export class RelatorioModule {}
