import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RelatorioService } from '../service/Relatorio.service';
import { RelatorioInadimplenciaQuery } from 'src/relatorio/dominio/query/RelatorioInadimplencia.query';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Relatórios')
@Controller({ path: 'relatorios', version: '1' })
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @ApiOperation({
    summary: 'Relatório de inadimplência',
    description: 'Lista veículos com débitos vencidos, ordenados pelo valor total vencido.',
  })
  @ApiOkResponse({ type: RelatorioInadimplenciaQuery })
  @Get('inadimplencia')
  async inadimplencia(): Promise<RelatorioInadimplenciaQuery> {
    return this.relatorioService.inadimplencia();
  }
}
