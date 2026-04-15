# BUGS - Relatório

> Documentação dos bugs encontrados.

## Bugs encontrados

### Bug 1 API - USeGuards na rota de login

- localização: `backend-nest/src/auth/aplicacao/controller/Auth.controller.ts` > (lines: 12-16)
- Reprodução: iniciar o backend NestJS e enviar `POST /v1/auth/login` com `admin@consultaveicular.com` e `admin123`.
- Descrição: a rota de login estava protegida com o `JwtAuthGuard`, então a API exigia um token de acesso antes mesmo de autenticar o usuário, Isso fazia o endpoint responder `401 Unauthorized` e impedia o login no sistema.
- Solução: removi o `@UseGuards(jwtAuthGuard)` da rota de login, deixando essa proteção nas rotas privadas, assim o endpoint voltou a funcionar como o esperado utilizando email e senha para validação, também retirado a importação `ApiBearerAuth` do swagger que estava sem uso.

### Bug 2

## Funcionalidades implementadas

## Melhorias