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

### Bug 4 FRONT - Nomenclatura em divergência front e back

- localização: `frontend/src/components/DebitosList.tsx` > (line: 66, 68, 70, 73, 75), `frontend/src/app/veiculo/[placa]/page.tsx > (line: 47 ),
`frontend/src/lib/api.ts` > (lines: 42, 47, 51-55, 58 )
- Reprodução: acessar `http://localhost:3000/veiculo/ABC1234`.
- Descrição: O Frontend estava esperando os dados dos débitos no formato `snake_case`, campos como `valor_total`, `Valor_multa` e `valor_juros`. Porém o backend retornava esses dados em `camelCase` como `valorTotal`, `ValorMulta` e `ValorJuros`. isso fazia os valores chegarem como undefined no component causando o erro `Cannot read properties of undefined (reading 'toLocaleString')` ao abrir os detalhes do veículo.
- Solução: Ajustando os tipos e o consumo dos dados no frontend para seguir o mesmo padrão do backend, trocando os campos em `snake_case` para `camelCase`. assim passa a ser lidos corretamente e a tela voltou a funcionar sem crachá.

### Bug 5 API - Cálculo incorreto dos débitos

- localização: `backend-nest/src/debito/aplicacao/service/Debito.service.ts` > (lines: 18-33)
- Reprodução: consultar `GET /v1/debitos/3` e comparar os valores retornados com o cálculo esperado de multa, juros e total.
- Descrição: O cálculo do débito estava incorreto porque os juros eram aplicados sobre o valor com multa, em vez de serem calculados separadamente sobre o valor original. isso fazia o `valorTotal` ficar maior do que o esperado. também havia problema de precisão, retornando números com muitas casas decimais.
- Solução: Ajustei a regra para calcular `valorMulta` e `valorJuros` sobre o valor base do débito e definir o `valorTotal` como a soma de `valor + valorMulta + valorJuros`. Também apliquei arredondamento monetário para duas casas decimais.

### Bug 6 API - StatusCode

- localização: `backend-nest/src/veiculo/aplicacao/controller/Veiculo.controller.ts` > (line: 43)
- Reprodução: enviar `POST /v1/veiculos` com token válido e payload correto.
- Descrição: O endpoint `POST/v1/veiculos` estava retornando `200 Ok` por causa do `@HttpCode(200)`, mesmo sendo uma operação de criação. isso deixava a resposta fora do padrão HTTP.
- Solução: Remoção do `@HttpCode(200)` para o Nest voltar a responder com `201 Created` automaticamente no cadastro de veículo
  
### Bug 7 API - Filtros de debito

- localização: `backend-nest/src/debito/infra/repository/Debito.repository.ts` > (lines: 12-27)
- Reprodução: consultar `GET /v1/debitos/veiculo/ABC1234?status=PAGO` e `GET /v1/debitos/veiculo/ABC1234?tipo=LICENCIAMENTO`.
- Descrição: Os filtros por `status` e `tipo` não estavam sendo aplicados na consulta dos débitos. O filtro por `tipo` estava comentado e o filtro por `status` nem existia, assim a API sempre retornava a lista completa.
- Solução: Implementai os `andWhere` para `status` e `tipo` na query do repositório, fazendo com que os parâmetros enviados na rota passem a afetar corretamente o resultado.

### Bug 8 FRONT - Interceptor global

- localização: `frontend/src/lib/api.ts` > (lines: 18-31)
- Reprodução: abrir a tela de login e tentar autenticar com credenciais inválidas.
- Descrição: O interceptor global travava qualquer `410 Unauthorized` redirecionando o usuário para `/login`, inclusive quado o erro vinha da própria rota de login. isso atrapalha o fluxo de autenticação e poderia esconder o feedback correto de credenciais inválidas.
- Solução: Ajustando o interceptor para manter o redirecionamento apenas para rotas protegidas e ignorar esse comportamento quando o 401 vier da rota de login. Assim o formulário consegue exibir o erro corretamente ao usuário.
  
### Bug 9

## Funcionalidades implementadas

## Melhorias