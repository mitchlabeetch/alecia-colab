"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { CommandMenuProvider } from "@/components/command-menu-provider";
import { CommandPalette } from "@/components/ui/fancy/CommandPalette";

export function ClientProviders({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <CommandMenuProvider>
      {children}
      <CommandPalette />
    </CommandMenuProvider>
  );

  if (!publishableKey) {
    // During build without env vars, just return children
    // Components using Clerk hooks should use dynamic imports with ssr: false
    return content;
  }

  return <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>;
}
