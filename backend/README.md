# AdotaPet — Back-end

API REST da Plataforma de Adoção de Animais **AdotaPet**.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL |
| Testes | Vitest |
| Validação | Zod |

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+

## Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL

# 3. Gere o Prisma Client
npm run db:generate

# 4. Execute as migrations
npm run db:migrate

# 5. (Opcional) Popule o banco com dados de exemplo
npm run db:seed
```

## Comandos

```bash
npm run dev          # Servidor em modo watch (desenvolvimento)
npm run build        # Compila TypeScript → dist/
npm run start        # Inicia a versão compilada (produção)
npm run test         # Roda todos os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com relatório de cobertura
npm run db:studio    # Painel visual do banco (Prisma Studio)
npm run db:reset     # Reseta o banco (CUIDADO: apaga todos os dados)
```

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma     # Modelos do banco (Sprint 2)
│   └── seed.ts           # Dados iniciais (Sprint 2)
├── src/
│   ├── config/
│   │   ├── env.ts        # Validação das variáveis de ambiente (Zod)
│   │   ├── prisma.ts     # Singleton do PrismaClient
│   │   └── cors.ts       # Configuração de CORS
│   ├── controllers/      # Camada HTTP: recebe req, chama service, responde
│   ├── services/         # Regras de negócio
│   ├── repositories/     # Acesso ao banco via Prisma
│   ├── routes/           # Registro das rotas Express
│   │   └── index.ts      # Health check + registro dos módulos
│   ├── middlewares/
│   │   ├── errorHandler.ts  # Handler global de erros
│   │   ├── notFound.ts      # 404 handler
│   │   └── requestLogger.ts # Logs de requisições (Morgan)
│   ├── utils/
│   │   ├── AppError.ts   # Classes de erro padronizadas
│   │   └── apiResponse.ts # Helpers de resposta HTTP
│   ├── validations/      # Schemas Zod por entidade (Sprint 3+)
│   ├── tests/
│   │   ├── setup.ts      # Setup global do Vitest
│   │   ├── health.test.ts
│   │   └── AppError.test.ts
│   ├── app.ts            # Fábrica do Express (sem listen)
│   └── server.ts         # Entry point: bootstrap + listen
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Sprints

- [x] **Sprint 1** — Estrutura base *(atual)*
- [ ] **Sprint 2** — Modelagem do banco + Prisma
- [ ] **Sprint 3** — Autenticação JWT
- [ ] **Sprint 4** — Usuários
- [ ] **Sprint 5** — Animais
- [ ] **Sprint 6** — Upload de imagens
- [ ] **Sprint 7** — Favoritos
- [ ] **Sprint 8** — Adoção
- [ ] **Sprint 9** — Admin
- [ ] **Sprint 10** — Testes
