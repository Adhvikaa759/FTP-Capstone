# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FTP Member & Outcomes Tracker — a full-stack CRM/directory for Florida Tech Pathways. Tracks members, alumni, cohorts, tracks (Consulting, Tech Sales, SWE, PM), roles, and post-program outcomes (internships/full-time offers).

## Architecture

- **client/** — React 18 + Vite, Tailwind CSS, React Router v6, TanStack React Query, Axios
- **server/** — Node.js + Express (ESM), Prisma ORM, Passport.js Google OAuth, PostgreSQL (Docker)
- Vite dev server proxies `/auth` and `/api` to the Express backend (port 3001)
- Auth uses server-side sessions; the client calls `/auth/me` on load to check login state

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
```

## Key conventions

- Server uses ES modules (`"type": "module"` in package.json)
- Prisma schema in `server/prisma/schema.prisma`; seed in `server/prisma/seed.js`
- Admin auto-promotion: user with email matching `ADMIN_EMAIL` env var gets ADMIN role on OAuth login
- Auth middleware: `requireAuth` (any logged-in user), `requireAdmin` (ADMIN role only)
- Frontend API layer: `client/src/api/` (Axios), consumed via React Query hooks in `client/src/hooks/`
