import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debito } from 'src/debito/dominio/entity/Debito.entity';
import { RelatorioInadimplenciaQuery } from 'src/relatorio/dominio/query/RelatorioInadimplencia.query';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectRepository(Debito)
    private readonly debitoRepository: Repository<Debito>,
  ) {}

  async inadimplencia(): Promise<RelatorioInadimplenciaQuery> {
    throw new NotImplementedException('Funcionalidade não implementada');
  }
}
