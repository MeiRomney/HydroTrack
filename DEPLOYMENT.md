# HydroTrack Deployment

This project is configured for a Render backend and Vercel frontend.

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
