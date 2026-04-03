# FTP Member & Outcomes Tracker

An internal CRM/directory for Florida Tech Pathways leadership to track members, alumni, cohorts, tracks, roles, and post-program outcomes (internships and full-time offers).

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, TanStack React Query
- **Backend**: Node.js, Express, Prisma ORM, Passport.js (Google OAuth)
- **Database**: PostgreSQL (Docker)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)

## Getting Started

### 1. Start the Database

```bash
docker run --name ftp-postgres \
  -e POSTGRES_USER=ftp_user \
  -e POSTGRES_PASSWORD=ftp_password_2024 \
  -e POSTGRES_DB=ftp_tracker \
  -p 5432:5432 \
  -d postgres:15
```

If the container already exists, start it with:

```bash
docker start ftp-postgres
```

### 2. Set Up and Start the Server

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

The server runs on http://localhost:3001.

### 3. Start the Client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The client runs on http://localhost:5173.

### 4. Sign In

Open http://localhost:5173 and sign in with Google. The admin email configured in `server/.env` is auto-promoted to the ADMIN role.

## Useful Commands

```bash
# Stop the database
docker stop ftp-postgres

# Open Prisma Studio (visual DB browser)
cd server && npx prisma studio

# Access the PostgreSQL shell
docker exec -it ftp-postgres psql -U ftp_user -d ftp_tracker
```
