'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { readStreamableValue } from 'ai/rsc';
import { generateOutlineAction } from '@/app/actions/presentation/generate';
import { parsePresentationStream } from '@/lib/presentation-parser';
import { Button } from '@/components/tailwind/ui/button';
import { Textarea } from '@/components/tailwind/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/tailwind/ui/card';
import { Loader2, Plus, Presentation } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import type { Slide } from '@/lib/presentation-parser';

export function PresentationDashboard() {
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

  const createPresentation = useMutation(api.presentations.create);
  const updatePresentation = useMutation(api.presentations.update);
  // @ts-ignore
  const presentations = useQuery(api.presentations.list, isLoaded && user ? { userId: user.id } : "skip");

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<Slide[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    setIsGenerating(true);
    setPreviewSlides([]);

    try {
      // 1. Create draft presentation
      const presentationId = await createPresentation({
        title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
        userId: user.id,
        theme: "corporate",
        language: "fr-FR",
      });

      // 2. Start generation
      const { stream } = await generateOutlineAction(prompt);

      let fullText = '';
      for await (const delta of readStreamableValue(stream)) {
        fullText += delta;

        // Progressive parsing for preview
        const currentSlides = parsePresentationStream(fullText);
        setPreviewSlides(currentSlides);
      }

      // 3. Save final slides
      const slides = parsePresentationStream(fullText);
      await updatePresentation({
        id: presentationId,
        slides,
        status: "complete"
      });

      router.push(`/presentations/${presentationId}`);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Générateur de Présentations</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle présentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <Textarea
              placeholder="Décrivez votre sujet de présentation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
              disabled={isGenerating}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !user}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours ({previewSlides.length} slides)...
                </>
              ) : (
                'Générer la présentation'
              )}
            </Button>

            {/* Live Preview during generation */}
            {isGenerating && previewSlides.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50 max-h-[200px] overflow-y-auto">
                <h3 className="text-sm font-semibold mb-2">Aperçu en temps réel :</h3>
                <ul className="space-y-2 text-sm">
                  {previewSlides.map((slide, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Index stable for preview
                    <li key={i} className="flex items-center gap-2">
                       <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">{i + 1}</span>
                       <span className="truncate">{slide.title || "..."}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {presentations?.slice(0, 4).map((p: any) => (
            <Card
              key={p._id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => router.push(`/presentations/${p._id}`)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                    <Presentation className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <h3 className="font-semibold line-clamp-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {p.slides.length} diapositives
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
