import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import 'katex/dist/katex.min.css';

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from "./ConvexClientProvider";
import Providers from "./providers";

const title = "Alecia Colab - M&A Knowledge Base & Collaboration Platform";
const description =
  "Alecia Colab is a comprehensive M&A knowledge centralization and collaboration platform. Streamline deal workflows, due diligence, and integration planning.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@alecia",
  },
  metadataBase: new URL("https://colab.alecia.markets"),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const isClerkEnabled = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isConvexEnabled = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  // Build the provider tree based on what's configured
  let content = <Providers>{children}</Providers>;
  
  if (isConvexEnabled) {
    content = <ConvexClientProvider>{content}</ConvexClientProvider>;
  }
  
  if (isClerkEnabled) {
    content = <ClerkProvider>{content}</ClerkProvider>;
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{content}</body>
    </html>
  );
}
