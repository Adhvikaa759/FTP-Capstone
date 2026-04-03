# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FTP Member & Outcomes Tracker — a full-stack CRM/directory for Florida Tech Pathways. Tracks members, alumni, cohorts, tracks (Consulting, Tech Sales, SWE, PM), roles, and post-program outcomes (internships/full-time offers).

## Architecture

- **client/** — React 18 + Vite, Tailwind CSS, React Router v6, TanStack React Query, Axios
- **server/** — Node.js + Express 5 (ESM), Prisma 5 ORM, Passport.js Google OAuth, PostgreSQL 15 (Docker)
- Vite dev server proxies `/auth` and `/api` to the Express backend (port 3001) — configured in `client/vite.config.js`
- Auth uses server-side sessions (`express-session`); the client calls `/auth/me` on load to check login state
- Two user roles: `ADMIN` (full CRUD) and `VIEWER` (read-only)

## Data flow

- Frontend API calls: `client/src/api/` (Axios with `withCredentials: true`) → consumed via React Query hooks in `client/src/hooks/`
- Auth context in `client/src/context/AuthContext.jsx` — provides `user`, `setUser`, `loading` to all components via `useAuth()` hook
- Routing: `client/src/App.jsx` — `ProtectedRoute` wraps authenticated routes, `adminOnly` prop gates admin pages
- Backend routes: `server/src/routes/` — guarded by `requireAuth` and `requireAdmin` middleware from `server/src/middleware/auth.js`

## Database

- PostgreSQL 15 via Docker container named `ftp-postgres`
- Connection: `postgresql://ftp_user:ftp_password_2024@localhost:5432/ftp_tracker`
- Prisma schema: `server/prisma/schema.prisma`
- Models: User, Member, Track, Role, Experience
- Member has many-to-many with Track and Role, one-to-many with Experience
- Seed data: `server/prisma/seed.js` — 4 tracks, 6 roles, 17 sample members

## Commands

```bash
# Database (Docker)
docker start ftp-postgres
# Or first time: docker run --name ftp-postgres -e POSTGRES_USER=ftp_user -e POSTGRES_PASSWORD=ftp_password_2024 -e POSTGRES_DB=ftp_tracker -p 5432:5432 -d postgres:15

# Server
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init   # first time only
npx prisma db seed                   # first time only
npm run dev                          # runs on :3001

# Client
cd client
npm install
npm run dev                          # runs on :5173

# Prisma Studio (visual DB browser)
cd server && npx prisma studio

# Build client for production
cd client && npx vite build
```

## Key conventions

- Server uses ES modules (`"type": "module"` in package.json)
- Prisma 5 (not v7) — schema uses `url = env("DATABASE_URL")` in datasource block
- Admin auto-promotion: user with email matching `ADMIN_EMAIL` env var gets ADMIN role on OAuth login (see `server/src/config/passport.js`)
- Auth middleware: `requireAuth` (any logged-in user), `requireAdmin` (ADMIN role only)
- Frontend API layer: `client/src/api/` (Axios), consumed via React Query hooks in `client/src/hooks/`
- Tailwind CSS v4 via `@tailwindcss/vite` plugin — styles imported as `@import "tailwindcss"` in `client/src/index.css`
- Environment variables: `server/.env` (database, OAuth, session), `client/.env` (API URL) — both gitignored

## API endpoints

- `GET /auth/google` — initiate OAuth
- `GET /auth/google/callback` — OAuth callback
- `GET /auth/me` — current user
- `POST /auth/logout` — log out
- `GET /api/members` — list with filters (`?search=`, `?cohort=`, `?track=`, `?role=`, `?graduationYear=`, `?company=`)
- `GET/POST /api/members/:id` — single member CRUD
- `PUT/DELETE /api/members/:id` — update/delete (admin only)
- `GET /api/tracks` — all tracks
- `GET /api/roles` — all roles
- `GET /api/export/members/csv` — CSV download (admin only)
