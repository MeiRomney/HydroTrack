# HydroTrack Deployment

This project supports a Vercel frontend, a Render backend, and either Neon or
Render Postgres for the database. Neon is the recommended low-cost database
option because it can be created separately without using a Render Blueprint.

## Recommended low-cost setup: Neon + Render Web Service + Vercel

Use this path if you do not want Render to provision the database:

1. Create a project in [Neon](https://neon.com/) and copy its pooled PostgreSQL
   connection string. It should begin with `postgresql://` and include SSL
   parameters supplied by Neon.
   <!-- postgresql://neondb_owner:npg_17ugTaOzWXPF@ep-proud-cherry-b5log9q8-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require -->
2. In Render, choose **New > Web Service**, not **New > Blueprint**.
3. Select this repository and configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm run build && npm run db:migrate`
   - **Start Command:** `npm start`
   - **Plan:** `Free` for testing or a paid plan for an always-on service
4. Add these Render environment variables:
   - `DATABASE_URL`: the Neon connection string
   - `CORS_ORIGIN`: the final Vercel URL
   - `PUBLIC_API_URL`: the Render API URL
   <!-- https://hydrotrack-fpqm.onrender.com/ -->
5. Deploy the frontend on Vercel with root directory `frontend` and set
   `VITE_API_URL` to the Render API URL.

This project already uses Prisma's PostgreSQL adapter, so no code change is
needed to use Neon. Render's free web service sleeps after inactivity, which
can make the first request take about a minute.

Render's free PostgreSQL database is not a good long-term alternative: Render
currently documents a 30-day expiration for free databases. If you use Neon,
do not deploy the `hydrotrack-db` database from `render.yaml`.

## 1. Push the repository

Push the repository to GitHub. The deployment blueprint is `render.yaml`.

## 2. Create the backend on Render

1. In Render, choose **New > Blueprint** and select this repository.
2. Confirm the `hydrotrack-db` PostgreSQL database and `hydrotrack-api` web service.
3. After the first deploy, open the web service settings and copy its public URL.
4. Set these environment variables on `hydrotrack-api`:
   - `CORS_ORIGIN`: the final Vercel URL, for example `https://hydrotrack.vercel.app`
   - `PUBLIC_API_URL`: the Render API URL, for example `https://hydrotrack-api.onrender.com`

The Render build runs Prisma migrations with `prisma migrate deploy`. Do not run
the seed script in production because it deletes existing data.

## 3. Create the frontend on Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `frontend`.
3. Set the environment variable `VITE_API_URL` to the Render API URL.
4. Deploy with the default Vite settings.

The included `vercel.json` sends client-side routes back to `index.html`.

## 4. Verify the deployment

Open these URLs:

- `https://<render-service>.onrender.com/api/health`
- `https://<render-service>.onrender.com/api-docs`
- `https://<vercel-project>.vercel.app`

Create one channel and one batch from the frontend, then reload the pages to
verify that the production database is being used.

## Local PostgreSQL setup

Copy `backend/.env.example` to `backend/.env`, set `DATABASE_URL`, then run:

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

The frontend uses `frontend/.env.example` for its local API URL.
