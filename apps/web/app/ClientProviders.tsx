"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    // During build without env vars, just return children
    // Components using Clerk hooks should use dynamic imports with ssr: false
    return <>{children}</>;
  }
  
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
