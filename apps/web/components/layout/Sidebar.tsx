"use client";

/**
 * Sidebar Component - Side navigation
 * Features: Navigation links, workspace selector, recently opened items
 */

import { useCommandMenu } from "@/components/command-menu-provider";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/tailwind/ui/sheet";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, FileText, Home, LayoutDashboard, Presentation, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-provider";

interface SidebarProps {
  className?: string;
}

const colabSidebarSections = [
  {
    title: "Principal",
    collapsible: false,
    items: [
      { icon: Home, label: "Accueil", href: "/dashboard" },
      { icon: FileText, label: "Documents", href: "/documents" },
      { icon: LayoutDashboard, label: "Tableaux", href: "/pipeline" },
      { icon: Presentation, label: "Présentations", href: "/presentations" },
      { icon: CalendarIcon, label: "Calendrier", href: "/calendar" },
      { icon: Users, label: "Équipe", href: "/team" },
    ],
  },
];

function SidebarContent() {
  const { isCollapsed, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col py-4">
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4">
          {colabSidebarSections.map((section, sectionIndex) => (
            <div key={section.title || sectionIndex}>
              {!isCollapsed && section.title && (
                <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  {section.title}
                </h4>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  // Mobile or Expanded
                  if (!isCollapsed) {
                    return (
                      <Link key={item.label} href={item.href || "#"} onClick={() => setMobileOpen(false)}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start h-11 md:h-10" // h-11 (44px) for mobile, h-10 for desktop
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    );
                  }

                  // Collapsed (Desktop only)
                  return (
                    <Link key={item.label} href={item.href || "#"}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-center px-2 h-10" // Desktop collapsed stays h-10
                        title={item.label}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const { setOpen: setCommandOpen } = useCommandMenu();

  const _handleAction = (action?: string) => {
    if (action === "openSearch") {
      setCommandOpen(true);
      if (window.innerWidth < 768) {
        setMobileOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay & Drawer (Using Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)]",
          "border-r border-border bg-background",
          "transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
