"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexProvider } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import type { ReactNode } from "react";

// Create convex client only if URL is available
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no Convex URL is configured, just pass through children
  if (!convex) {
    return <>{children}</>;
  }

  const hasClerk = typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'undefined';
  
  if (hasClerk) {
    return (
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    );
  }
  
  // Fallback without Clerk auth
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
