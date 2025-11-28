# Deployment Guide (Concise)

This document outlines a minimal production deployment for Bolti AI.

1) Provision services
- MongoDB: create a MongoDB Atlas cluster and get the `MONGODB_URI` (use SRV URI).
- Redis: create a managed Redis (Upstash, Redis Cloud, or provider). Provide `REDIS_URL` (preferred) or `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.
- Domain: optional — point to Vercel for frontend; backend host will get its own domain.

2) Backend (recommended hosts: Render, Railway, Fly, DigitalOcean App)
- Repository root: `backend`
- Start command: `npm start` (already configured)
- Environment variables (minimum):
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI` (from Atlas)
  - `REDIS_URL` or `REDIS_HOST`/`REDIS_PORT`/`REDIS_PASSWORD`
  - `JWT_SECRET` (secure random string)
  - `FRONTEND_URL` (e.g., `https://your-frontend.vercel.app`)
  - Any telephony/billing keys (EXOTEL_*, RAZORPAY_*)
- Workers: create a second background service for workers running `node backend/workers/call-dispatch-worker.js` with the same Redis and DB envs.

3) Frontend (Vercel)
- Import GitHub repo `PixelStackAgency/bolti-ai-agent`.
- Project Root: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Add Environment Variables (Production):
  - `VITE_API_URL` = `https://api.your-backend.com` (public backend URL)
- Deploy and optionally add a custom domain.

4) Docker (optional)
- There's a `Dockerfile` and `docker-compose.yml`. For local testing run:
  ```bash
  docker-compose up --build
  ```
  The compose file will start MongoDB, Redis, and backend.

5) CI
- A simple GitHub Actions workflow is included at `.github/workflows/ci.yml` that builds the frontend on push to `main`.

6) Common troubleshooting
- CORS: ensure `FRONTEND_URL` is set in backend and matches Vercel domain.
- API base: frontend uses `VITE_API_URL`; make sure this points to the backend.
- Long-running workers: keep workers on a VM/container (not serverless).

If you want, I can:
- Deploy the backend to Render/Railway (I will need an API key or you can invite me),
- Set Vercel variables (I will need a Vercel token), or
- Walk you through each UI step interactively.
