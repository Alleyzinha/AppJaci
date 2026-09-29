# AppJaci — Development Guide

Expo SDK 54 / React Native app that pairs with a Fastify + TypeScript backend
and a MySQL database. The interface and new modules are written in Portuguese.

## Quick Start

```powershell
npm run install:all          # installs client + server dependencies
if (!(Test-Path .env)) { Copy-Item .env.example .env }
if (!(Test-Path server/.env)) { Copy-Item server/.env.example server/.env }
npm run db:setup             # creates database tables
npm run server:dev           # terminal 1 — API server
npm run web                  # terminal 2 — Expo web dev server
```

## Project Structure

```
AppJaci/
├── app/                      # Expo Router (file-based routing)
│   ├── _layout.js            # Root layout: providers, SafeArea, Stack
│   ├── index.js              # Entry point: redirects by profile/session
│   ├── (auth)/               # Auth flow routes (login, register, pin, etc.)
│   ├── guardiao/             # Guardian profile routes
│   └── protegida/            # Protected-user profile routes
├── assets/                   # Expo static assets (icons, splash screens)
├── src/
│   ├── components/
│   │   ├── auth/             # Auth guard components
│   │   ├── guardiao/         # Guardian-specific UI components
│   │   ├── protegida/        # Protected-user-specific UI components
│   │   └── ui/               # Reusable UI primitives (AppButton, TelaPadrao, etc.)
│   ├── features/
│   │   ├── auth/             # Auth API, hooks, schemas
│   │   ├── guardians/        # Guardian API (link/unlink guardians)
│   │   └── protecao/         # Protection features (diary, SOS, location, data)
│   ├── screens/
│   │   ├── auth/             # Auth screens (login, register, pin setup)
│   │   ├── compartilhadas/   # Screens shared by both profiles
│   │   ├── Guardiao/         # Guardian-specific screens
│   │   └── Protegida/        # Protected-user-specific screens
│   ├── services/
│   │   ├── api/              # Axios instance + interceptors
│   │   ├── localizacao/      # Location sharing service
│   │   ├── query/            # React Query client
│   │   └── storage/          # SecureStore + local storage helpers
│   ├── stores/               # Zustand state stores (auth, theme, security, cadastro)
│   ├── styles/               # Design tokens, theme colors, color hooks
│   └── utils/                # Utility helpers (name parsing, etc.)
├── server/                   # Fastify + TypeScript backend
│   ├── src/
│   │   ├── banco/            # MySQL connection + schema setup
│   │   ├── rotas/            # API routes (auth, guardians, protecao, admin)
│   │   ├── aplicacao.ts      # Express/Fastify app factory
│   │   ├── localizacao.ts    # Location broadcasting logic
│   │   └── seguranca.ts      # Security utilities
│   ├── testes/               # Unit + integration tests
│   ├── painel/               # Admin dashboard
│   └── banco/                # SQL schema files
├── docs/                     # Documentation (DB model, dev guide, validation)
├── compose.yaml              # Docker Compose for MySQL
├── package.json
├── tsconfig.json             # Path alias: @/* → src/*
└── .env.example              # Template for local environment
```

## Conventions

- **Path alias**: Use `@/` to reference `src/` (configured in `tsconfig.json` and `babel.config.js`).
- **Component structure**: Each component folder follows `index.js` + `styles.js` pattern.
- **Screen structure**: Each screen folder has `index.js` + `styles.js`. Shared screens live in `src/screens/compartilhadas/`.
- **Routing**: Routes in `app/` are thin wrappers that import from `src/screens/`.
- **State management**: Zustand stores in `src/stores/`. React Query for server state.
- **API layer**: Axios instance in `src/services/api/api.js`; feature-specific API calls in `src/features/*/api/`.
- **Storage**: `expo-secure-store` for sessions (native) and `sessionStorage`/`localStorage` (web).
- **File extensions**: `.js` for React Native components and plain JS; `.ts`/`.tsx` for typed modules and stores.
- **Formatting**: Prettier with single quotes, trailing commas, 100-char width, LF line endings.

## Before Writing Code

Read the versioned Expo docs at https://docs.expo.dev/versions/v54.0.0/

## Verification

```powershell
npm run typecheck       # TypeScript type checking (client + server)
npm test                # Server unit tests
npm run format:check    # Prettier format check
npm --prefix server run build  # Server build
```

## Security Notes

- Personal information (names, session data) comes from the auth store — never hardcode user data in components.
- `.env` is gitignored. Copy from `.env.example` and set your own values.
- Never commit `.env`, log files, or validation artifacts.
