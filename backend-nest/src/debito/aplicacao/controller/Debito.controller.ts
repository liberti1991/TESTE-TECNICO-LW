import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DebitoService } from '../service/Debito.service';
import { CriarDebitoDto } from 'src/debito/dominio/dto/CriarDebito.dto';
import { AtualizarStatusDebitoDto } from 'src/debito/dominio/dto/AtualizarStatusDebito.dto';
import { FiltrarDebitosCommand } from 'src/debito/dominio/command/FiltrarDebitos.command';
import { DebitoCalculadoQuery } from 'src/debito/dominio/query/DebitoCalculado.query';
import { ResumoDebitosQuery } from 'src/debito/dominio/query/ResumoDebitos.query';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Débitos')
@Controller({ path: 'debitos', version: '1' })
export class DebitoController {
  constructor(private readonly debitoService: DebitoService) {}

  @ApiOperation({
    summary: 'Listar débitos de um veículo',
    description: 'Retorna os débitos calculados (valor + multa + juros) do veículo indicado pela placa.',
  })
  @ApiOkResponse({ type: DebitoCalculadoQuery, isArray: true })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  @Get('veiculo/:placa')
  async listarPorPlaca(
    @Param('placa') placa: string,
    @Query() command: FiltrarDebitosCommand,
  ): Promise<DebitoCalculadoQuery[]> {
    return this.debitoService.listarPorPlaca(placa, command);
  }

  @ApiOperation({ summary: 'Obter resumo de débitos por placa' })
  @ApiOkResponse({ type: ResumoDebitosQuery })
  @ApiQuery({ name: 'placa', required: true })
  @Get('resumo')
  async resumo(@Query('placa') placa: string): Promise<ResumoDebitosQuery> {
    return this.debitoService.resumo(placa);
  }

  @ApiOperation({ summary: 'Buscar débito por ID' })
  @ApiOkResponse({ type: DebitoCalculadoQuery })
  @ApiNotFoundResponse({ description: 'Débito não encontrado' })
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<DebitoCalculadoQuery> {
    return this.debitoService.buscarPorId(id);
  }

  @ApiOperation({ summary: 'Cadastrar novo débito' })
  @ApiCreatedResponse({ type: DebitoCalculadoQuery })
  @Post()
  async criar(@Body() dto: CriarDebitoDto): Promise<DebitoCalculadoQuery> {
    return this.debitoService.criar(dto);
  }

  @ApiOperation({ summary: 'Atualizar status de um débito' })
  @ApiOkResponse({ description: 'Status atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Débito não encontrado' })
  @Patch(':id/status')
  async atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarStatusDebitoDto,
  ): Promise<void> {
    return this.debitoService.atualizarStatus(id, dto.status);
  }

  @ApiOperation({
    summary: 'Quitar débito',
    description: 'Marca o débito como PAGO. Retorna 409 se já estiver pago.',
  })
  @ApiOkResponse({ description: 'Débito quitado com sucesso' })
  @ApiNotFoundResponse({ description: 'Débito não encontrado' })
  @Patch(':id/quitar')
  async quitar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.debitoService.quitar(id);
  }
}
