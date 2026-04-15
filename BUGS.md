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
  
### Bug 9 FRONT - Bug na conversão de datas

- localização: `frontend/src/components/DebitosList.tsx` > (lines: 26-29)
- Reprodução: acessar `http://localhost:3000/veiculo/ABC1234` e comparar a data mostrada na tela com a data recebida da API, por exemplo `2024-06-30`.
- Descrição: Ao abrir a tela de detalhes do veículo, algumas datas de vencimento apareciam com um dia a menos. isso acontecia porque a data recebida da API era convertida diretamente com `new Date`, sofrendo impacto do fuso do navegador.
- Solução: Ajustando a função de formato para montar a data manualmente a partir da string recebida, garantindo que o vencimento exibido seja o mesmo informado pela API.
  
### Bug 10 FRONT - Tipagem ajustada no card de veiculo

- localização: `frontend/src/components/VeiculoCard.tsx` > (lines: 15-24)
- Reprodução: abrir a home, inspecionar a chamada `/v1/debitos/veiculo/:placa` no DevTools e comparar o retorno real com o tipo usado no componente.
- Descrição: O componente `VeiculoCard` consumia a rota `/debitos/veiculo/:placa` como se a resposta fosse paginada, utilizando `RespostaPaginada<DebitoCalculado>`, Porém, a API retorna um array simples de débitos. código só funcionava porque fazia um cast forçado, mascarando a inconsistência entre o front e o back.
- Solução: Ajustando a chamada da API para o tipo correto ( DebitoCalculado[]) e removi o cast manual, deixando a contagem de débitos alinhada com o retorno real da rota.

## Funcionalidades implementadas

### Funcionalidade 2.1 API - Filtro avançado de veículos

- localização: `backend-nest/src/veiculo/infra/repository/Veiculo.repository.ts` > (lines: 13-45)
- Reprodução: Fazer a autenticação no Swagger e realizar p `GET /v1/veiculos` usando os filtros `proprietario`, `modelo`, `anoMin` e `anoMax`, isolados ou combinados.
- Descrição: a API já aceitava os query params `proprietario`, `modelo`, `anoMin` e `anoMax`, porém não existia a implementação desses filtros avançados, sendo assim a listagem sempre retornava todos os veículos.
- Solução: implementando os filtros diretamente no `QueryBuilder` do TypeORM, aplicado a busca parcial e case-insensitive para `proprietario` e `modelo`, além de intervalo numérico para `anoMin` e `anoMax`. Também mantive a paginação correta com `query.clone()`, separando a consulta dos dados da consulta de contagem total.
- Validação:
  - `GET /v1/veiculos?proprietario=silva` retorna apenas `ABC1234`
  - `GET /v1/veiculos?modelo=civic` retorna apenas `DEF5678`
  - `GET /v1/veiculos?anoMin=2020&anoMax=2021` retorna 3 veículos
  - `GET /v1/veiculos?proprietario=maria&modelo=civic&anoMin=2020&anoMax=2022` retorna apenas `DEF5678`
  - `GET /v1/veiculos?anoMin=2020&anoMax=2021&limit=1&page=2` mantém `total: 3` e paginação funcionando

### Funcionalidade 2.2 API - Quitar débito

- localização: `backend-nest/src/debito/aplicacao/service/Debito.service.ts` > (lines: 87-99), `backend-nest/src/debito/aplicacao/controller/Debito.controller.ts` > (lines: 75-83)
- Reprodução: Autenticação via Swagger, consultar `GET /v1/debitos/veiculo/DEF5678`, Localizar um débito com status `PENDENTE` ou `VENCIDO` e executar `PATCH /v1/debitos/{id}/quitar`. Para validar a regra de conflito, executar a mesma rota com um débito que já esteja `PAGO`.
- Descrição: o endpoint `PATCH /v1/debitos/:id/quitar` já existia na API, porém não possuía implementação. Com isso, não era possível realizar a quitação de um débito, nem tratar corretamente os cenários de débito inexistente ou já pago.
- Solução: implementação da regra no service para buscar o débito pelo `id`, retornar `404` quando não encontrado, retornar `409` quando já estiver `PAGO` e atualizar o status para `PAGO` nos casos válidos. Também ajustei a documentação Swagger para refletir o retorno de conflito.
- Validação:
  - `GET /v1/debitos/veiculo/DEF5678` permitiu localizar um `IPVA` ainda não pago
  - `PATCH /v1/debitos/{id}/quitar` atualizou o status desse débito para `PAGO`
  - nova consulta em `GET /v1/debitos/{id}` confirmou a alteração
  - tentativa de quitar um débito já `PAGO` retornou `409 Conflict`
  - tentativa de quitar um débito inexistente retornou `404 Not Found`

