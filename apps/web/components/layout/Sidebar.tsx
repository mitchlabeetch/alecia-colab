"use client";

/**
 * Sidebar Component - Side navigation
 * Features: Navigation links, workspace selector, recently opened items
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Briefcase,
  Calendar as CalendarIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Separator } from "@/components/tailwind/ui/separator";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const navItems = [
  { icon: Home, label: "nav.home", href: "/dashboard" },
  { icon: FileText, label: "nav.documents", href: "/documents" },
  { icon: Briefcase, label: "nav.pipeline", href: "/pipeline" },
  { icon: CalendarIcon, label: "nav.calendar", href: "/calendar" },
  { icon: Settings, label: "nav.settings", href: "/settings" },
];

const recentItems = [
  { name: "Q4 Financial Report", href: "#", date: "2h ago" },
  { name: "TechVenture Due Diligence", href: "#", date: "5h ago" },
  { name: "Integration Plan Template", href: "#", date: "1d ago" },
];

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]",
          "border-r border-border bg-background",
          "transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "hidden md:block",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Collapse button */}
          <div className="flex items-center justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            {/* Main navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed && "justify-center px-2"
                      )}
                      title={collapsed ? t(item.label) : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      {!collapsed && (
                        <span className="ml-3">{t(item.label)}</span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {!collapsed && (
              <>
                <Separator className="my-4" />

                {/* Recently opened */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {t("nav.recentlyOpened")}
                  </div>
                  <div className="space-y-1">
                    {recentItems.map((item, index) => (
                      <Link key={index} href={item.href}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm h-auto py-2"
                        >
                          <div className="flex flex-col items-start">
                            <span className="truncate max-w-[180px]">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.date}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64",
          "border-r border-border bg-background",
          "transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 px-3 py-4">
            {/* Main navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="ml-3">{t(item.label)}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4" />

            {/* Recently opened */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("nav.recentlyOpened")}
              </div>
              <div className="space-y-1">
                {recentItems.map((item, index) => (
                  <Link key={index} href={item.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-auto py-2"
                    >
                      <div className="flex flex-col items-start">
                        <span className="truncate max-w-[180px]">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
