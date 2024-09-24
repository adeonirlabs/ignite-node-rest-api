# Requisitos funcionais

- [ ] Deve ser possível criar uma nova transação
- [ ] Deve ser possível listar todas as transações
- [ ] Deve ser possível detalhar uma transação
- [ ] Deve ser possível atualizar uma transação
- [ ] Deve ser possível deletar uma transação
- [ ] Deve ser possível visualizar uma transação específica
- [ ] Deve ser possível obter o resumo da conta

# Requisitos não funcionais

- [x] Utilizar o Bun como runtime
- [x] Utilizar o Fastify como framework da aplicação
- [x] Utilizar o SQLite como banco de dados
- [x] Utilizar o Knex como query builder
- [x] Utilizar o Zod como validação de dados

# Regras de negócio

- Não deve ser possível criar uma transação sem um título
- Não deve ser possível criar uma transação sem um valor
- Não deve ser possível criar uma transação com um valor negativo
- A transação pode ser do tipo `expense` ou `income`
- Deve ser possível identificar o usuário que fez a transação
- O usuário só pode visualizar transações que ele fez
- Não deve ser possível criar uma transação para um usuário que não existe