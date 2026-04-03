# FTP Member & Outcomes Tracker

An internal CRM/directory for Florida Tech Pathways leadership to track members, alumni, cohorts, tracks, roles, and post-program outcomes (internships and full-time offers).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, TanStack React Query, Axios |
| Backend | Node.js, Express, Prisma ORM, Passport.js (Google OAuth 2.0) |
| Database | PostgreSQL 15 (Docker) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — download the **AMD64** installer for standard Windows PCs

Make sure Docker Desktop is **running** (check the system tray icon) before starting the database.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Adhvikaa759/FTP-Capstone.git
cd FTP-Capstone
```

### 2. Start the PostgreSQL Database

First time — this creates and starts the container:

```bash
docker run --name ftp-postgres -e POSTGRES_USER=ftp_user -e POSTGRES_PASSWORD=ftp_password_2024 -e POSTGRES_DB=ftp_tracker -p 5432:5432 -d postgres:15
```

If you've already created the container before, just start it:

```bash
docker start ftp-postgres
```

To verify it's running:

```bash
docker ps
```

You should see `ftp-postgres` in the list with status "Up".

### 3. Set Up Environment Variables

Create the server environment file at `server/.env`:

```env
DATABASE_URL="postgresql://ftp_user:ftp_password_2024@localhost:5432/ftp_tracker"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
SESSION_SECRET="ftp-tracker-session-secret-2024-random"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
PORT=3001
ADMIN_EMAIL="your-admin-email@gmail.com"
```

Create the client environment file at `client/.env`:

```env
VITE_API_URL="http://localhost:3001"
```

Replace the Google OAuth values with your own credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). The `ADMIN_EMAIL` will be auto-promoted to the ADMIN role on first login.

### 4. Set Up and Start the Server

Open a terminal and run:

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

What each command does:
- `npm install` — installs backend dependencies
- `npx prisma generate` — generates the Prisma database client
- `npx prisma migrate dev --name init` — creates the database tables
- `npx prisma db seed` — populates the database with sample data (4 tracks, 6 roles, 17 members)
- `npm run dev` — starts the Express server on http://localhost:3001

### 5. Start the Client

Open a **separate terminal** and run:

```bash
cd client
npm install
npm run dev
```

The React dev server starts on http://localhost:5173.

### 6. Open the App

Go to **http://localhost:5173** in your browser. Click "Sign in with Google" to authenticate. If your email matches the `ADMIN_EMAIL` in `server/.env`, you'll have full admin access (create, edit, delete members). Otherwise, you'll have read-only viewer access.

## Project Structure

```
FTP-Capstone/
├── client/                        # React frontend
│   ├── src/
│   │   ├── api/                   # Axios API client and endpoint functions
│   │   ├── components/
│   │   │   ├── auth/              # ProtectedRoute
│   │   │   ├── filters/           # SearchBar, FilterPanel
│   │   │   ├── layout/            # Navbar, Layout
│   │   │   ├── members/           # MemberTable, MemberCard, MemberForm, MemberDetail
│   │   │   └── ui/                # Button, Input, Select, Modal, LoadingSpinner
│   │   ├── context/               # AuthContext (React Context for auth state)
│   │   ├── hooks/                 # useAuth, useMembers, useFilters
│   │   ├── pages/                 # LoginPage, DirectoryPage, MemberDetailPage, etc.
│   │   ├── App.jsx                # Router and provider setup
│   │   └── main.jsx               # Entry point
│   └── vite.config.js             # Vite config with API proxy
├── server/                        # Express backend
│   ├── prisma/
│   │   ├── schema.prisma          # Database models
│   │   └── seed.js                # Sample data
│   └── src/
│       ├── config/passport.js     # Google OAuth strategy
│       ├── middleware/             # auth.js (requireAuth, requireAdmin), errorHandler.js
│       ├── routes/                 # auth, members, tracks, roles, export
│       ├── utils/csvExport.js     # CSV generation
│       └── index.js               # Express server entry point
├── docker-compose.yml             # Alternative Docker setup
└── CLAUDE.md                      # AI assistant context
```

## Database Schema

- **User** — authenticated users (Google OAuth), role is ADMIN or VIEWER
- **Member** — FTP members/alumni with cohort, graduation year, bio, LinkedIn
- **Track** — program tracks (Consulting, Tech Sales, Software Engineering, Product Management)
- **Role** — organizational roles (Analyst, Senior Analyst, President, VP, Alumni, Mentor)
- **Experience** — internships and full-time offers linked to members

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/auth/google` | Public | Initiate Google OAuth |
| GET | `/auth/google/callback` | Public | OAuth callback |
| GET | `/auth/me` | Public | Get current logged-in user |
| POST | `/auth/logout` | Authenticated | Log out |
| GET | `/api/members` | Authenticated | List members (supports `?search=`, `?cohort=`, `?track=`, `?role=`, `?graduationYear=`, `?company=`) |
| GET | `/api/members/:id` | Authenticated | Get single member |
| POST | `/api/members` | Admin | Create member |
| PUT | `/api/members/:id` | Admin | Update member |
| DELETE | `/api/members/:id` | Admin | Delete member |
| GET | `/api/tracks` | Authenticated | List all tracks |
| GET | `/api/roles` | Authenticated | List all roles |
| GET | `/api/export/members/csv` | Admin | Download members as CSV |

## Useful Commands

```bash
# Database
docker start ftp-postgres          # Start the database
docker stop ftp-postgres           # Stop the database
docker logs ftp-postgres           # View database logs
docker exec -it ftp-postgres psql -U ftp_user -d ftp_tracker  # PostgreSQL shell

# Prisma
cd server
npx prisma studio                  # Visual database browser (opens in browser)
npx prisma migrate dev --name xyz  # Create a new migration after schema changes
npx prisma db seed                 # Re-run the seed script

# Development
cd server && npm run dev           # Start backend (port 3001)
cd client && npm run dev           # Start frontend (port 5173)
cd client && npx vite build        # Production build of frontend
```

## Troubleshooting

- **"docker: command not found"** — Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and make sure it's running.
- **Database connection refused** — Make sure the Docker container is running (`docker ps`). If not, run `docker start ftp-postgres`.
- **"Port 5432 already in use"** — Another PostgreSQL instance is using that port. Stop it or change the port in the docker command and `DATABASE_URL`.
- **OAuth redirect error** — Make sure `http://localhost:3001/auth/google/callback` is listed as an authorized redirect URI in your Google Cloud Console.
- **Prisma migration errors** — Ensure the database is running and `DATABASE_URL` in `server/.env` is correct.
