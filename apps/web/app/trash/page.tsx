"use client";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";
import { Trash2 } from "lucide-react";

export default function TrashPage() {
  return (
    <AppShell>
      <EmptyState
        icon={Trash2}
        title="Corbeille"
        description="Les documents supprimés apparaîtront ici. Vous pouvez les restaurer ou les supprimer définitivement."
      />
    </AppShell>
  );
}
