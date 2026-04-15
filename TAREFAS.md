# Tarefas — Teste Técnico Consulta Veicular

> Leia este documento na íntegra antes de começar. Ele define tudo que precisa ser feito.

---

## Visão geral

O projeto é um sistema de **consulta de débitos veiculares** com dois backends e um frontend:

| Pasta | Stack | Porta |
|---|---|---|
| `backend-express/` | Node.js + Express + TypeScript | `3001` |
| `backend-nest/` | NestJS + TypeScript | `3001` |
| `frontend/` | Next.js 14 + TypeScript + Tailwind | `3000` |

**Escolha um dos dois backends para trabalhar** — Express ou NestJS. A escolha é sua, mas **a preferência é NestJS**.
O frontend é obrigatório independente do backend escolhido.

---

## Como rodar

```bash
# Backend Express (porta 3001)
cd backend-express && cp .env.example .env && npm install && npm run dev

# Backend NestJS (porta 3001)
cd backend-nest && cp .env.example .env && npm install && npm run start:dev
# Swagger disponível em http://localhost:3001/docs

# Frontend
cd frontend && cp .env.example .env && npm install && npm run dev
```

> Se usar NestJS, edite o `frontend/.env` e troque `NEXT_PUBLIC_API_URL` para `http://localhost:3001` e `NEXT_PUBLIC_API_PREFIX` para `/v1`.

**Usuário de teste:**
```
email: admin@consultaveicular.com
senha: admin123
```

---

## O que você deve entregar

### 1. Arquivo `BUGS.md` na raiz do projeto

Para cada bug encontrado e corrigido, documente:
- **Localização**: arquivo + linha aproximada
- **Descrição**: o que estava errado e qual o impacto real
- **Solução**: como você corrigiu e por quê

---

## Parte 1 — Bugs para corrigir

O projeto possui **pelo menos 6 bugs no `backend-nest`** e pelo menos **4 bugs no `backend-express`** (as mesmas categorias, implementações diferentes). Trabalhe no backend que você escolheu.
A tabela abaixo é referente ao NestJS — mas vale como guia para o Express também.
Não está indicado onde estão: cabe a você analisar, reproduzir e corrigir.

### Prévia dos bugs (backend-nest)

| # | Categoria | Sintoma observável |
|---|---|---|
| B1 | Configuração / Segurança | Payloads inválidos são aceitos sem nenhum erro de validação |
| B2 | Autenticação | A rota de login retorna erro mesmo com credenciais corretas |
| B3 | Geral | Endpoint de débitos por placa sempre retorna lista vazia |
| B4 | Regra de negócio | Os valores calculados dos débitos estão incorretos |
| B5 | HTTP | Status code de criação de veículo está errado |
| B6 | Filtro | Filtrar débitos por `status` ou `tipo` não tem efeito |

### Bugs no frontend

Há pelo menos **mais 3 bugs** no `frontend/`. Use o mesmo raciocínio: teste o comportamento esperado, observe o que acontece, leia o código.

### Critérios de aceite para bugs

- O bug deve ser reproduzível — descreva como reproduzir no `BUGS.md`
- A correção não deve quebrar outros comportamentos
- Tipos TypeScript devem permanecer corretos após a correção

---

## Parte 2 — Funcionalidades para implementar

> As funcionalidades 2.1 a 2.4 se aplicam ao backend escolhido.
> No NestJS os endpoints são prefixados com `/v1/`. No Express são `/api/`.

### 2.1 Filtro avançado de veículos

**Endpoint**: `GET /veiculos`

Os query params `proprietario`, `modelo`, `anoMin` e `anoMax` são aceitos pela API mas **ignorados completamente** — a listagem sempre retorna todos os veículos.

**O que implementar:**
- Filtro por `proprietario`: busca parcial (case-insensitive), ex: `?proprietario=silva` deve encontrar "João da Silva"
- Filtro por `modelo`: busca parcial, ex: `?modelo=civic` deve encontrar "Honda Civic"
- Filtro por `anoMin` e `anoMax`: intervalo de ano de fabricação, ex: `?anoMin=2019&anoMax=2021`
- Os filtros podem ser combinados

