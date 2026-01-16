"use client";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarDays } from "lucide-react";


// Prevent static generation
export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <AppShell>
      <EmptyState
        icon={CalendarDays}
        title="Calendrier"
        description="La vue calendrier sera bientôt disponible. Vous pourrez visualiser et gérer tous vos événements et échéances."
      />
    </AppShell>
  );
}
