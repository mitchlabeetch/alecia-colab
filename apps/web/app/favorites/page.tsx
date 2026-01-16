"use client";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";
import { Star } from "lucide-react";

export default function FavoritesPage() {
  return (
    <AppShell>
      <EmptyState
        icon={Star}
        title="Favoris"
        description="Vos documents favoris apparaîtront ici. Ajoutez des documents aux favoris pour un accès rapide."
        action={{
          label: "Explorer les documents",
          href: "/documents",
        }}
      />
    </AppShell>
  );
}
