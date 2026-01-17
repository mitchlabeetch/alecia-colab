"use client";

/**
 * AppShell Component - Main layout wrapper
 * Features: Header, Sidebar, Main content area
 */

import { cn } from "@/lib/utils";
import { ColabBreadcrumbs } from "./ColabBreadcrumbs";
import { Dock } from "@/components/navigation/Dock";
import { ColabHeader } from "./ColabHeader";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-provider";

interface AppShellProps {
  children: React.ReactNode;
  mode?: "embedded" | "standalone";
  className?: string;
}

function AppShellContent({ children, mode = "standalone", className }: AppShellProps) {
  const { isCollapsed } = useSidebar();

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
    <div className="relative min-h-screen pb-20">
      <ColabHeader />
      <Sidebar />
      <Dock />
      <main
        className={cn(
          "min-h-[calc(100vh-3.5rem)]",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-16" : "md:pl-64",
          className,
        )}
      >
        <div className="container py-6 px-4">{children}</div>
      </main>
    </div>
  );
}

// Wrapper to provide context
export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent {...props} />
    </SidebarProvider>
  );
}
