# InDev Workspace

This repository now uses a split architecture:

- `client`: Next.js frontend (App Router)
- `server`: Express backend API with Neon PostgreSQL

## Quick start

1. Install root dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
npm install --prefix server
```

3. Install frontend dependencies:

```bash
npm install --prefix client
```

4. Configure environment files:

```bash
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
```

5. Set `DATABASE_URL` in `server/.env` with your Neon connection string.

6. Run database migrations:

```bash
npm run migrate:up
```

7. Run both client and server:

```bash
npm run dev
```

## Scripts

- `npm run dev`: runs both frontend and backend concurrently
- `npm run dev:client`: runs frontend only
- `npm run dev:server`: runs backend only
- `npm run build`: builds the Next.js client
- `npm run start`: starts the built Next.js client
- `npm run start:server`: starts backend in production mode
- `npm run migrate:up`: runs PostgreSQL migrations
- `npm run migrate:down`: rolls back one migration

## Backend structure

- `server/src/config`: environment and database config
- `server/src/models`: database models/queries
- `server/src/controllers`: request handlers
- `server/src/routes`: API routes
- `server/src/middlewares`: not-found + error middleware
- `server/migrations`: versioned schema/data migrations

## API endpoints

- `GET /api/health`: health check (includes DB connectivity)
- `GET /api/products`: all products from database
- `GET /api/products/featured`: featured products from database

Default API URL: `http://localhost:5000`

Test test