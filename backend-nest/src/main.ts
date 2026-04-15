import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:3000' });

  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('Consulta Veicular API')
    .setDescription('Sistema de consulta de débitos veiculares')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const porta = process.env.PORT || 3001;
  await app.listen(porta);
  console.log(`Servidor rodando em http://localhost:${porta}`);
  console.log(`Swagger disponível em http://localhost:${porta}/docs`);
}

bootstrap();