---

### 2.2 Quitar débito

**Endpoint**: `PATCH /debitos/:id/quitar`

O endpoint já existe mas não está implementado.

**O que implementar:**
1. Buscar o débito pelo `id` — retornar erro 404 se não encontrado
2. Verificar se o débito já está com status `PAGO` — se sim, retornar erro 409 com mensagem clara
3. Atualizar o status para `PAGO`

---

### 2.3 Resumo de débitos por placa

**Endpoint**: `GET /debitos/resumo?placa=XXX`

O endpoint existe mas não está implementado.

**Retorno esperado:**
```json
{
  "placa": "ABC1234",
  "proprietario": "João da Silva",
  "totalDebitos": 3,
  "valorTotal": 1437.50,
  "porTipo": {
    "IPVA": 1048.50,
    "MULTA": 300.00,
    "LICENCIAMENTO": 89.00
  }
}
```

> **Atenção:** `valorTotal` deve usar os valores calculados (com multa e juros), não o valor bruto.

---

### 2.4 Relatório de inadimplência

**Endpoint**: `GET /relatorios/inadimplencia`

O endpoint existe mas não está implementado.

**Retorno esperado:**
- Lista de veículos que possuem débitos com status `VENCIDO`
- Para cada veículo: `placa`, `proprietario`, `modelo`, `totalDebitosVencidos`, `valorTotalVencido`
- Ordenado pelo `valorTotalVencido` decrescente
- Totalizadores: `totalVeiculos` e `valorTotalGeral`

---

### 2.5 `frontend` — Paginação na listagem de veículos

A API já retorna `{ data, total, page, limit }` e os estados `paginaAtual` e `totalPaginas` já existem no componente `page.tsx`.

**O que implementar:**

- Criar um componente `Paginacao.tsx` em `frontend/src/components/`
- O componente deve receber `paginaAtual`, `totalPaginas` e um callback `onMudar`
- Exibir botões Anterior / Próximo e os números das páginas
- Desabilitar "Anterior" na primeira página e "Próximo" na última
- Integrar com `page.tsx`: ao mudar de página, re-buscar os dados

---

### 2.6 `frontend` — Botão "Quitar" débito

Na tela de detalhes do veículo (`/veiculo/[placa]`), adicionar um botão **"Quitar"** em cada débito com status `PENDENTE` ou `VENCIDO`.

**Comportamento esperado:**
- Ao clicar, chamar `PATCH /v1/debitos/:id/quitar`
- Mostrar estado de loading no botão durante a requisição
- Ao concluir, atualizar a lista de débitos sem recarregar a página
- Mostrar mensagem de sucesso ou erro

---

## Parte 3 — Melhorias (opcional)

Se sobrar tempo, implemente melhorias que você julgar relevantes e documente no `BUGS.md` (seção "Melhorias").

Sugestões (não obrigatórias):
- Testes unitários para `calcularTotais` em `Debito.service.ts`
- Tratamento de erro global no NestJS (exception filter)
- Validação de placa centralizada no backend-nest
- Feedback visual no frontend quando a API retorna erro

---

## Entrega

- Suba o projeto em um repositório no GitHub (ou outro meio do seu uso)
- Prazo: **3-4 dias** a partir do recebimento

---

## Critérios de avaliação

| Critério | O que observamos |
|---|---|
| **Capacidade de análise** | Identificou os bugs sem que alguém apontasse? Entendeu o sistema antes de sair mudando? |
| **Qualidade de código** | O código que você escreveu é limpo, tipado corretamente e consistente com o restante do projeto? |
| **Resolução de problemas** | As soluções são corretas, diretas e bem fundamentadas? |
| **Comunicação** | O `BUGS.md` explica claramente o raciocínio — problema, impacto e solução? |

> Qualidade > quantidade. Prefira entregar menos funcionalidades bem feitas.
> Não reescreva o projeto — trabalhe dentro da estrutura existente.
