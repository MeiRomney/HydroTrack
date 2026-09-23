# HydroTrack

HydroTrack is a hydroponic crop monitoring application for tracking channels, batches, nutrient readings, and harvest records. It combines a React frontend with an Express + Prisma backend to help growers manage plant health and operational history from a single dashboard.

## Overview

<img width="1917" height="905" alt="image" src="https://github.com/user-attachments/assets/799e0c5d-acc3-49ca-8456-4aae339a82ce" />


The app is designed to support:

- Creating and managing hydroponic channels
- Tracking crop batches across their lifecycle
- Logging pH, EC, and water temperature readings
- Recording harvest yields and notes
- Reviewing batch health trends from the dashboard
- Deploying the frontend and API separately for a modern production setup

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL via Prisma ORM
- API docs: Swagger UI
- Deployment: Vercel for frontend, Render or Neon + Render for backend/database

## Project Structure

```text
HydroTrack/
├── backend/                  # Express API and Prisma schema
│   ├── prisma/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # React dashboard and pages
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── DEPLOYMENT.md             # Deployment guide
├── render.yaml               # Render blueprint config
├── package.json              # Root project metadata
└── README.md                 # Project overview
```

## Features

### Dashboard

- Overview of active and monitored production areas
- Quick access to batches and channel status

### Batch management

- Create and view crop batches
- Assign batches to specific channels
- Track expected harvest dates and lifecycle status

### Readings

- Log pH, EC, and water temperature values
- Store notes tied to each reading entry
- View traceable historical data for each batch

### Harvest records

- Record harvest dates and yield totals
- Attach notes to harvest outcomes

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Backend:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your local database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hydrotrack?schema=public"
PORT=3001
CORS_ORIGIN=http://localhost:5173
PUBLIC_API_URL=http://localhost:3001
```

Frontend:

```bash
cd frontend
cp .env.example .env
```

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

### 4. Start the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend is typically available at `http://localhost:5173` and the API at `http://localhost:3001`.

## Backend Scripts

From the `backend` folder:

```bash
npm run dev      # Start development server with tsx watch
npm run build    # Generate Prisma client and compile TypeScript
npm run db:migrate  # Apply Prisma migrations in production
npm start        # Run built backend server
```

## Frontend Scripts

From the `frontend` folder:

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview   # Preview built app locally
npm run lint     # Run ESLint checks
```

## API Documentation

The backend includes Swagger docs. After starting the API, visit:

```text
http://localhost:3001/api-docs
```

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Notes

- Prisma schema and database models live in `backend/prisma/schema.prisma`.
- The app uses a PostgreSQL database; Neon is recommended for a low-cost hosted setup.
- The frontend and backend are intended to be deployed independently.

## License

This project is currently set up for local and deployment use as part of the HydroTrack development workflow.
