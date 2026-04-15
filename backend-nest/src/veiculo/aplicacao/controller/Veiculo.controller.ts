import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VeiculoService } from '../service/Veiculo.service';
import { Veiculo } from 'src/veiculo/dominio/entity/Veiculo.entity';
import { CriarVeiculoDto } from 'src/veiculo/dominio/dto/CriarVeiculo.dto';
import { FiltrarVeiculosCommand } from 'src/veiculo/dominio/command/FiltrarVeiculos.command';
import { ListarVeiculosQuery } from 'src/veiculo/dominio/query/ListarVeiculos.query';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Veículos')
@Controller({ path: 'veiculos', version: '1' })
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @ApiOperation({ summary: 'Listar veículos', description: 'Retorna lista paginada com suporte a filtros.' })
  @ApiOkResponse({ type: ListarVeiculosQuery })
  @Get()
  async listar(@Query() command: FiltrarVeiculosCommand): Promise<ListarVeiculosQuery> {
    return this.veiculoService.listar(command);
  }

  @ApiOperation({ summary: 'Buscar veículo por placa' })
  @ApiOkResponse({ type: Veiculo })
  @ApiNotFoundResponse({ description: 'Veículo não encontrado' })
  @Get(':placa')
  async buscarPorPlaca(@Param('placa') placa: string): Promise<Veiculo> {
    return this.veiculoService.buscarPorPlaca(placa);
  }

  @ApiOperation({ summary: 'Cadastrar novo veículo' })
  @ApiCreatedResponse({ type: Veiculo })
  @ApiConflictResponse({ description: 'Placa já cadastrada' })
  @HttpCode(200)
  @Post()
  async criar(@Body() dto: CriarVeiculoDto): Promise<Veiculo> {
    return this.veiculoService.criar(dto);
  }
}
