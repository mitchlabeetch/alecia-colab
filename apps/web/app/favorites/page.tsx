"use client";

import { Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/empty-state";

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
