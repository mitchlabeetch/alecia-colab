# Alecia Colab - Vercel Deployment Guide

## Deployment Configuration

**Target Domain:** `colab.alecia.markets`

## Environment Variables (Set in Vercel Dashboard)

### Required
```
NEXT_PUBLIC_CONVEX_URL=https://hip-iguana-601.convex.cloud
CONVEX_DEPLOY_KEY=prod:hip-iguana-601|eyJ2MiI6IjJlNzZlNzk1MTM1ODQyM2U4NjdjMzNiMDNlZGE3ZmM5In0=
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_tQlKiVJ8eRS8PMjS_JqaoZXvRPpHsiKoNJWlbIqVuBNOfhs
```

### Optional (for full features)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
OPENAI_API_KEY=<your-openai-key>
KV_REST_API_URL=<vercel-kv-url>
KV_REST_API_TOKEN=<vercel-kv-token>
```

## Vercel Project Setup

1. **Import Project**
   - Go to Vercel Dashboard → New Project
   - Import `mitchlabeetch/alecia-colab` from GitHub
   - **Root Directory:** `apps/web`
   - Framework: Next.js (auto-detected)

2. **Build & Output Settings**
   - Build Command: `cd ../.. && pnpm build`
   - Output Directory: `.next`
   - Install Command: `cd ../.. && pnpm install`

3. **Domain Configuration**
   - Add `colab.alecia.markets` as custom domain
   - Configure DNS CNAME to Vercel

## Embedding in Alecia Panel

Use this URL in Alecia Panel microfrontends.json:
```json
{
  "colab": {
    "url": "https://colab.alecia.markets",
    "embedUrl": "https://colab.alecia.markets/embed"
  }
}
```

The `/embed` route strips navigation for iframe use.

## Testing

1. **Standalone:** Visit `https://colab.alecia.markets`
2. **Embedded:** Visit `https://colab.alecia.markets/embed` or embed in Alecia Panel

## Headers Configured

- `X-Frame-Options`: Allows embedding from `alecia.fr` and `alecia.markets`
- `Content-Security-Policy`: frame-ancestors for allowed origins
- `Access-Control-Allow-Origin`: CORS for Alecia Panel
