# DEPLOYMENT GUIDE — Manual Setup (Render UI + Vercel API)
# This guide provides exact steps to deploy via Render UI and configures Vercel via API

## STEP 1: Deploy Backend to Render (UI) — 5 minutes

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Select "Deploy an existing repository" → connect GitHub if needed → select `PixelStackAgency/bolti-ai-agent`
4. Fill in these settings:
   - Name: `bolti-ai-backend`
   - Runtime: Node
   - Root Directory: `backend`
   - Build Command: `npm ci`
   - Start Command: `npm start`
5. Add Environment Variables (click "Add Environment Variable"):
   - MONGODB_URI = mongodb+srv://user:password@cluster.mongodb.net/bolti-ai (replace with real Atlas URI)
   - REDIS_URL = redis://:password@redis-host:6379 (replace with real Redis URL)
   - JWT_SECRET = change-me-please-use-secure-random (generate a strong random string)
   - FRONTEND_URL = https://orvigo.vercel.app (or your Vercel domain)
   - NODE_ENV = production
   - PORT = 5000
   - EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_SID = your values (or leave as placeholder for now)
6. Select Plan: "Free" (or paid if you need more resources)
7. Click "Create Web Service"
8. Wait for build to complete (~3-5 mins). Copy the service URL (e.g., https://bolti-ai-backend.onrender.com)

## STEP 2: Deploy Worker to Render (UI) — 3 minutes

1. Repeat STEP 1, but:
   - Name: `bolti-ai-worker`
   - Root Directory: `backend`
   - Build Command: (leave empty, or `npm ci`)
   - Start Command: `node workers/call-dispatch-worker.js`
   - Add same environment variables as the web service
   - No need to wait for URL (worker doesn't have public endpoint)

## STEP 3: Configure Vercel (API) — 1 minute

Use this PowerShell command to set VITE_API_URL in your Vercel project:

```powershell
$VERCEL_TOKEN = "8eMfwPwG27jKwH12oHwQmA53"
$PROJECT_ID = "prj_DmWDLZWBKkUXkArrpQZgLXiLKfIs"  # ID of your "orvigo" project (the frontend)
$BACKEND_URL = "https://bolti-ai-backend.onrender.com"  # replace with your Render backend URL from STEP 1

$headers = @{ "Authorization" = "Bearer $VERCEL_TOKEN"; "Content-Type" = "application/json" }
$body = @{ 
    key = "VITE_API_URL"
    value = $BACKEND_URL
    target = @("production", "preview", "development")
    type = "plain"
}

$resp = Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v9/projects/$PROJECT_ID/env" `
    -Headers $headers -Body ($body | ConvertTo-Json)
Write-Host "Vercel env set:" ($resp | ConvertTo-Json)

# Trigger redeploy
$deployResp = Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v13/deployments?projectId=$PROJECT_ID" `
    -Headers $headers -Body (ConvertTo-Json @{ gitBranch = "main" })
Write-Host "Redeploy triggered"
```

## STEP 4: Verify Deployment

1. Wait for Vercel and Render builds to complete (check dashboards for logs).
2. Open your Vercel frontend URL (https://orvigo.vercel.app or custom domain).
3. Check Network tab in browser DevTools — API calls should go to your Render backend URL.
4. Test login and other features.
5. Check Render `/health` endpoint: `curl https://bolti-ai-backend.onrender.com/health`

## IMPORTANT: After Deployment
- Replace all placeholder env vars with real values (especially MONGODB_URI, REDIS_URL, JWT_SECRET).
- Revoke the temporary Render and Vercel tokens (or rotate them periodically).
- Set up custom domains if needed.
- Monitor logs for errors.
