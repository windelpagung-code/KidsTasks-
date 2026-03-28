# KidsTasks - Backend API

Sistema Gamificado de Controle de Mesada Infantil — NestJS + Prisma + MySQL

## Como Executar

### 1. Variáveis de Ambiente
O arquivo `.env` já está configurado com as credenciais do banco e Stripe.

### 2. Instalar Dependências
```bash
npm install
```

### 3. Banco de Dados (já configurado)
```bash
# Schema já foi aplicado via: npx prisma db push
# Seed já foi executado: admin@kidstasks.app / Admin@123

# Para reaplicar o schema (se necessário):
npx prisma db push

# Para ver/editar o banco via interface visual:
npx prisma studio
```

### 4. Iniciar em Desenvolvimento
```bash
npm run start:dev
```
> Nota: O primeiro start com ts-node pode levar 30-60 segundos para compilar.

### 5. Build para Produção
```bash
npm run build
node dist/main.js
```

## Endpoints Principais

Acesse o Swagger em: **http://localhost:3001/api/docs**

| Módulo | Rota |
|--------|------|
| Auth | POST /api/v1/auth/register, /login, /refresh |
| Filhos | GET/POST /api/v1/children |
| Tarefas | GET/POST /api/v1/tasks |
| Mesada | GET/POST /api/v1/allowance/periods |
| Carteira | GET /api/v1/wallet/:childId/balance |
| Gamificação | GET /api/v1/gamification/ranking |
| Loja | GET/POST /api/v1/store/items |
| Stripe | POST /api/v1/stripe/checkout |
| Admin | GET /api/v1/admin/metrics |

## Credenciais do Banco (Produção)
- Host: kidstasks.mysql.uhserver.com
- Database: kidstasks
- User: kidstasks

## Stripe (Modo Teste)
Configure os `price_id` dos planos no `.env` após criar os produtos no Dashboard Stripe.

## Arquitetura

```
src/
├── modules/
│   ├── auth/          # JWT + Refresh Tokens + Login Social
│   ├── children/      # Cadastro e gestão de filhos
│   ├── tasks/         # Tarefas, atribuições, conclusões
│   ├── allowance/     # Motor de cálculo de mesada
│   ├── wallet/        # Carteira virtual e extrato
│   ├── gamification/  # Pontos, níveis, badges, ranking
│   ├── store/         # Loja de recompensas
│   ├── badges/        # Sistema de conquistas
│   ├── notifications/ # Notificações in-app
│   ├── stripe/        # Pagamentos e webhooks
│   ├── tenants/       # Multi-tenant (famílias)
│   ├── users/         # Responsáveis
│   └── admin/         # Dashboard SuperAdmin
└── prisma/            # PrismaService
```
