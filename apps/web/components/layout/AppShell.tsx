"use client";

/**
 * AppShell Component - Main layout wrapper
 * Features: Header, Sidebar, Main content area
 */

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ColabBreadcrumbs } from "./ColabBreadcrumbs";
import { CommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  mode?: "embedded" | "standalone";
  className?: string;
}

export function AppShell({ children, mode = "standalone", className }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Detect if running in iframe (embedded mode)
  const isEmbedded = mode === "embedded" || (typeof window !== "undefined" && window.self !== window.top);

  if (isEmbedded) {
    // Minimal shell - parent provides navigation
    return (
      <div className="relative h-full w-full">
        <ColabBreadcrumbs />
        <main className={cn("h-[calc(100%-40px)]", className)}>{children}</main>
      </div>
    );
  }

  // Full standalone shell
  return (
    <div className="relative min-h-screen">
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAction={(action) => {
          if (action === "openSearch") {
            setSearchOpen(true);
          }
        }}
      />
      <main className={cn("min-h-[calc(100vh-4rem)]", "md:pl-64", "transition-all duration-300", className)}>
        <div className="container py-6 px-4">{children}</div>
      </main>
    </div>
  );
}
