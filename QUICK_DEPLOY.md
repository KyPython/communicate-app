# Quick Deployment Guide

Your code is now on GitHub: https://github.com/KyPython/communicate-app

## Fastest Deployment: Railway + Vercel (Recommended)

### Step 1: Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select **`communicate-app`** repository
4. Click **"Add Service"** → **"GitHub Repo"** again
5. Select the repo and set:
   - **Root Directory**: `backend`
   - **Build Command**: (leave default)
   - **Start Command**: `npm start`
6. Click **"Deploy"**
7. Once deployed, copy your Railway URL (e.g., `https://communicate-backend-production.up.railway.app`)

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import **`communicate-app`** repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = Your Railway backend URL (from Step 1)
   - `VITE_SOCKET_URL` = Same as VITE_API_URL
6. Click **"Deploy"**

### Step 3: Update Backend CORS

After Vercel deployment, you'll get a frontend URL. Update Railway backend:

1. Go to Railway dashboard → Your backend service → **Variables**
2. Add: `FRONTEND_URL` = Your Vercel frontend URL
3. Redeploy backend (Railway auto-redeploys on env var changes)

### Step 4: Test

1. Open your Vercel frontend URL
2. Create a channel
3. Send messages
4. Click a message to open thread
5. Send replies in thread

## Alternative: Render (Free Tier)

### Backend on Render

1. Go to https://render.com → Sign in with GitHub
2. **New** → **Web Service**
3. Connect **`communicate-app`** repo
4. Settings:
   - **Name**: `communicate-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. **Advanced** → Add Environment Variable: `NODE_ENV=production`
6. Deploy

### Frontend on Render

1. **New** → **Static Site**
2. Connect **`communicate-app`** repo
3. Settings:
   - **Name**: `communicate-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = Your Render backend URL
   - `VITE_SOCKET_URL` = Same as VITE_API_URL
5. Deploy

## Post-Deployment

✅ Your app is live! Share the frontend URL with your team.

**Note**: Both Railway and Render have free tiers that are perfect for this app.

