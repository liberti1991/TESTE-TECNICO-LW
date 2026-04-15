import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './aplicacao/controller/Auth.controller';
import { AuthService } from './aplicacao/service/Auth.service';
import { Usuario } from './dominio/entity/Usuario.entity';
import { JwtStrategy } from './strategies/Jwt.strategy';
import { JwtAuthGuard } from './guards/JwtAuth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'minha-chave-secreta-desenvolvimento',
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
      }),
    }),
    TypeOrmModule.forFeature([Usuario]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
