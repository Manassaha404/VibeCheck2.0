# VibeCheck

VibeCheck is a modern, high-performance form builder application. It allows users to create customizable forms, share them securely, and analyze responses in real-time.

## Tech Stack

This project is built as a monorepo using **Turborepo** and **pnpm** workspaces.

### Frontend (`apps/web`)
- **Next.js 14** (App Router)
- **React**
- **Tailwind CSS**
- **tRPC Client** for end-to-end type safety
- **Zod** for schema validation

### Backend (`apps/api`)
- **Express.js** + **Node.js**
- **tRPC Server**
- **Scalar / OpenAPI** for interactive API documentation
- **JSON Web Tokens (JWT)** for authentication (HTTP-only cookies)

### Database & Services (`packages/*`)
- **Drizzle ORM** for database interaction
- **PostgreSQL** (Neon DB recommended)
- **Resend** for email notifications (OTP verification, password resets)

## Monorepo Structure

```
my-monorepo/
├── apps/
│   ├── web/                # Next.js frontend application
│   └── api/                # Express backend server (tRPC + REST)
├── packages/
│   ├── database/           # Drizzle ORM schemas and db instance
│   ├── error/              # Custom application errors
│   ├── schema/             # Shared validation schemas
│   ├── services/           # Core business logic (auth, forms, etc.)
│   ├── trpc/               # tRPC routers and procedures
│   ├── typescript-config/  # Shared tsconfig settings
│   └── ui/                 # Shared React components (if applicable)
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL database instance

### 1. Install Dependencies

Install all dependencies from the root of the monorepo:

```sh
pnpm install
```

### 2. Environment Variables

Create `.env` files in the respective directories based on the required configurations.

**`apps/api/.env`**
```env
PORT=8000
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
JWT_ACCESS_TOKEN_SERECT=your_access_secret
JWT_ACCESS_TOKEN_EXPIRY=10m
JWT_REFRESH_TOKEN_SERECT=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRY=7d
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:3000
```

**`apps/web/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Database Setup

Push the Drizzle schema to your PostgreSQL database (you may need to run this from the database package or via an existing script):

```sh
# Example command depending on your setup
cd packages/database && pnpm db:push
```

### 4. Running the Development Server

You can start both the frontend and backend simultaneously using Turborepo from the root directory:

```sh
pnpm dev
```
*(Alternatively, run `turbo dev` if turbo is installed globally).*

- Frontend will be available at: `http://localhost:3000`
- API Server will be available at: `http://localhost:8000`
- API Documentation (Scalar): `http://localhost:8000/docs`

## Scripts and Commands

From the root directory, you can run the following commands:

- `pnpm dev`: Starts the development servers for all apps.
- `pnpm build`: Builds all apps and packages for production.
- `pnpm lint`: Lints the codebase.

To run commands for a specific app/package:
```sh
pnpm --filter web dev
pnpm --filter api build
```

## Deployment

This monorepo is optimized for deployment:

- **Frontend (`apps/web`)**: Designed to be deployed on **Vercel**.
- **Backend (`apps/api`)**: Configured to be deployed on **Render** (or any Node.js hosting platform). The `render.yaml` file is pre-configured.

*Note: Be sure to set all corresponding environment variables in your deployment environments.*
