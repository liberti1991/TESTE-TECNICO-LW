import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dominio/dto/Login.dto';
import { TokenAuthQuery } from 'src/auth/dominio/query/TokenAuth.query';
import { Usuario } from 'src/auth/dominio/entity/Usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenAuthQuery> {
    const usuario = await this.usuarioRepository.findOne({ where: { email: dto.email } });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ id: usuario.id, email: usuario.email });

    return { token };
  }
}