### Funcionalidade 2.3 API - Resumo de débitos por placa

- localização: `backend-nest/src/debito/aplicacao/service/Debito.service.ts` > (lines: 101-128), `backend-nest/src/debito/aplicacao/controller/Debito.controller.ts` > (lines: 41-46)
- Reprodução: autenticar no Swagger e executar `GET /v1/debitos/resumo?placa=ABC1234`.
- Descrição: o endpoint de resumo por placa já existia no controller, porém não possuía implementação no service.
- Solução: Implantação de busca por placa, a listagem dos débitos vinculados, o cálculo dos valores com multa e juros, a soma do valor total e o agrupamento por tipo de débito. Também mantive o retorno `404` quando a placa informada não existir.
- Validação:
  - o endpoint retorna `placa`, `proprietario`, `totalDebitos`, `valorTotal` e `porTipo`
  - `valorTotal` usa os valores calculados, não o valor bruto
  - `porTipo` retorna a soma dos débitos agrupados por tipo
  - ao informar uma placa inexistente, a API retorna `404 Not Found`

### Funcionalidade 2.4 API - Relatório de inadimplência

- localização: `backend-nest/src/relatorio/aplicacao/service/Relatorio.service.ts` > (lines: 18-77), `backend-nest/src/relatorio/aplicacao/controller/Relatorio.controller.ts` > (lines: 14-21)
- Reprodução: autenticar no Swagger e executar `GET /v1/relatorios/inadimplencia`.
- Descrição: o endpoint de relatório ja existente, porém não possuía implementação no service.
- Solução: implementação a busca dos débitos com status `VENCIDO`, carregando os dados do veículo relacionado, agrupando os resultados por veículo, calculando o valor total vencido com multa e juros, ordenando pelo maior valor e retornando também os totalizadores gerais do relatório.
- Validação:
  - o endpoint retorna apenas veículos com débitos `VENCIDO`
  - cada item retorna `placa`, `proprietario`, `modelo`, `totalDebitosVencidos` e `valorTotalVencido`
  - a lista vem ordenada por `valorTotalVencido` decrescente

### Funcionalidade 2.5 FRONT - Paginação na listagem de veículos

- localização: `frontend/src/app/page.tsx` > (lines: 18-25, 37-46, 107-115), `frontend/src/components/Paginacao.tsx` > (lines: 1-57)
- Reprodução: acessar a home `/`, navegar entre as páginas da listagem e observar a atualização dos veículos exibidos.
- Descrição: a API já retornava os dados paginados com `data`, `total`, `page` e `limit`, porém o frontend não possuía componente de paginação nem permitia mudar a página atual da listagem.
- Solução: implementei o componente `Paginacao.tsx` com botões `Anterior`, `Próxima` e números das páginas, além de integrar a navegação com o estado `paginaAtual` em `page.tsx`, refazendo a busca na API a cada mudança e deixei como default 4 itens para ficar harmônico a visualização.
- Validação:
  - ao clicar em `Próxima` ou em um número de página, a listagem é atualizada
  - `Anterior` fica desabilitado na primeira página
  - `Próxima` fica desabilitado na última página

### Funcionalidade 2.6 FRONT - Botão quitar débito

- localização: `frontend/src/app/veiculo/[placa]/page.tsx` > (lines: 39-101, 106-135, 154-158), `frontend/src/components/DebitosList.tsx` > (lines: 66-82)
- Reprodução: acessar a tela de detalhes de um veículo com débitos pendentes, como `/veiculo/DEF5678`, e clicar no botão `Quitar` em um débito com status diferente de `PAGO`.
- Descrição: A tela de detalhes nao existia a funcionalidade de quitar.
- Solução: Criei um botão com a ação de quitar na página de detalhes, chamando o endpoint de quitação, buscando novamente os débitos do veículo e atualizando o estado local da tela. Também adicionei feedback visual de sucesso e erro em formato de toast, além de loading apenas no botão selecionado durante a requisição. Para facilitar a visualização do carregamento na interface, deixei um pequeno atraso controlado na chamada antes do envio da requisição.
- Validação:
  - ao clicar em `Quitar`, apenas o botão do débito selecionado mostra loading
  - após sucesso, o status do débito passa para `PAGO`
  - o total em aberto é recalculado sem recarregar a página
  - em caso de erro, a tela exibe a mensagem retornada pela API
  - o feedback de sucesso ou erro aparece em formato de toast na tela

