# instaCart.PH — Production Deployment Guide

## Overview

instaCart.PH is a full-stack production platform with:

- **Frontend**: React 19 + Vite + TypeScript (deployed to Vercel)
- **Backend**: Express.js + TypeScript + Neon Serverless PostgreSQL (deployed separately)
- **Framework**: React (configured in `vercel.json`)

---

## Architecture

```
Vercel (Frontend: React)
  └── https://instacart.ph
      └── React SPA served from /dist
          └── API calls → https://api.instacart.ph (Backend)

Backend (Express.js)
  └── https://api.instacart.ph
      └── Express server + Neon DB
          └── CORS configured for https://instacart.ph
```

---

## Files Created/Modified

### 1. `vercel.json` (root)
Configures Vercel to treat this as a React project:
- `framework: "react"` — overrides Express auto-detection
- `buildCommand`: `npm --prefix frontend run build`
- `installCommand`: `npm --prefix frontend install`
- Build output: `frontend/dist`
- Catch-all route → `frontend/dist/index.html` (React Router support)

### 2. `frontend/vercel.json`
Standalone Vercel config for the frontend:
- `framework: "react"`
- Build output: `dist`
- Catch-all route → `/index.html`

### 3. `frontend/vite.config.ts`
- Added `define` for `VITE_API_BASE_URL` environment variable injection
- Proxy configured for `/api` → `http://localhost:5000` (dev only)

### 4. `frontend/.env.example` (new)
Frontend environment variables template.

### 5. `backend/.env.example` (already existed)
Comprehensive backend environment variables including:
- `NODE_ENV`, `PORT`, `APP_URL`, `BASE_URL`, `FRONTEND_ORIGIN`
- `DATABASE_URL` (Neon PostgreSQL)
- PayPal production credentials
- JWT secrets, rate limiting, security headers

### 6. `package.json` (root)
- Renamed to `instacart-ph`
- Added `workspaces` for backend and frontend
- Added `postinstall` script to install both workspace dependencies
- Changed `build:backend` to use `npm ci` for reproducible builds

---

## Deployment Steps

### Step 1: Deploy Frontend to Vercel

1. Connect your GitHub repository to Vercel
2. Import the `instaCart.PH` project
3. Vercel will detect `vercel.json` at the root with `framework: "react"`
4. Configure the following **Environment Variables** in Vercel:
   - `VITE_API_BASE_URL` = `https://api.instacart.ph/api/v1` (your backend URL)
5. Deploy

### Step 2: Deploy Backend (Separate Host)

The Express backend cannot run on Vercel's React/static-build framework. Deploy it to a Node.js hosting platform:

**Recommended options:**
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

**Required environment variables** (copy from `backend/.env.example`):

| Variable | Production Value |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (or platform-assigned) |
| `APP_URL` | `https://api.instacart.ph` |
| `BASE_URL` | `https://api.instacart.ph` |
| `FRONTEND_ORIGIN` | `https://instacart.ph` (your Vercel domain) |
| `TRUST_PROXY` | `true` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PAYPAL_ENVIRONMENT` | `live` |
| `PAYPAL_CLIENT_ID` | Your PayPal live client ID |
| `PAYPAL_CLIENT_SECRET` | Your PayPal live client secret |
| `PAYPAL_MERCHANT_EMAIL` | Your PayPal merchant email |
| `JWT_ACCESS_SECRET` | Generate with `openssl rand -base64 64` |
| `JWT_REFRESH_SECRET` | Generate with `openssl rand -base64 64` |
| `ENABLE_CSP` | `true` |
| `ENABLE_HSTS` | `true` |

### Step 3: Configure CORS

The backend CORS middleware (`backend/src/server.ts`) reads `FRONTEND_ORIGIN` from environment variables. In production, it will only allow requests from your Vercel frontend domain:

```typescript
// backend/src/server.ts line 69-72
app.use(cors({
  origin: isProduction && allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
}));
```

Make sure `FRONTEND_ORIGIN=https://instacart.ph` is set in your backend environment.

### Step 4: Verify Deployment

1. **Frontend**: Visit `https://instacart.ph` — should load the React app
2. **Backend health**: Visit `https://api.instacart.ph/health` — should return `{"status":"OK"}`
3. **API calls**: Frontend fetch calls to `/api/v1/*` should reach the backend

---

## Local Development

```bash
# Install all dependencies
npm install

# Run both frontend and backend concurrently
npm run dev

# Frontend only (dev)
cd frontend && npm run dev

# Backend only (dev)
cd backend && npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://api.instacart.ph/api/v1
```

### Backend (Railway/Render/Fly.io)
```
NODE_ENV=production
PORT=5000
APP_URL=https://api.instacart.ph
BASE_URL=https://api.instacart.ph
FRONTEND_ORIGIN=https://instacart.ph
TRUST_PROXY=true
DATABASE_URL=postgresql://...
PAYPAL_ENVIRONMENT=live
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MERCHANT_EMAIL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
ENABLE_CSP=true
ENABLE_HSTS=true
```

---

## Important Notes

1. **Backend is NOT deployed on Vercel React framework** — Vercel's React framework is for static frontend builds only. The Express backend needs a Node.js hosting platform.

2. **CORS** — The backend only allows requests from `FRONTEND_ORIGIN` in production. Update this if you change your frontend domain.

3. **PayPal** — Set `PAYPAL_ENVIRONMENT=live` and provide live PayPal credentials for production transactions.

4. **Database** — Uses Neon serverless PostgreSQL. Make sure `DATABASE_URL` includes `sslmode=require`.

5. **`.env` files** — Never commit `.env` to version control. They are in `.gitignore`.

6. **Vercel `.vercel` folder** — Already in `.gitignore`. Do not commit.