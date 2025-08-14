# Chef na Sua Casa 🍳

Uma plataforma web para agendar serviços de cozinheiras profissionais para refeições personalizadas em casa.

## 🚀 Funcionalidades

### Área do Cliente
- ✅ Cadastro e login
- ✅ Perfil com preferências alimentares
- ✅ Escolha de planos (avulso, mensal, trimestral)
- ✅ Agendamento de refeições
- ✅ Seleção de cardápios
- ✅ Confirmação de agendamentos
- ✅ Histórico de pedidos

### Área da Cozinheira
- ✅ Login e dashboard
- ✅ Lista de agendamentos
- ✅ Calendário de compromissos
- ✅ Detalhamento dos pedidos
- ✅ Gerenciamento de ingredientes

### Área Administrativa
- ✅ Dashboard com métricas
- ✅ Gerenciamento de usuários
- ✅ Controle de agendamentos
- ✅ Gestão de planos e cardápios

## 🛠️ Stack Técnica

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: NextAuth.js
- **Deploy**: Local (desenvolvimento)

## 📋 Pré-requisitos

- Node.js 18+ 
- Yarn ou npm
- PostgreSQL (local ou serviço cloud)
- Git

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd chef-na-sua-casa
```

### 2. Instale as dependências
```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chef_na_sua_casa"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

**Opções para banco de dados:**

**Local (PostgreSQL):**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/chef_na_sua_casa"
```

**Supabase (gratuito):**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**NeonDB (gratuito):**
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]"
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
yarn prisma generate

# Execute as migrações
yarn prisma db push

# (Opcional) Abra o Prisma Studio para visualizar os dados
yarn prisma studio
```

### 5. Execute a aplicação
```bash
yarn dev
```

A aplicação estará disponível em: http://localhost:3000

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **users**: Usuários (clientes, cozinheiras, admin)
- **client_profiles**: Perfis dos clientes
- **chef_profiles**: Perfis das cozinheiras
- **plans**: Planos de assinatura
- **menus**: Cardápios disponíveis
- **bookings**: Agendamentos

### Tipos de Usuário
- `CLIENT`: Clientes que fazem agendamentos
- `CHEF`: Cozinheiras que prestam serviços
- `ADMIN`: Administradores da plataforma

## 🔐 Contas de Teste

### Cliente
- Email: `cliente@teste.com`
- Senha: `123456`

### Cozinheira
- Email: `chef@teste.com`
- Senha: `123456`

### Admin
- Email: `admin@teste.com`
- Senha: `123456`

## 📱 Como Usar

### Para Clientes
1. Acesse a página inicial
2. Clique em "Cadastrar" e escolha "Cliente"
3. Preencha seus dados e preferências alimentares
4. Faça login e acesse "Novo Agendamento"
5. Escolha plano, cardápio e agende data/horário
6. Confirme o agendamento

### Para Cozinheiras
1. Cadastre-se como "Cozinheira"
2. Preencha especialidades, experiência e taxa por hora
3. Acesse o dashboard para ver agendamentos
4. Gerencie seu calendário e ingredientes

### Para Administradores
1. Acesse `/admin` (apenas usuários com role ADMIN)
2. Visualize métricas da plataforma
3. Gerencie usuários, agendamentos e configurações

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `tailwind.config.js`:
- Primária: Laranja (`orange-600`)
- Secundária: Vermelho (`red-500`)
- Acentos: Azul, Verde, Roxo

### Componentes
A aplicação usa Shadcn UI, permitindo fácil customização dos componentes.

## 🚀 Deploy

### Desenvolvimento Local
```bash
yarn dev
```

### Produção
```bash
yarn build
yarn start
```

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
DATABASE_URL="sua-url-de-producao"
NEXTAUTH_SECRET="chave-secreta-forte"
NEXTAUTH_URL="https://seu-dominio.com"
```

## 📁 Estrutura do Projeto

```
chef-na-sua-casa/
├── app/                    # App Router do Next.js
│   ├── admin/             # Área administrativa
│   ├── auth/              # Autenticação
│   ├── chef/              # Área da cozinheira
│   ├── client/            # Área do cliente
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globais
├── components/             # Componentes React
│   └── ui/                # Componentes Shadcn UI
├── lib/                    # Utilitários
├── prisma/                 # Schema e migrações do banco
├── hooks/                  # Hooks customizados
└── public/                 # Arquivos estáticos
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env.local`
- Teste a conexão: `yarn prisma db push`

### Erro de Autenticação
- Verifique se `NEXTAUTH_SECRET` está definido
- Confirme se `NEXTAUTH_URL` está correto
- Limpe cookies e cache do navegador

### Erro de Build
- Delete `node_modules` e `yarn.lock`
- Execute `yarn install` novamente
- Verifique versões do Node.js (18+)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato: [seu-email@exemplo.com]

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de avaliações
- [ ] Chat entre cliente e cozinheira
- [ ] Integração com WhatsApp
- [ ] Sistema de pagamentos
- [ ] App mobile
- [ ] Relatórios avançados
- [ ] Sistema de notificações push

---

**Desenvolvido com ❤️ para conectar pessoas através da gastronomia**
