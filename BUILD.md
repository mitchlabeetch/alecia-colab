# Build Configuration Guide

## Environment Variables Required for Build

The application requires the following environment variables to build successfully:

### Required Variables

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clerk authentication publishable key
   - Get from: https://dashboard.clerk.com
   - Format: `pk_test_...` or `pk_live_...`

2. **NEXT_PUBLIC_CONVEX_URL**: Convex database URL
   - Get from: https://dashboard.convex.dev
   - Format: `https://your-deployment.convex.cloud`

### Local Development

1. Copy the environment file:
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

2. Fill in your actual credentials in `.env.local`

3. Run the development server:
   ```bash
   pnpm dev
   ```

### Production Build (Vercel)

1. Add environment variables in Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add all required variables listed above

2. Deploy:
   ```bash
   vercel deploy
   ```

### CI/CD Builds

If building in CI without authentication (e.g., for testing), you can skip the build by using:
```bash
# Skip build in environments without secrets
if [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
  echo "Skipping build - no environment variables"
  exit 0
fi
```

Or provide test/dummy credentials in your CI environment variables.

## Known Issues

### Next.js 15 + Clerk Prerender Issue

The application uses `@clerk/nextjs@6.36.7` with Next.js 15.1.11. During build, Next.js attempts to prerender pages even with `export const dynamic = "force-dynamic"`. This requires valid Clerk credentials at build time.

**Solution**: Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and NEXT_PUBLIC_CONVEX_URL are set in your build environment.

## Subdomain Configuration

The app is configured to run on `colab.alecia.markets`:
- Asset prefix: `https://colab.alecia.markets` 
- CORS headers configured for `*.alecia.markets`
- Frame embedding allowed from alecia.fr and alecia.markets domains
