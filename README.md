# Sindify — Gestão Condominial Inteligente

Plataforma completa de gestão condominial, unindo portaria, financeiro, comunicação, manutenção e governança em um único lugar — com uma experiência pensada tanto para quem administra quanto para quem mora.

> Do DNA do condomínio à operação do dia a dia.

## 📋 Sobre o projeto

O Sindify nasceu para resolver um problema bem real: a gestão condominial no Brasil ainda é, na maior parte das vezes, manual, fragmentada e pouco transparente — tanto para síndicos quanto para moradores.

A proposta não é ser apenas mais um sistema de reservas ou um CRUD genérico, mas uma plataforma completa, modular e escalável, capaz de centralizar toda a operação de um condomínio.

## ✨ Funcionalidades

- **Autenticação e permissões** — login com JWT e controle de acesso por papel (síndico, morador, porteiro, zelador, conselheiro)
- **Apartamentos / Unidades** — gestão de moradores, visitantes autorizados, pets, veículos e contatos de emergência vinculados a cada unidade
- **Reservas de áreas comuns** — cadastro de espaços (salão de festas, sauna, área gourmet, churrasqueira, cinema, sala de jogos etc.) com verificação automática de conflito de horário
- **Veículos** — cadastro de veículos, vagas de garagem e condutores autorizados
- **Chamados de manutenção** — abertura, categorização (elétrica, hidráulica, estrutural, limpeza, segurança), priorização e acompanhamento de status
- **Financeiro** — controle financeiro e prestação de contas do condomínio
- **Avisos** — mural de comunicação entre administração e moradores
- **Votações / Assembleias digitais** — enquetes e votações para decisões do condomínio
- **Controle de acesso / Portaria** — registro de entradas e saídas

## 🔧 Stack utilizada

**Front-end**
- React + React Router
- Zustand (gerenciamento de estado)
- Lucide React (ícones)
- React Hot Toast (notificações)
- Tailwind CSS

**Back-end**
- Node.js + Express (API REST)
- MongoDB + Mongoose
- JWT + bcrypt (autenticação)

## 🏗️ Arquitetura

O projeto é dividido em dois pacotes independentes:

```
gestao-condominio/
├── client/                 # Aplicação React (Vite)
│   └── src/
│       ├── components/
│       │   └── layout/     # Header, Sidebar, Hero, Footer, etc.
│       ├── pages/          # Dashboard, Apartments, Bookings, Vehicles...
│       ├── services/       # Camada de API (axios)
│       └── store/          # Estado global (Zustand)
│
└── server/                 # API REST (Express)
    └── src/
        ├── config/         # Conexão com banco e sockets
        ├── controllers/    # Regras de negócio por domínio
        ├── middlewares/    # Autenticação e autorização por role
        ├── models/         # Schemas Mongoose
        ├── routes/         # Definição das rotas da API
        ├── seed/           # Scripts de seed (dados iniciais)
        └── utils/          # Helpers (respostas, paginação, JWT)
```

Cada domínio (apartamentos, reservas, veículos, financeiro, avisos, chamados, votações, acesso) possui seu próprio controller, model e arquivo de rotas — mantendo a base de código desacoplada e fácil de escalar.

Projeto em desenvolvimento ativo. Novas funcionalidades e refinamentos de UI/UX são adicionados continuamente.

## 📄 Licença

Este projeto é de uso pessoal/privado. Todos os direitos reservados.