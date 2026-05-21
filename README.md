# Prontuários QP

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.x-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Drive-API-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" />
  <img src="https://img.shields.io/badge/NextAuth.js-v4-7E57C2?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Styled--Components-6.x-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

> Sistema web para gerenciamento de prontuários médicos integrado ao Google Drive — o terapeuta acessa pelo app, navega pelo histórico de consultas por ano e registra novas sessões diretamente em documentos do Google Docs.

---

## Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Como rodar](#-como-rodar)
- [Estrutura no Drive](#-estrutura-no-drive)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Endpoints administrativos](#-endpoints-administrativos)
- [PWA — instalar no iPhone](#-pwa--instalar-no-iphone)
- [Deploy](#-deploy)

---

## Sobre

O **Prontuários QP** é um sistema web para clínicas e consultórios que já utilizam o Google Drive para armazenar prontuários. O profissional faz login com a sua conta Google, visualiza todos os pacientes em ordem alfabética, navega pelos documentos separados por ano e registra novas consultas — sem precisar abrir o Drive manualmente. O app é instalável no iPhone como um aplicativo nativo via PWA.

---

## Funcionalidades

**Busca de pacientes**
- 🔍 Listagem completa em ordem alfabética ao abrir o app
- ⌨️ Filtro por nome em tempo real com debounce
- ➕ Criação de novos pacientes com estrutura de pastas automática no Drive

**Prontuário**
- 📅 Navegação por ano — cada doc representa um ano (2026, 2027...)
- 📖 Leitura do histórico completo de consultas formatadas
- ✏️ Registro de nova consulta com data e descrição
- 💾 Salvo diretamente no Google Doc do ano corrente

**Geral**
- 🔐 Login seguro via OAuth 2.0 com a conta Google do profissional
- 📱 PWA instalável no iPhone e Android
- 🚫 Pasta "arquivados" oculta automaticamente da listagem

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│              Usuário (browser/PWA)          │
│  /busca        → lista de pacientes         │
│  /paciente/id  → seleção de ano             │
│  /paciente/id/docId → consultas do ano      │
└─────────────────────┬───────────────────────┘
                      │ fetch / API Routes
┌─────────────────────▼───────────────────────┐
│            Next.js App Router               │
│  /api/pacientes     → listar e criar        │
│  /api/prontuario    → ler e salvar          │
│  /api/admin         → migração (uso único)  │
└─────────────────────┬───────────────────────┘
                      │ OAuth2 token
┌─────────────────────▼───────────────────────┐
│           Google APIs                       │
│  Drive API v3  → pastas e arquivos          │
│  Docs API v1   → leitura e escrita de texto │
└─────────────────────────────────────────────┘
```

**Fluxo principal:**
1. Profissional faz login com a conta Google
2. App lista as pastas de pacientes da pasta raiz configurada no `.env`
3. Ao abrir um paciente, lista os docs de ano dentro da pasta `Prontuário`
4. Ao selecionar o ano, carrega e exibe as consultas do Google Doc
5. Nova consulta é inserida via `batchUpdate` no final do documento

### Estrutura de pastas

```
src/
├── app/                    # rotas Next.js App Router
│   ├── api/                # endpoints server-side
│   │   ├── admin/          # migração e organização do Drive
│   │   ├── pacientes/      # listar e criar pacientes
│   │   └── prontuario/     # ler e salvar consultas
│   ├── busca/              # tela principal
│   ├── login/              # tela de login
│   └── paciente/[id]/
│       └── [docId]/        # consultas por ano
├── src/
│   ├── components/         # componentes reutilizáveis
│   ├── hooks/              # useProntuario, useBuscarPacientes...
│   ├── services/           # driveService, prontuarioService
│   ├── utils/              # parse e formatação de consultas
│   └── constants/          # tema de cores e espaçamentos
├── public/                 # ícones PWA
└── scripts/                # geração de ícones PNG
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 App Router | Framework e roteamento |
| TypeScript | Tipagem estática |
| NextAuth.js v4 | Autenticação OAuth 2.0 com Google |
| Google Drive API v3 | Gerenciamento de pastas e arquivos |
| Google Docs API v1 | Leitura e escrita de documentos |
| Styled-Components | Estilização com tema |
| Jest + RTL | Testes unitários |

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- Conta Google com acesso ao Google Drive
- Projeto no [Google Cloud Console](https://console.cloud.google.com) com as APIs habilitadas

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/drive-patients.git

# Entrar na pasta
cd drive-patients

# Instalar dependências
npm install
```

### Executar

```bash
npm run dev
```

Acesse `http://localhost:3000` e faça login com a conta Google configurada.

---

## Estrutura no Drive

O app espera a seguinte estrutura de pastas no Google Drive:

```
📁 Pasta raiz  ← ID configurado no .env
  └── 📁 Nome do Paciente
        ├── 📁 Prontuário
        │     ├── 📄 2026   ← Google Doc com sessões do ano
        │     ├── 📄 2027
        │     └── 📄 ...
        └── 📁 Outro        ← Exames, PDFs, imagens etc.
```

> Para pacientes já existentes no Drive sem essa estrutura, use o endpoint `setup-estrutura` descrito abaixo.

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# ID da pasta raiz no Google Drive
# (encontre na URL: drive.google.com/drive/folders/<ID>)
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui

# Credenciais OAuth — Google Cloud Console
GOOGLE_OAUTH_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=seu_client_secret

# Chave secreta NextAuth (gere com: openssl rand -hex 32)
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# URL da aplicação
NEXTAUTH_URL=http://localhost:3000
```

| Variável | Descrição |
|---|---|
| `GOOGLE_DRIVE_FOLDER_ID` | ID da pasta raiz dos pacientes no Drive |
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID do projeto no Google Cloud |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Client Secret do projeto no Google Cloud |
| `NEXTAUTH_SECRET` | Chave para assinar os tokens de sessão |
| `NEXTAUTH_URL` | URL base da aplicação |

### Configurar OAuth no Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Habilite as APIs: **Google Drive API** e **Google Docs API**
3. Em **Credenciais → Criar credencial → ID do cliente OAuth**:
   - Tipo: Aplicativo da Web
   - URI de redirecionamento: `http://localhost:3000/api/auth/callback/google`
4. Na tela de consentimento, adicione os escopos:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/documents`
5. Adicione seu e-mail como usuário de teste

---

## Endpoints administrativos

Execute no console do navegador (F12) com o usuário autenticado em `localhost:3000`:

### Criar subpastas em pacientes existentes

Cria `📁 Prontuário` e `📁 Outro` nas pastas que ainda não possuem:

```javascript
fetch('/api/admin/setup-estrutura', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

### Renomear documentos para 2026

Renomeia arquivos dentro de `Prontuário` para `2026`. Cria o doc se a pasta estiver vazia:

```javascript
fetch('/api/admin/renomear-para-2026', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

### Migrar pasta local para o Drive

Faz upload da pasta `back/` do projeto para o Drive com a estrutura correta:

```javascript
fetch('/api/admin/migrar', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

---

## PWA — instalar no iPhone

1. Abra o app no **Safari**
2. Toque no botão de compartilhar **(↑)**
3. Selecione **"Adicionar à Tela de Início"**
4. Confirme o nome e toque em **Adicionar**

O app abrirá sem barra do navegador, idêntico a um aplicativo nativo.

---

## Deploy

### Vercel (recomendado)

1. Suba o repositório para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel da Vercel
4. Adicione a URL de produção nos **URIs de redirecionamento** do Google Cloud Console
5. Faça o deploy

```bash
npm run build   # testar o build localmente antes do deploy
```
