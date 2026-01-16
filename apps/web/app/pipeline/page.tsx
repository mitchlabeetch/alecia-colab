"use client";

import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { fr } from "@/lib/i18n";

const DealPipeline = dynamic(
  () => import("@/components/tailwind/deal-pipeline"),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default function PipelinePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{fr.pipeline.title}</h1>
          <p className="text-muted-foreground">Gérez vos deals à travers le pipeline de vente</p>
        </div>
        <DealPipeline />
      </div>
    </AppShell>
  );
}
