# BUGS - Relatório

> Documentação dos bugs encontrados.

## Bugs encontrados

### Bug 1 API - USeGuards na rota de login

- localização: `backend-nest/src/auth/aplicacao/controller/Auth.controller.ts` > (lines: 12-16)
- Reprodução: iniciar o backend NestJS e enviar `POST /v1/auth/login` com `admin@consultaveicular.com` e `admin123`.
- Descrição: a rota de login estava protegida com o `JwtAuthGuard`, então a API exigia um token de acesso antes mesmo de autenticar o usuário, Isso fazia o endpoint responder `401 Unauthorized` e impedia o login no sistema.
- Solução: removi o `@UseGuards(jwtAuthGuard)` da rota de login, deixando essa proteção nas rotas privadas, assim o endpoint voltou a funcionar como o esperado utilizando email e senha para validação, também retirado a importação `ApiBearerAuth` do swagger que estava sem uso.

### Bug 2 API - Validação Global

- localização: `backend-nest/src/main.ts` > (lines: 11-19)
- Reprodução: enviar `POST /v1/auth/login` com payload inválido, por exemplo `{"email":"invalido","senha":"","extra":"campo"}`.
- Descrição: Faltava o `ValidationPipe` global na aplicação. Por causa disso, as validações definidas nos DTOs, como `@IsMail`, `@ÌsNotEmpty` e outras anotações do class-validator, não eram executadas automaticamente nas requisições. Na prática payloads inválidos eram aceitos e seguiam para o service aonde comprometia a confiabilidade e a segurança da API com dados inválidos.
- Solução: Ao adicionar o `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted` e `transform`, Assim a API passa a validar os dados recebidos  em todas as rotas que usam o DTO, rejeita campos extras e faz a conversão de tipos quando necessário.

### Bug 3 API - Falta de await na pesquisa de id veiculo

- localização: `backend-nest/src/debito/aplicacao/service/Debito.service.ts` > (line: 32)
- Reprodução: consultar `GET /v1/debitos/veiculo/ABC1234` usando uma placa existente.
- Descrição: O método `listarPorPlaca`, estava realizando a busca sem o `await`, então o código tentava usar o resultado assíncrono antes da resolução. Com isso, o filtro por veículo não era aplicado corretamente e o endpoint de débitos por placa retornava dados incorretos.
- Solução: Ao adicionar o `await` na busca passamos a enviar o veiculo.id correto para o repositório, garantindo que a listagem retorno apenas os débitos do veículo consultado.

## Funcionalidades implementadas

## Melhorias