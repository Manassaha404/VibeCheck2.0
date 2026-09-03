# VibeCheck 2.0

> **Create polls, quizzes, forms, and petitions — free, fast, and beautiful.**

VibeCheck is a full-stack, AI-powered engagement platform that lets anyone create and share polls, scored quizzes, custom forms, and community petitions in seconds. It features real-time collaborative sessions, AI-generated quiz questions, Google Drive document ingestion, a fully managed subscription system, and a neubrutalist design system that makes sharing irresistible.

🌐 **Live:** [vibecheck.manasx.online](https://vibecheck.manasx.online)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker (Production-like)](#docker-production-like)
- [Environment Variables](#environment-variables)
- [AI Agents](#ai-agents)
- [Real-Time System](#real-time-system)
- [Payments & Subscriptions](#payments--subscriptions)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 🗳️ Polls
- Multi-option or binary voting with public/private visibility
- Real-time vote counts streamed via Socket.IO
- Commenting, tagging, and view tracking
- CSV export of results

### 🧠 Quizzes
- AI-powered quiz builder — generate questions from a topic, a prompt, or an uploaded document (PDF, DOCX, XLSX, Google Drive)
- Multi-format questions: **multiple choice** (single or multi-correct) and **text entry**
- Configurable per-question time limits and point values
- Live multiplayer sessions: host controls pace; participants join via QR code or shareable link
- Real-time leaderboard with rank updates after every answer reveal
- Detailed session analytics and per-participant results

### 📋 Forms
- Drag-and-drop field builder (powered by `@dnd-kit`)
- AI form builder agent: describe the form you want in plain English and the agent builds it
- AI respondent agent: an embedded chatbot that helps respondents fill out complex forms conversationally
- Google Drive document upload as form context
- Response analytics with geographic heatmaps (Leaflet / D3 / react-simple-maps)

### 📣 Petitions
- Verified signature collection
- Automated email notifications on milestones (Resend)
- Tag-based categorisation and discovery

### 🔍 Explore
- Public content feed for polls, quizzes, forms, and petitions
- Trending surfacing, tag filtering, and content saving

### 💳 Subscriptions
- Razorpay-powered checkout with webhook verification
- Plan tiers with per-feature usage quotas tracked in Postgres
- Coupon / promo-code redemptions

---

## Architecture

```
                         ┌─────────────────────────────────────────┐
                         │            Traefik (Edge Proxy)          │
                         └────────────────┬────────────────────────┘
                                          │ HTTPS (TLS via Let's Encrypt)
                         ┌────────────────▼────────────────────────┐
                         │         Caddy (Internal Reverse Proxy)   │
                         └──────┬──────────────┬────────────────────┘
                                │              │
              ┌─────────────────▼──┐    ┌──────▼────────────┐
              │   Next.js (web)    │    │  Express API (api) │
              │   :3000            │    │  :8000             │
              └────────────────────┘    └──────┬────────────┘
                                               │ tRPC + REST
              ┌────────────────────────────────▼──────────────────┐
              │                    PostgreSQL                       │
              │          (Drizzle ORM · schema migrations)         │
              └───────────────────────────────────────────────────┘
              ┌────────────────────────────────────────────────────┐
              │              Redis (Pub/Sub + BullMQ)              │
              └────────────────────────────────────────────────────┘
              ┌────────────────────────────────────────────────────┐
              │              Qdrant (Vector Database)              │
              │   (document embeddings for RAG-based quiz/form AI) │
              └────────────────────────────────────────────────────┘
              ┌────────────────────────────────────────────────────┐
              │          Socket.IO Server (socket) :8080           │
              │     (quiz sessions · poll updates · agent status)  │
              └────────────────────────────────────────────────────┘
              ┌────────────────────────────────────────────────────┐
              │              Inngest (Durable Workflows)           │
              │  (AI agent jobs · email sends · background tasks)  │
              └────────────────────────────────────────────────────┘
```

All services communicate over a private Docker bridge network (`vibecheck_network`). Caddy handles internal routing and TLS termination; Traefik at the edge handles the public-facing certificate via Let's Encrypt.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4, Framer Motion, GSAP, shadcn/ui |
| **API** | Express 5, tRPC v11, Zod |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Cache / Pub-Sub** | Redis 7 |
| **Vector DB** | Qdrant |
| **Real-Time** | Socket.IO 4 |
| **Background Jobs** | Inngest 4 |
| **AI / Agents** | OpenAI Agents SDK (`@openai/agents`), LangChain, GPT-4o-mini |
| **Auth** | Google OAuth 2.0 (JWT refresh-token cookie flow) |
| **Payments** | Razorpay (checkout + webhooks) |
| **Email** | Resend |
| **File Storage** | Cloudinary |
| **Document Parsing** | `pdf-parse`, `mammoth` (DOCX), `xlsx`, `cheerio`, Google Drive API |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Containerisation** | Docker, Docker Compose, Caddy, Traefik |
| **Language** | TypeScript 5.9 throughout |

---

## Monorepo Structure

```
VibeCheck2.0/
├── apps/
│   ├── web/          # Next.js frontend (App Router)
│   ├── api/          # Express REST + tRPC API server
│   └── socket/       # Standalone Socket.IO server
│
├── packages/
│   ├── database/     # Drizzle schema, migrations, db client
│   ├── services/     # All business logic
│   │   ├── agent/
│   │   │   ├── quizBuilderAgent/   # Router · Builder · Reducer agents
│   │   │   ├── formBuilderAgent/   # AI form-field generation
│   │   │   └── formRespondentAgent/# Conversational form-fill assistant
│   │   ├── quiz/     # Quiz CRUD, sessions, scoring
│   │   ├── form/     # Form CRUD, response handling
│   │   ├── poll/     # Poll CRUD, voting, comments
│   │   ├── petition/ # Petition CRUD, signature management
│   │   ├── inngest/  # Durable background functions (agent runners, emails)
│   │   ├── auth/     # JWT helpers, bcrypt
│   │   ├── email/    # Resend email templates
│   │   ├── upload/   # Cloudinary + document parsing pipeline
│   │   ├── googleApis/ # Google Drive integration
│   │   ├── razorpay/ # Payment service
│   │   ├── redis/    # Pub/Sub helpers
│   │   └── utils/    # Rate limiting, shared utilities
│   ├── trpc/         # Shared tRPC router definitions & context
│   ├── socket/       # Socket.IO handlers (quiz, poll, agent status)
│   ├── redis/        # Redis client factory
│   ├── log/          # Structured logger (Winston / OpenTelemetry)
│   ├── error/        # Shared error types
│   ├── eslint-config/
│   └── typescript-config/
│
├── edge/             # Traefik edge-proxy configuration
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.api-gateway.yml
├── Caddyfile
└── turbo.json
```

---

## Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18+ |
| pnpm | 9.15+ |
| Docker & Docker Compose | 24+ |

### Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-org>/VibeCheck2.0.git
   cd VibeCheck2.0
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Copy the example env files (see [Environment Variables](#environment-variables) below) and fill in the required secrets:
   ```bash
   cp packages/services/.env.example packages/services/.env
   cp apps/api/.env.example apps/api/.env
   cp apps/socket/.env.example apps/socket/.env
   cp packages/database/.env.example packages/database/.env
   ```

4. **Spin up infrastructure services** (Postgres, Redis, Qdrant, Inngest)
   ```bash
   docker compose -f docker-compose.override.yml up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start all apps in dev mode**
   ```bash
   pnpm dev
   ```

   | Service | URL |
   |---|---|
   | Web | http://localhost:3000 |
   | API | http://localhost:8000 |
   | Socket | http://localhost:8080 |
   | Inngest Dev Server | http://localhost:8288 |

### Docker (Production-like)

Build and run the full stack with Docker Compose:

```bash
# Set your Docker Hub username and optional image tag
export DOCKERHUB_USERNAME=yourusername
export TAG=latest

# Pull and start all services
docker compose up -d
```

Caddy will serve the app on port 80. Point a domain at your host and update the `Caddyfile` and Traefik labels in `docker-compose.yml` accordingly.

---

## Environment Variables

Below is a summary of the key variables required across the services. Refer to the `.env` files in each package/app for the full list.

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | `api`, `services`, `database` | PostgreSQL connection string |
| `REDIS_URL` | `api`, `socket`, `services` | Redis connection string |
| `QDRANT_URL` | `services` | Qdrant vector DB URL |
| `OPENAI_API_KEY` | `services` | OpenAI API key for agents |
| `INNGEST_SIGNING_KEY` | `api` | Inngest signing key |
| `INNGEST_EVENT_KEY` | `api` | Inngest event key |
| `GOOGLE_CLIENT_ID` | `api`, `services` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `api`, `services` | Google OAuth client secret |
| `RAZORPAY_KEY_ID` | `api`, `services` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | `api`, `services` | Razorpay secret key |
| `RESEND_API_KEY` | `services` | Resend email API key |
| `CLOUDINARY_CLOUD_NAME` | `services` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `services` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `services` | Cloudinary API secret |
| `JWT_SECRET` | `api` | Secret for signing JWT refresh tokens |
| `CLIENT_URL` | `api` | Frontend origin (e.g. `http://localhost:3000`) |

---

## AI Agents

VibeCheck uses the **OpenAI Agents SDK** to run multi-agent pipelines as durable Inngest background functions. All agent runs are asynchronous and streamed back to the client via Redis Pub/Sub → Socket.IO.

### Quiz Builder Pipeline

```
User prompt / document
        │
        ▼
┌──────────────────────┐
│  routerQuizBuilder   │  ← Decides: RAG retrieval or direct generation
│  Agent (gpt-4o-mini) │
└──────────┬───────────┘
           │
     ┌─────▴─────┐
     │           │
     ▼           ▼
  RAG path   Direct path
  (Qdrant    (quizBuilder
  chunks)     Agent)
     │           │
     └─────┬─────┘
           ▼
  ┌──────────────────────┐
  │ reducerQuizBuilder   │  ← Deduplicates & quality-filters batched output
  │ Agent (gpt-4o-mini)  │
  └──────────────────────┘
           │
           ▼
    Structured JSON
  (QuestionOutputSchema)
```

- **Batch mode**: uploads are chunked and processed in parallel; a reducer agent merges and de-duplicates the results.
- **RAG mode**: semantic search over Qdrant embeddings retrieves the most relevant document chunks before question generation.
- Input and output **guardrails** enforce safe, on-topic content.

### Form Builder Agent

Generates structured form field definitions from a plain-English prompt, taking into account the form's existing fields to avoid duplication.

### Form Respondent Agent

An embedded conversational agent within a published form. It reads the form schema and guides respondents through complex or conditional fields in a chat-like interface.

---

## Real-Time System

The Socket.IO server (`apps/socket`) uses a **Redis Pub/Sub fan-out** pattern so the server can be horizontally scaled:

```
tRPC mutation (e.g., "reveal answer")
        │
        ▼
  publisher.publish("redis:quiz:reveal:answer", payload)
        │
        ▼
  Redis Pub/Sub
        │
        ▼
  subscriber (in socket server)
        │
        ▼
  io.to("quiz:session:participant:<sessionId>").emit("reveal:answer", payload)
        │
        ▼
  All connected participants update their UI in real-time
```

**Socket namespaces / channels:**

| Channel | Purpose |
|---|---|
| `redis:quiz:*` | Quiz session lifecycle (join, question emit, answer submit, reveal, end) |
| `redis:poll:*` | Live poll vote updates |
| `redis:agent:status` | Form builder / respondent agent progress |
| `redis:quiz-agent:status` | Quiz builder agent progress |

---

## Payments & Subscriptions

Payments are handled by **Razorpay**:

1. The client calls a tRPC mutation to create an order.
2. Razorpay Checkout collects payment client-side.
3. Razorpay sends a webhook to `/razorpay/webhook`.
4. The webhook handler verifies the signature and activates the user's subscription.
5. Usage is tracked per-feature in the `usages` table and checked on every AI agent invocation and content creation.

---

## Contributing

1. Fork the repository and create your feature branch: `git checkout -b feat/my-feature`
2. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add X"`
3. Run type-checks and linting: `pnpm check-types && pnpm lint`
4. Open a Pull Request against `main`.

---

## License

This project is **proprietary**. All rights reserved © 2025 VibeCheck.
