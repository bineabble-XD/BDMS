# BDMS Docker Setup

This stack runs **MongoDB Atlas** (cloud) — no local MongoDB container.

- `client` (Vite app) on `http://localhost:5173`
- `server` (Express API) on `http://localhost:5050`

## Prerequisites

- Docker Desktop installed and running
- MongoDB Atlas cluster and `MONGO_URI` in `server/.env`

## Configure database

1. Copy `server/.env.example` to `server/.env` if you do not have it yet (it must be a **file**, not a folder).
2. Set `MONGO_URI` to your Atlas connection string (database name in the path, e.g. `/BDMS`).
3. The server container mounts `./server/.env` into the app so MongoDB credentials load the same way as when you run Node locally (avoids env-only issues on Windows).

If login still fails, check server logs for `Database connection error` and confirm Atlas **Network Access** allows your IP.

## Run the stack

From the project root:

```bash
docker compose up --build
```

## Stop the stack

```bash
docker compose down
```

## Notes

- `MONGO_URI` must be set in `server/.env` (loaded via `env_file`).
- Email settings are loaded from `server/.env` as well.
- Backend links in emails/redirects use:
  - `FRONTEND_URL` (default `http://localhost:5173`)
  - `BACKEND_URL` (default `http://localhost:5050`)
