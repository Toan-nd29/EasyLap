# Backend deployment

## Local

```bash
npm install
npm run dev
```

Health check:

```txt
http://localhost:5000/api/health
```

## Vercel

Deploy the backend as a separate Vercel project.

- Root Directory: `backend`
- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `npm install`

Environment variables:

```txt
NODE_ENV=production
CLIENT_URL=https://easy-lap-4ttd.vercel.app
CORS_ORIGINS=https://easy-lap-4ttd.vercel.app
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

After deployment, set the frontend variable:

```txt
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

Then redeploy the frontend.
