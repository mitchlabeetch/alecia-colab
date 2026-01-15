import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/embed(.*)',
  '/api/upload',
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow cross-origin requests from alecia.markets domains
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://alecia.markets',
    'https://panel.alecia.markets',
    'https://colab.alecia.markets',
    'https://alecia.fr',
  ];
  
  // Only require authentication if Clerk is configured and not a public route
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !isPublicRoute(request)) {
    await auth.protect();
  }
  
  const response = NextResponse.next();
  
  // Add CORS headers for allowed origins
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed.replace('https://', 'https://')) || origin === allowed)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  return response;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
