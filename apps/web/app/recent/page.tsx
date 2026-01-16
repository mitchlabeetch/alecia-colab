"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RecentFiles } from "@/components/recent-files/RecentFiles";
import { fr } from "@/lib/i18n";
import { Clock } from "lucide-react";


// Prevent static generation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function RecentPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{fr.nav.recent}</h1>
            <p className="text-muted-foreground">Vos documents récemment consultés</p>
          </div>
        </div>
        <RecentFiles limit={20} showCreateButton />
      </div>
    </AppShell>
  );
}
