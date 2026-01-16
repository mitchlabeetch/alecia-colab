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

1. **Set Root Directory**: In Vercel project settings, set the root directory to `apps/web`

2. **Add Environment Variables** in Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add all required variables listed above:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `NEXT_PUBLIC_CONVEX_URL`
     - `CLERK_SECRET_KEY` (for server-side auth)
     - `CONVEX_DEPLOY_KEY` (optional, for Convex deployment)

3. **Build Configuration**: The `apps/web/vercel.json` is already configured with:
   - Build command: `pnpm turbo run build --filter=alecia-colab-web`
   - Install command: `pnpm install` (runs from monorepo root)
   - Framework: Next.js
   - CORS headers for subdomain embedding

4. Deploy:
   ```bash
   vercel deploy
   ```

### Monorepo Structure

This is a Turborepo monorepo with the following structure:
```
/
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   └── headless/         # Novel editor package
├── turbo.json           # Turborepo configuration
└── pnpm-workspace.yaml  # pnpm workspace configuration
```

The build process:
1. Turborepo builds dependencies (`novel` package) first
2. Then builds the main `alecia-colab-web` app
3. Remote caching is enabled for faster builds

### CI/CD Builds

For CI environments without full authentication setup:

The application gracefully handles missing environment variables during build:
- If `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set, ClerkProvider is skipped
- If `NEXT_PUBLIC_CONVEX_URL` is not set, ConvexProvider is skipped
- This allows type checking and linting without full credentials

However, for a complete production build, you MUST provide valid credentials.

### Troubleshooting

#### Build Hangs or Times Out

If the Vercel build hangs:
1. Ensure Root Directory is set to `apps/web` in Vercel settings
2. Check that all environment variables are properly configured
3. Verify the build works locally: `pnpm build`
4. Check Vercel build logs for specific errors

#### Environment Variable Issues

- Ensure variables starting with `NEXT_PUBLIC_` are added to Vercel
- For private keys, use Vercel's secret management
- Variables are required at build time for Next.js 15

## Subdomain Configuration

The app is configured to run on `colab.alecia.markets`:
- Asset prefix: `https://colab.alecia.markets` (production only)
- CORS headers configured for `*.alecia.markets`
- Frame embedding allowed from alecia.fr and alecia.markets domains
- Headers configured in `apps/web/vercel.json`
