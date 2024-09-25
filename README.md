> Ignite

# Node.js Rest API

## Projeto

Este é um projeto de uma Rest API desenvolvido durante o Ignite da Rocketseat.

## Tecnologias

- Fastify
- Knex
- SQLite
- TypeScript
- Biome
- Zod
- Tsup

## Rodando o projeto

### Pré-requisitos

- Bun

### Instalação

Clone o repositório e instale as dependências.

```bash
git clone https://github.com/adeonirlabs/rocketseat-node-rest-api.git
cd rocketseat-node-rest-api
bun install
```

Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente.

```bash
cp .env.example .env
```

Rode o comando para rodar as migrations.

```bash
bun db:migrate
```

> Obs: Se você precisa voltar uma migration, pode usar o comando `bun db:rollback`.

Suba o servidor de desenvolvimento

```bash
bun run dev
```

## Documentação

[API Documentation](./postman-collection.json)
