import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/auth/dominio/interfaces/IJwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'minha-chave-secreta-desenvolvimento',
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload?.id) {
      throw new UnauthorizedException();
    }
    return { id: payload.id, email: payload.email };
  }
}
