# Deployment Guide

This guide covers deploying the Communicate app to production.

## Architecture

- **Backend**: Node.js/Express API + WebSocket server
- **Frontend**: React/Vite SPA

## Recommended Deployment Platforms

### Option 1: Railway (Backend) + Vercel (Frontend) - Recommended

#### Backend on Railway

1. **Create Railway account**: https://railway.app
2. **Create new project** → "Deploy from GitHub repo"
3. **Select this repository**
4. **Set root directory**: `backend`
5. **Add environment variables**:
   - `PORT` (Railway will auto-assign, but you can set it)
   - `NODE_ENV=production`
6. **Deploy** - Railway will auto-detect Node.js and install dependencies

#### Frontend on Vercel

1. **Create Vercel account**: https://vercel.com
2. **Import this repository**
3. **Set root directory**: `frontend`
4. **Add environment variables**:
   - `VITE_API_URL` = Your Railway backend URL (e.g., `https://your-app.railway.app`)
   - `VITE_SOCKET_URL` = Same as VITE_API_URL
5. **Deploy**

### Option 2: Render (Both Backend + Frontend)

#### Backend on Render

1. **Create Render account**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub repository**
4. **Settings**:
   - **Name**: `communicate-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. **Add environment variables**:
   - `NODE_ENV=production`
6. **Deploy**

#### Frontend on Render

1. **New** → **Static Site**
2. **Connect GitHub repository**
3. **Settings**:
   - **Name**: `communicate-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Add environment variables**:
   - `VITE_API_URL` = Your Render backend URL
   - `VITE_SOCKET_URL` = Same as VITE_API_URL
5. **Deploy**

### Option 3: Fly.io (Both Backend + Frontend)

#### Backend on Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Create app**: `fly apps create communicate-backend`
4. **Create `backend/fly.toml`**:
```toml
app = "communicate-backend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

5. **Deploy**: `cd backend && fly deploy`

#### Frontend on Fly.io

1. **Create app**: `fly apps create communicate-frontend`
2. **Create `frontend/fly.toml`**:
```toml
app = "communicate-frontend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 5173
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

3. **Set environment variables**: `fly secrets set VITE_API_URL=https://your-backend.fly.dev`
4. **Deploy**: `cd frontend && fly deploy`

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Set to `production` in production

### Frontend
- `VITE_API_URL` - Backend API URL (e.g., `https://api.yourapp.com`)
- `VITE_SOCKET_URL` - WebSocket URL (usually same as API URL)

## Post-Deployment Checklist

1. ✅ Backend is accessible via HTTPS
2. ✅ Frontend environment variables are set correctly
3. ✅ CORS is configured to allow frontend domain
4. ✅ WebSocket connections work (check browser console)
5. ✅ Test creating channels, messages, and threads

## Troubleshooting

### CORS Errors
Update `backend/src/index.ts` to include your frontend domain:
```typescript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
```

### WebSocket Connection Issues
- Ensure WebSocket URL uses `wss://` in production (not `ws://`)
- Check that your hosting provider supports WebSockets
- Verify firewall/proxy settings

### Environment Variables Not Working
- Vite requires `VITE_` prefix for environment variables
- Rebuild frontend after changing environment variables
- Check that variables are set in your hosting platform's dashboard

