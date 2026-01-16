"use client";

/**
 * Sidebar Component - Side navigation
 * Features: Navigation links, workspace selector, recently opened items
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Home,
  FileText,
  Briefcase,
  Calendar as CalendarIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Plus,
  Star,
  Trash,
  Target,
  Building,
  LayoutDashboard,
  Users,
  Globe,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Separator } from "@/components/tailwind/ui/separator";
import { useDocuments } from "@/hooks/use-convex";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { CollapsibleSection } from "./CollapsibleSection";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const colabSidebarSections = [
  {
    title: "Quick Access",
    collapsible: false,
    items: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: Search, label: "Search", action: "openSearch" },
      { icon: Plus, label: "New Document", href: "/documents/new" },
    ],
  },
  {
    title: "Documents",
    collapsible: true,
    defaultOpen: true,
    items: [
      { icon: Clock, label: "Recent", href: "/recent" },
      { icon: Star, label: "Favorites", href: "/favorites" },
      { icon: FileText, label: "All Documents", href: "/documents" },
      { icon: Trash, label: "Trash", href: "/trash" },
    ],
  },
  {
    title: "Deals & Pipeline",
    collapsible: true,
    defaultOpen: true,
    items: [
      { icon: Briefcase, label: "Active Deals", href: "/pipeline" },
      { icon: Target, label: "Pipeline", href: "/pipeline" },
      { icon: Building, label: "Companies", href: "/companies" },
      { icon: CalendarIcon, label: "Calendar", href: "/calendar" },
    ],
  },
  {
    title: "Settings",
    collapsible: false,
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Admin Panel",
    collapsible: true,
    defaultOpen: false,
    items: [
      { icon: LayoutDashboard, label: "Admin Dashboard", href: "/admin/dashboard", external: true },
      { icon: Users, label: "CRM", href: "/admin/crm", external: true },
    ],
  },
  {
    title: "External",
    collapsible: true,
    defaultOpen: false,
    items: [
      { icon: Globe, label: "Website", href: "https://alecia.markets", external: true },
      { icon: HelpCircle, label: "Documentation", href: "/docs", external: true },
    ],
  },
];

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]",
          "border-r border-border bg-background",
          "transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "hidden md:block",
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {/* Collapse button */}
          <div className="flex items-center justify-end p-2">
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            {!collapsed && (
              <div className="space-y-4">
                {colabSidebarSections.map((section, sectionIndex) => (
                  <CollapsibleSection
                    key={sectionIndex}
                    title={section.title}
                    collapsible={section.collapsible}
                    defaultOpen={section.defaultOpen}
                  >
                    <nav className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link key={item.href} href={item.href} target={item.external ? "_blank" : undefined}>
                            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                              <Icon className="h-5 w-5" />
                              <span className="ml-3">{item.label}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </nav>
                  </CollapsibleSection>
                ))}
              </div>
            )}

            {collapsed && (
              <nav className="space-y-1">
                {colabSidebarSections[0].items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-center px-2"
                        title={item.label}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  );
                })}
              </nav>
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
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-4">
              {colabSidebarSections.map((section, sectionIndex) => (
                <CollapsibleSection
                  key={sectionIndex}
                  title={section.title}
                  collapsible={section.collapsible}
                  defaultOpen={section.defaultOpen}
                >
                  <nav className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          target={item.external ? "_blank" : undefined}
                        >
                          <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                            <Icon className="h-5 w-5" />
                            <span className="ml-3">{item.label}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>
                </CollapsibleSection>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
