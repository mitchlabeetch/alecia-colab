import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import "katex/dist/katex.min.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Providers from "./providers";

const title = "Alecia Colab - Plateforme de collaboration M&A";
const description =
  "Alecia Colab est une plateforme complète de centralisation des connaissances et de collaboration M&A. Rationalisez les flux de travail, la due diligence et la planification d'intégration.";

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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
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
    <html lang="fr" suppressHydrationWarning>
      <body>{content}</body>
    </html>
  );
}
