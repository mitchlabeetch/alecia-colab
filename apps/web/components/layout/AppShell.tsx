"use client";

/**
 * AppShell Component - Main layout wrapper
 * Features: Header, Sidebar, Main content area
 */

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)]",
          "md:pl-64", // Offset for sidebar on desktop
          "transition-all duration-300",
          className
        )}
      >
        <div className="container py-6 px-4">{children}</div>
      </main>
    </div>
  );
}
