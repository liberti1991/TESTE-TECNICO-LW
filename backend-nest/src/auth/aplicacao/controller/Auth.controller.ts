import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from '../service/Auth.service';
import { LoginDto } from 'src/auth/dominio/dto/Login.dto';
import { TokenAuthQuery } from 'src/auth/dominio/query/TokenAuth.query';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Autenticar usuário', description: 'Retorna um token JWT.' })
  @ApiResponse({ type: TokenAuthQuery, status: 200 })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<TokenAuthQuery> {
    return this.authService.login(dto);
  }
}
