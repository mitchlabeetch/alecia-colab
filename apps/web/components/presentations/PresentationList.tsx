'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/tailwind/ui/button';
import { Card, CardContent, CardHeader } from '@/components/tailwind/ui/card';
import { Plus, Presentation } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export function PresentationList() {
  const router = useRouter();

  // Safe use of useUser with fallback for environments without Clerk
  let user: { id: string } | null | undefined = null;
  let isLoaded = true;

  try {
    const clerk = useUser();
    user = clerk.user;
    isLoaded = clerk.isLoaded;
  } catch (_e) {
    // If Clerk is not available (e.g. no provider), use a mock or null
    // In dev without keys, we might want to mock it to test UI
    if (process.env.NODE_ENV === 'development') {
       user = { id: "dev_user_mock" };
       isLoaded = true;
    }
  }

  // @ts-ignore
  const presentations = useQuery(api.presentations.list, isLoaded && user ? { userId: user.id } : "skip");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Présentations</h1>
        <Button onClick={() => router.push('/presentations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle présentation
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Create New Card */}
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed flex flex-col items-center justify-center min-h-[160px]"
          onClick={() => router.push('/presentations/new')}
        >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold text-primary">Créer une présentation</span>
        </Card>

        {presentations?.map((p: any) => (
          <Card
            key={p._id}
            className="cursor-pointer hover:bg-accent/50 transition-colors flex flex-col"
            onClick={() => router.push(`/presentations/${p._id}`)}
          >
            <CardHeader className="p-4 flex-1">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Presentation className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h3 className="font-semibold mt-3 line-clamp-2">{p.title}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 mt-auto">
              <p className="text-sm text-muted-foreground">
                {p.slides.length} diapositive{p.slides.length > 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {presentations && presentations.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
              Aucune présentation pour le moment.
          </div>
      )}
    </div>
  );
}
