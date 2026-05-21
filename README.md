# Prontuários QP

Sistema web para gerenciamento de prontuários médicos integrado ao Google Drive. Permite listar pacientes, visualizar histórico de consultas por ano e registrar novas sessões diretamente em documentos do Google Docs.

---

## Funcionalidades

- **Login seguro** via conta Google (OAuth 2.0)
- **Lista de pacientes** em ordem alfabética, com busca em tempo real
- **Navegação por ano** — cada paciente tem uma pasta `Prontuário` com documentos separados por ano (2026, 2027...)
- **Leitura do histórico** de consultas formatadas por sessão
- **Registro de novas consultas** diretamente no Google Doc do ano corrente
- **Criação de novos pacientes** com estrutura de pastas automática no Drive
- **PWA** — instalável no iPhone e Android como aplicativo nativo
- **Filtragem automática** da pasta "arquivados"

---

## Estrutura de pastas no Google Drive

```
📁 Pasta raiz (configurada no .env)
  └── 📁 Nome do Paciente
        ├── 📁 Prontuário
        │     ├── 📄 2026   ← Google Doc com as sessões do ano
        │     ├── 📄 2027
        │     └── 📄 ...
        └── 📁 Outro        ← Exames, PDFs, imagens etc.
```

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Autenticação | NextAuth.js v4 (Google OAuth 2.0) |
| Armazenamento | Google Drive API v3 + Google Docs API v1 |
| Estilização | Styled Components |
| Linguagem | TypeScript |
| Testes | Jest + React Testing Library |
| Deploy | Vercel |

---

## Pré-requisitos

- Node.js 18+
- Conta Google com acesso ao Google Drive
- Projeto no [Google Cloud Console](https://console.cloud.google.com) com:
  - Google Drive API habilitada
  - Google Docs API habilitada
  - Credenciais OAuth 2.0 configuradas

---

## Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd drive-patients
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# ID da pasta raiz no Google Drive (URL: drive.google.com/drive/folders/<ID>)
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui

# Credenciais OAuth do Google Cloud Console
GOOGLE_OAUTH_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=seu_client_secret

# Chave secreta para o NextAuth (gere com: openssl rand -hex 32)
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# URL da aplicação (localhost para desenvolvimento)
NEXTAUTH_URL=http://localhost:3000
```

### 3. Configure o OAuth no Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto e habilite as APIs: **Google Drive API** e **Google Docs API**
3. Em **Credenciais → Criar credencial → ID do cliente OAuth**:
   - Tipo: Aplicativo da Web
   - URIs de redirecionamento autorizados: `http://localhost:3000/api/auth/callback/google`
4. Na tela de consentimento OAuth, adicione os escopos:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/documents`
5. Adicione seu e-mail como usuário de teste

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Endpoints administrativos

Disponíveis apenas com sessão autenticada. Execute no console do navegador (F12):

### Criar subpastas em pacientes existentes

Cria `📁 Prontuário` e `📁 Outro` nas pastas que ainda não possuem:

```javascript
fetch('/api/admin/setup-estrutura', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

### Renomear documentos para 2026

Renomeia todos os arquivos dentro de `Prontuário` para `2026`. Cria o doc caso a pasta esteja vazia:

```javascript
fetch('/api/admin/renomear-para-2026', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

### Migrar pasta local para o Drive

Faz upload de uma pasta local `back/` para o Drive com a estrutura correta:

```javascript
fetch('/api/admin/migrar', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
```

---

## Instalar como app no iPhone (PWA)

1. Abra o app no **Safari**
2. Toque no botão de compartilhar (↑)
3. Selecione **"Adicionar à Tela de Início"**
4. Confirme o nome e toque em **Adicionar**

O app abrirá sem barra do navegador, como um aplicativo nativo.

---

## Scripts úteis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Servidor de produção
npm test           # Executa os testes
```

### Gerar ícones PWA

```bash
node scripts/generate-icons.mjs
```

---

## Deploy (Vercel)

1. Faça o push para o GitHub
2. Importe o repositório no [vercel.com](https://vercel.com)
3. Configure as variáveis de ambiente (as mesmas do `.env.local`, com `NEXTAUTH_URL` apontando para o domínio de produção)
4. Adicione a URL de produção nos **URIs de redirecionamento** do Google Cloud Console

---

## Estrutura do projeto

```
├── app/
│   ├── api/
│   │   ├── admin/          ← Endpoints de migração (uso único)
│   │   ├── pacientes/      ← Listar e criar pacientes
│   │   └── prontuario/     ← Ler e salvar consultas
│   ├── busca/              ← Tela principal de busca
│   ├── login/              ← Tela de login
│   └── paciente/
│       └── [id]/
│           └── [docId]/    ← Consultas de um ano específico
├── src/
│   ├── components/         ← Componentes reutilizáveis
│   ├── hooks/              ← Hooks de estado e lógica
│   ├── services/           ← Integração com Drive e API
│   └── utils/              ← Funções auxiliares (parse, format)
├── public/                 ← Ícones PWA
└── scripts/                ← Scripts auxiliares
```
