import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import "katex/dist/katex.min.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ClientProviders } from "./ClientProviders";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Providers from "./providers";

// Force dynamic rendering for the entire app to avoid SSG auth errors
export const dynamic = "force-dynamic";

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
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ClientProviders>
          <ConvexClientProvider>
            <Providers>{children}</Providers>
          </ConvexClientProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
