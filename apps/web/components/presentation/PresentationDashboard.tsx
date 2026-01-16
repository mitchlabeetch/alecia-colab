'use client';

import { useState } from 'react';
import { generateOutlineAction } from '@/app/actions/presentation/generate';
import { readStreamableValue } from 'ai/rsc';
import { Button } from '@/components/tailwind/ui/button';
import { Textarea } from '@/components/tailwind/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/tailwind/ui/select';
import { SlideEditor, type SlideTheme, exportToPDF } from './SlideEditor';
import { Loader2, Wand2, Download, ChevronLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PresentationDashboardProps {
  initialPresentations?: unknown[];
}

interface Slide {
  id: string;
  title: string;
  content: string[];
  rootImage?: {
    url: string;
    query: string;
  };
}

export function PresentationDashboard({ initialPresentations: _initialPresentations = [] }: PresentationDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('fr-FR');
  const [theme, setTheme] = useState<SlideTheme>('midnight');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [mode, setMode] = useState<'dashboard' | 'editor'>('dashboard');
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);

  const presentations = useQuery(api.presentations.getPresentations);
  const createPresentation = useMutation(api.presentations.createPresentation);
  const updatePresentation = useMutation(api.presentations.updatePresentation);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setSlides([]);
    setMode('editor');

    // Create new presentation entry
    try {
        // biome-ignore lint/suspicious/noExplicitAny: Temporary cast for ID
        const newId = await createPresentation({ title: prompt.substring(0, 50), theme, language }) as any;
        setCurrentPresentationId(newId);

        const { output } = await generateOutlineAction(prompt, language);

        let fullText = '';

        for await (const delta of readStreamableValue(output)) {
            fullText += delta;
            parseSlides(fullText, newId);
        }
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la génération");
        setIsGenerating(false);
    }
  };

  const parseSlides = (text: string, presentationId: string) => {
    const slideRegex = /<SLIDE>([\s\S]*?)<\/SLIDE>/g;
    const matches = [...text.matchAll(slideRegex)];

    const newSlides: Slide[] = matches.map(match => {
      const content = match[1];
      const titleMatch = content.match(/<TITLE>(.*?)<\/TITLE>/);
      const bulletMatches = [...content.matchAll(/<BULLET>(.*?)<\/BULLET>/g)];
      const imageMatch = content.match(/<IMAGE>(.*?)<\/IMAGE>/);

      return {
        id: uuidv4(),
        title: titleMatch ? titleMatch[1] : "Nouvelle diapositive",
        content: bulletMatches.map(m => m[1]),
        rootImage: imageMatch ? { query: imageMatch[1], url: '' } : undefined
      };
    });

    if (newSlides.length > 0) {
        setSlides(newSlides);
        // Persist updates
        // biome-ignore lint/suspicious/noExplicitAny: Temporary cast for mutation args
        updatePresentation({ presentationId: presentationId as any, slides: newSlides as any }).catch(console.error);
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: Presentation type is complex
  const openPresentation = (presentation: any) => {
      setSlides(presentation.slides || []);
      setTheme(presentation.theme as SlideTheme);
      setCurrentPresentationId(presentation._id);
      setMode('editor');
  };

  if (mode === 'editor') {
    return (
      <div className="flex flex-col h-screen">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setMode('dashboard')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold">Éditeur de Présentation</h1>
            {isGenerating && (
              <span className="flex items-center text-xs text-muted-foreground animate-pulse">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Génération en cours...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={theme} onValueChange={(v) => setTheme(v as SlideTheme)}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue placeholder="Thème" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="midnight">Minuit</SelectItem>
                 <SelectItem value="corporate">Entreprise</SelectItem>
                 <SelectItem value="light">Clair</SelectItem>
               </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => exportToPDF("slide-content", "presentation")}>
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <SlideEditor
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            theme={theme}
            onUpdateSlide={(idx, slide) => {
              const newSlides = [...slides];
              newSlides[idx] = slide;
              setSlides(newSlides);
              if(currentPresentationId) {
                  // biome-ignore lint/suspicious/noExplicitAny: Temporary cast for mutation args
                  updatePresentation({ presentationId: currentPresentationId as any, slides: newSlides as any });
              }
            }}
            onAddSlide={() => setSlides([...slides, { id: uuidv4(), title: 'Nouveau', content: [] }])}
            onRemoveSlide={(idx) => {
              const newSlides = slides.filter((_, i) => i !== idx);
              setSlides(newSlides);
              if (currentSlideIndex >= newSlides.length) setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
            }}
            onSelectSlide={setCurrentSlideIndex}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Générateur de Présentations IA</h1>
          <p className="text-muted-foreground">
            Créez des présentations professionnelles en quelques secondes pour vos dossiers M&A.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
              <div className="space-y-2">
                <label htmlFor="presentation-prompt" className="text-sm font-medium">Sujet ou contenu de la présentation</label>
                <Textarea
                  id="presentation-prompt"
                  placeholder="Ex: Analyse du marché de la cybersécurité en Europe pour une acquisition potentielle..."
                  className="min-h-[150px] resize-none text-lg"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   {/* biome-ignore lint/a11y/noLabelWithoutControl: Select trigger handles aria-labelledby */}
                   <label className="text-sm font-medium" id="theme-label">Thème</label>
                   <Select value={theme} onValueChange={(v) => setTheme(v as SlideTheme)}>
                     <SelectTrigger aria-labelledby="theme-label">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="midnight">Alecia Minuit</SelectItem>
                       <SelectItem value="corporate">Corporate Gold</SelectItem>
                       <SelectItem value="light">Clean Light</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   {/* biome-ignore lint/a11y/noLabelWithoutControl: Select trigger handles aria-labelledby */}
                   <label className="text-sm font-medium" id="language-label">Langue</label>
                   <Select value={language} onValueChange={setLanguage}>
                     <SelectTrigger aria-labelledby="language-label">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="fr-FR">Français</SelectItem>
                       <SelectItem value="en-US">English</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Générer la présentation
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Récents</h3>
            {/* Real presentations list */}
            {presentations === undefined ? (
               <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
            ) : presentations.length === 0 ? (
                <div className="border rounded-lg p-4 bg-muted/20 text-center text-sm text-muted-foreground">
                  Aucune présentation récente
                </div>
            ) : (
                <div className="space-y-2">
                    {/* biome-ignore lint/suspicious/noExplicitAny: Presentation type */}
                    {presentations.map((p: any) => (
                        <button
                            type="button"
                            key={p._id}
                            className="w-full text-left p-3 border rounded-lg bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => openPresentation(p)}
                        >
                            <div className="font-medium text-sm truncate">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div>
                        </button>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