## Melhorias

### Melhoria API - Util compartilhado para cálculo e arredondamento monetário

- localização: `backend-nest/src/common/utils/calcularDebito.util.ts`, `backend-nest/src/common/utils/moeda.util.ts`, `backend-nest/src/debito/aplicacao/service/Debito.service.ts`, `backend-nest/src/relatorio/aplicacao/service/Relatorio.service.ts`
- Descrição: a regra de cálculo monetário dos débitos estava distribuída em mais de um service do backend. Isso aumentava o risco de inconsistência futura sempre que a fórmula de cálculo ou a regra de arredondamento precisassem ser alteradas.
- Solução: centralizei o cálculo em `calcularDebito.util.ts`, responsável por retornar `valorBase`, `valorMulta`, `valorJuros` e `valorTotal`, e mantive `moeda.util.ts` apenas com a responsabilidade de arredondamento. Assim, os services de débitos e relatórios passaram a reutilizar a mesma regra de cálculo.
- Validação:
  - os valores calculados continuaram retornando `valorBase`, `valorMulta`, `valorJuros` e `valorTotal` corretamente
  - os services de débitos e relatórios passaram a consumir a mesma regra de cálculo
  - futuras alterações na fórmula ou no arredondamento agora podem ser feitas em um único ponto

### Melhoria FRONT - Hook reutilizável de paginação

- localização: `frontend/src/hooks/usePaginacao.ts`, `frontend/src/app/page.tsx`
- Descrição: a lógica de paginação estava concentrada diretamente na página, o que dificultaria a reutilização desse comportamento em outras listagens da aplicação.
- Solução: criei o hook `usePaginacao`, centralizando `paginaAtual`, `limite`, `totalRegistros`, `totalPaginas` e as ações de navegação. O hook aceita `limiteInicial` opcional e, quando não informado, utiliza `4` como padrão.
- Validação:
  - a home passou a consumir o hook sem alterar o comportamento esperado
  
  ### Melhoria FRONT - Componente reutilizável de toast

- localização: `frontend/src/components/Toast.tsx`, `frontend/src/app/veiculo/[placa]/page.tsx`
- Descrição: o feedback visual de sucesso e erro estava implementado diretamente dentro da página de detalhes do veículo, deixando a interface acoplada à tela e dificultando a reutilização do mesmo padrão em outras partes do frontend.
- Solução: extraí o toast para um componente reutilizável `Toast.tsx`, recebendo `tipo`, `titulo`, `mensagem` e `onClose`. Depois, ajustei a página de detalhes para apenas consumir esse componente, mantendo o mesmo comportamento visual com uma estrutura mais organizada.
- Validação:
  - o toast continua aparecendo corretamente após sucesso ou erro na quitação
  - a página de detalhes passou a apenas consumir o componente
  - o frontend compilou normalmente após a extração
  
  ### Melhoria API - Validação centralizada de placa

- localização: `backend-nest/src/common/utils/placa.util.ts`, `backend-nest/src/common/pipes/placa.pipe.ts`, `backend-nest/src/veiculo/dominio/dto/CriarVeiculo.dto.ts`, `backend-nest/src/veiculo/aplicacao/controller/Veiculo.controller.ts`, `backend-nest/src/debito/aplicacao/controller/Debito.controller.ts`
- Descrição: a regra de validação e normalização de placa estava distribuída em mais de um ponto do backend, o que aumentava o risco de inconsistência entre valores recebidos por body, params e query string.
- Solução: centralizei um regex, a mensagem de erro e a normalização da placa em `placa.util.ts`, criei o `PlacaPipe` para validar parâmetros e querys e ajustei o `CriarVeiculoDto` para reutilizar a mesma regra no body. Também mantive a normalização reaproveitada nas consultas do backend.
- Validação:
  - placas inválidas passaram a retornar erro consistente nas rotas por parâmetro e query
  - a criação de veículo normaliza a placa automaticamente no DTO
  - controllers e services passaram a reutilizar a mesma regra de validação e normalização
  - teste de placa invalida pega com sucesso pelo dto
