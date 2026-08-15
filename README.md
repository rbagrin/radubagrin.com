# Radu Bagrin — Personal Workspace & Modular App Platform

A personal web application, developer portfolio, and extensible multi-module workspace built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Prisma 7**.

The application is engineered as a unified backend that serves both the server-rendered interactive web interface and a versioned, RESTful API (`/api/v1/...`) designed for future mobile clients.

---

## Table of Contents

- [Overview & Architecture](#overview--architecture)
- [Module System](#module-system)
  - [Active Modules](#active-modules)
  - [Preview & Upcoming Modules](#preview--upcoming-modules)
  - [Adding a New Module](#adding-a-new-module)
- [Technical Stack & Details](#technical-stack--details)
  - [Framework & UI](#framework--ui)
  - [Authentication & Security](#authentication--security)
  - [Database & Prisma 7 Architecture](#database--prisma-7-architecture)
  - [Cloud Storage (S3 / Cloudflare R2)](#cloud-storage-s3--cloudflare-r2)
  - [API Design: One Backend, Two Clients](#api-design-one-backend-two-clients)
- [Repository Structure](#repository-structure)
- [Local Setup & Development](#local-setup--development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview & Architecture

This application fulfills two core roles:

1. **Public Presentation Site (`/`)**: A fast, SEO-optimized landing page and personal profile featuring Schema.org JSON-LD structured data and modern typography.
2. **Authenticated Modular Workspace (`/modules`)**: A protected suite of self-contained productivity tools, data aggregators, and machine learning utilities.

All routes outside public presentation paths (`/`, `/login`, `/sitemap.xml`, `/robots.txt`) are protected by a Next.js proxy middleware.

---

## Module System

The platform features a modular architecture where each feature lives as an independent mini-application with its own user interface and dedicated API endpoints.

### Active Modules

| Module | Route | Status | Description |
| :--- | :--- | :--- | :--- |
| **Jarvis** | `/modules/jarvis` | `Active` | Personal AI assistant & MCP tool orchestrator. Features conversational reasoning, built-in workspace tools, AES-256 encrypted custom skill registration, and an interactive test sandbox. |
| **Documents** | `/modules/documents` | `Active` | Full-featured S3/Cloudflare R2 cloud storage manager with folder hierarchies, drag-and-drop file uploads, presigned download URLs, and PostgreSQL metadata indexing for RAG vector pipelines. |
| **RSS Aggregator** | `/modules/rss_aggregator` | `Active` | Multi-source RSS & Atom feed reader. Includes real-time feed validation, XML parsing (CDATA & HTML entity decoding), per-user feed persistence, and a two-column reading workspace. |
| **Todo** | `/modules/todo` | `Active` | Task and checklist manager with multi-list organization, optimistic UI updates, task counters, and automated sorting (completed tasks sink to the bottom). |

#### Module Highlights

- **Jarvis Module (AI & MCP Tools)**:
  - Natural AI conversation with tool calling across built-in workspace tools (`get_workspace_stats`, `list_todo_tasks`, `create_todo_task`, `list_rss_feeds`, `list_reminders`).
  - **Skill & Tool Registration (MCP)**: Register external webhooks and custom API tools conforming to the Model Context Protocol / JSON Schema standard.
  - **AES-256-GCM Secret Encryption**: Custom skill API tokens are encrypted at rest with server keys and injected securely without leaking to the LLM or client.
  - **SSRF Protection**: Prevents request forgery against private networks and cloud metadata endpoints.
  - **Interactive Testing Sandbox**: Test-execute any registered skill directly from the UI with custom JSON inputs.

- **Documents Module**:
  - Direct integration with S3 / Cloudflare R2 using AWS SDK v3 with a custom AWS SigV4 signer fallback.
  - Generates secure, time-limited (15-minute) presigned URLs for file downloads and previews.
  - Synchronizes file metadata (MIME type, size, folder path, status) into the PostgreSQL `Document` table.
  - In-app **RAG Metadata Inspector** to view vector indexing statuses (`uploaded`, `pending_embedding`, `indexed`, `error`) for downstream LLM retrieval.
  - Recursive folder deletion and strict path traversal sanitization.

- **RSS Aggregator Module**:
  - Live XML feed parser supporting both RSS 2.0 (`<channel>/<item>`) and Atom (`<feed>/<entry>`) standards.
  - Feed preview and discovery engine before saving to database.
  - Clean text extraction with HTML tag stripping, CDATA unwrapping, entity decoding, and publication date normalization.
  - Multi-feed sidebar with quick presets (e.g., OpenAI News, Google DeepMind) and responsive article stream.

- **Todo Module**:
  - Per-user customizable lists (`TodoList`) with isolated task items (`TodoItem`).
  - Optimistic client-side updates for instant task creation, toggling, and list renaming.
  - Responsive two-column view with active vs. completed task segregation.

---

### Preview & Upcoming Modules

| Module | Route | Status | Description |
| :--- | :--- | :--- | :--- |
| **Reminders** | `/modules/reminders` | `Preview` | Expiry and renewal tracker (MOT, passport, insurance) with days-until countdowns and notification channels (`email`, `push`). Backed by the Prisma `Reminder` model and `/api/v1/reminders`. |
| **Investing** | `/modules/investing` | `Preview` | Stock watchlist and portfolio performance tracker with proportional change visualizers. Backed by the `/api/v1/stocks` route. |
| **LinkedIn Poster** | `/modules/linkedin_poster` | `Coming Soon` | AI-assisted LinkedIn post generator and scheduled publishing tool. |
| **RAG System** | `/modules/rag_system` | `Coming Soon` | Retrieval-Augmented Generation module for conversational Q&A over documents stored in the Documents module. |

---

### Adding a New Module

Adding a new module takes three steps:

1. **Register the module** in [`lib/modules.ts`](file:///Users/rbagrin/Desktop/work/radubagrin.com/lib/modules.ts):
   ```typescript
   {
     slug: "new_tool",
     name: "New Tool",
     description: "Description of what this tool does.",
     status: "active", // "active" | "dummy" | "coming-soon"
   }
   ```
2. **Create the page component** at `app/modules/<slug>/page.tsx`.
3. The module automatically appears in the `/modules` directory grid.

---

## Technical Stack & Details

### Framework & UI

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime & UI Library**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Typography**: Google Fonts via `next/font` — *Space Grotesk* (display/headings), *Inter* (body), and *JetBrains Mono* (code/meta).
- **Design System**: Dark-mode-first aesthetic with custom CSS variables for surfaces, accents, and status indicators.

---

### Authentication & Security

- **Token Engine**: Built with [`jose`](https://github.com/panva/jose) using HMAC-SHA256 signatures (`HS256`).
  - **Access Tokens**: Short-lived (15 minutes).
  - **Refresh Tokens**: Long-lived (30 days) exchanged via `/api/v1/auth/refresh`.
- **Dual Authentication**:
  - **Web Client**: Tokens stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
  - **Mobile / External API Clients**: `Authorization: Bearer <accessToken>` header.
  - The unified `authenticate(request)` helper automatically inspects both sources.
- **Admin Verification**: Single-owner administrative password verification using [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js) against the `ADMIN_PASSWORD_HASH` environment variable.
- **Route Guard**: Global Next.js middleware proxy in [`proxy.ts`](file:///Users/rbagrin/Desktop/work/radubagrin.com/proxy.ts) guarding protected web pages and API routes.

---

### Database & Prisma 7 Architecture

- **Database**: PostgreSQL (Local Postgres 18 container via Docker Compose / Neon Serverless Postgres in production).
- **ORM**: [Prisma 7.9](https://www.prisma.io/)
- **Prisma 7 Configuration**:
  - Connection URLs no longer reside in `prisma/schema.prisma`.
  - **CLI Operations** (migrations, Studio): Configured in [`prisma.config.ts`](file:///Users/rbagrin/Desktop/work/radubagrin.com/prisma.config.ts) reading `DIRECT_URL` to bypass transaction pooling during migrations.
  - **Runtime Client** (`lib/db.ts`): Uses driver adapters based on the environment:
    - `@prisma/adapter-pg` + `pg.Pool` for local TCP PostgreSQL instances.
    - `@prisma/adapter-neon` for production serverless WebSocket pooling.
- **Database Schema Models**:
  - `User`: Root user account for module associations.
  - `Document`: Metadata storage for S3 objects, folder paths, and RAG indexing states.
  - `RssFeed`: User-saved RSS/Atom feed subscriptions with unique `(userId, url)` constraints.
  - `TodoList` & `TodoItem`: Multi-list task management with cascading relations.
  - `Reminder`: Date-based notification reminders.

---

### Cloud Storage (S3 / Cloudflare R2)

- Built in [`lib/s3.ts`](file:///Users/rbagrin/Desktop/work/radubagrin.com/lib/s3.ts) supporting AWS S3 and S3-compatible providers such as **Cloudflare R2**.
- **Features**:
  - AWS SDK v3 client (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`).
  - Native fallback SigV4 request signer with automatic region matrix handling and virtual-host resolution.
  - 15-minute presigned GET URLs for secure, direct asset downloads.
  - Zero-byte directory marker creation (`folder/`) and recursive prefix deletions.
  - Path traversal sanitization preventing directory traversal attacks.

---

### API Design: One Backend, Two Clients

The application exposes a consistent REST API versioned under `/api/v1/`:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate with email/password, issues tokens & session cookie | No |
| `POST` | `/api/v1/auth/refresh` | Exchange valid refresh token for new access token | No |
| `POST` | `/api/v1/auth/logout` | Clear session cookie | Yes |
| `POST` | `/api/v1/jarvis/chat` | AI chat & MCP tool orchestration endpoint | Yes |
| `GET` | `/api/v1/jarvis/skills` | List built-in workspace tools and user custom skills | Yes |
| `POST` | `/api/v1/jarvis/skills` | Register a new custom skill with AES-256 encryption | Yes |
| `PATCH` | `/api/v1/jarvis/skills/[id]` | Update skill configuration, status, or encryption key | Yes |
| `DELETE`| `/api/v1/jarvis/skills/[id]` | Delete a custom skill | Yes |
| `POST` | `/api/v1/jarvis/skills/test` | Test-execute a skill with sample arguments in sandbox | Yes |
| `GET` | `/api/v1/documents` | List S3 objects and Postgres metadata for a folder prefix | Yes |
| `POST` | `/api/v1/documents` | Create a folder in S3 | Yes |
| `DELETE`| `/api/v1/documents` | Delete an S3 file or entire folder prefix and metadata | Yes |
| `POST` | `/api/v1/documents/upload` | Upload a file to S3 and record Postgres metadata | Yes |
| `GET` | `/api/v1/documents/download` | Generate a 15-minute presigned download URL | Yes |
| `GET` | `/api/v1/rss` | List user's saved RSS feeds | Yes |
| `POST` | `/api/v1/rss` | Save a new RSS feed subscription | Yes |
| `DELETE`| `/api/v1/rss` | Delete a saved RSS feed | Yes |
| `POST` | `/api/v1/rss/preview` | Fetch and validate an external RSS/Atom XML feed | Yes |
| `GET` | `/api/v1/rss/items` | Fetch, parse, and stream articles from an RSS feed | Yes |
| `GET` | `/api/v1/todos` | List all todo lists and items for current user | Yes |
| `POST` | `/api/v1/todos` | Create a new todo list | Yes |
| `PATCH` | `/api/v1/todos/[listId]` | Rename a todo list | Yes |
| `DELETE`| `/api/v1/todos/[listId]` | Delete a todo list and all child items | Yes |
| `POST` | `/api/v1/todos/[listId]/items` | Create a todo item in a specific list | Yes |
| `PATCH` | `/api/v1/todos/items/[itemId]` | Update task completion status or title | Yes |
| `DELETE`| `/api/v1/todos/items/[itemId]` | Delete a specific task item | Yes |
| `GET` | `/api/v1/reminders` | Fetch reminders from PostgreSQL | Yes |
| `POST` | `/api/v1/reminders` | Create a reminder | Yes |
| `GET` | `/api/v1/stocks` | Fetch watchlist stock quotes | Yes |

---

## Repository Structure

```
├── app/
│   ├── api/v1/                  # REST API Route Handlers
│   │   ├── auth/                # Login, refresh, logout
│   │   ├── documents/           # S3 & metadata CRUD, upload, download
│   │   ├── jarvis/              # AI chat, skill management & test runner
│   │   ├── reminders/           # Reminders endpoints
│   │   ├── rss/                 # Feed subscriptions, preview, article parser
│   │   ├── stocks/              # Stock market data endpoint
│   │   └── todos/               # Multi-list todo & task CRUD
│   ├── login/                   # Admin authentication page
│   ├── modules/                 # Module pages
│   │   ├── layout.tsx           # Authenticated shell layout (header, logout)
│   │   ├── page.tsx             # Modules directory grid (/modules)
│   │   ├── jarvis/              # Jarvis AI Assistant & Skill Manager UI
│   │   ├── documents/           # Cloud storage manager UI
│   │   ├── rss_aggregator/      # RSS feed reader UI
│   │   ├── todo/                # Multi-list todo UI
│   │   ├── investing/           # Stocks watchlist UI (preview)
│   │   └── reminders/           # Reminders UI (preview)
│   ├── globals.css              # Tailwind v4 import & custom color theme
│   ├── layout.tsx               # Root layout, Google fonts, SEO meta tags
│   ├── page.tsx                 # Public portfolio & presentation page (/)
│   ├── robots.ts                # Dynamic robots.txt
│   └── sitemap.ts               # Dynamic sitemap.xml
├── lib/
│   ├── auth.ts                  # JWT token issuance, verification, cookie parsing
│   ├── db.ts                    # PrismaClient singleton with adapter switching
│   ├── documents.ts             # Document database metadata operations
│   ├── encryption.ts            # AES-256-GCM secret encryption helper
│   ├── modules.ts               # Central module registry
│   ├── rss.ts                   # RSS & Atom XML parser & sanitization engine
│   ├── s3.ts                    # AWS S3 / Cloudflare R2 client & SigV4 signer
│   └── skills.ts                # Skills execution engine & MCP tool definitions
├── prisma/
│   ├── migrations/              # PostgreSQL migration history
│   └── schema.prisma            # Prisma schema (models only)
├── docker-compose.yml           # Local PostgreSQL 18 development container
├── prisma.config.ts             # Prisma 7 CLI configuration (DIRECT_URL)
├── proxy.ts                     # Next.js proxy middleware for route protection
└── package.json
```

---

## Local Setup & Development

### 1. Prerequisites

- **Node.js**: v20+
- **Docker** (optional, for local PostgreSQL) or a **Neon Database** account.

### 2. Installation

```bash
git clone https://github.com/your-username/personal-app.git
cd personal-app
npm install
```

### 3. Start Local Database (Docker)

To run a local PostgreSQL container on port `5433`:

```bash
docker compose up -d
```

### 4. Configure Environment Variables

Copy the template file:

```bash
cp .env.example .env
```

Update `.env` with your secrets and connection strings. For local Docker development:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/personal_db?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/personal_db?schema=public"
AUTH_SECRET="your-secure-random-secret"
ADMIN_PASSWORD_HASH="$2a$10$..." # Bcrypt hash for admin login
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Pooled PostgreSQL connection string used by the running app. |
| `DIRECT_URL` | Direct (unpooled) PostgreSQL connection string used for Prisma migrations. |
| `AUTH_SECRET` | Secret key for signing JWT tokens (`openssl rand -base64 32`). |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of the admin password for `/login`. |
| `S3_ENDPOINT` | *(Optional)* Cloudflare R2 / S3 endpoint URL (e.g. `https://<account_id>.r2.cloudflarestorage.com`). |
| `S3_ACCESS_KEY_ID` | *(Optional)* S3 / R2 access key ID. |
| `S3_SECRET_ACCESS_KEY` | *(Optional)* S3 / R2 secret access key. |
| `S3_BUCKET_NAME` | *(Optional)* Target S3 bucket name. |
| `S3_REGION` | *(Optional)* S3 region (defaults to `auto`). |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key to enable live conversational reasoning & tool calling in Jarvis. |
| `GEMINI_MODEL` | *(Optional)* Gemini model name (defaults to `gemini-2.0-flash`). |

---

## Deployment

### Deploying to Render & Neon

1. **Database (Neon)**:
   - Create a project at [Neon](https://neon.tech).
   - Retrieve the **pooled connection string** (for `DATABASE_URL`) and **direct connection string** (for `DIRECT_URL`).
2. **Web Service (Render)**:
   - Connect your GitHub repository to Render.
   - **Build Command**: `npm install && npm run build` (automatically runs `prisma generate` followed by `next build`).
   - **Start Command**: `npm run start`
   - Add the environment variables (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, and optional `S3_*` keys).
3. **Database Migration**:
   - Run migrations against Neon once prior to launch:
     ```bash
     npx prisma migrate deploy
     ```
