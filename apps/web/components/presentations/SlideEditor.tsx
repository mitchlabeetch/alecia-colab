'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/tailwind/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Slide } from '@/lib/presentation-parser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    // Landscape A4 size approx in px at 72dpi is 842x595, but we use canvas dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Export PDF failed", error);
  }
};

interface SlideEditorProps {
  presentationId: Id<"colab_presentations">;
}

const ALECIA_THEMES = {
  midnight: {
    background: 'bg-[var(--alecia-midnight)]',
    text: 'text-[var(--alecia-white)]',
    accent: 'text-[var(--alecia-sky)]',
    bgAccent: 'bg-[var(--alecia-sky)]',
  },
  corporate: {
    background: 'bg-[var(--alecia-corporate)]',
    text: 'text-[var(--alecia-white)]',
    accent: 'text-[var(--alecia-gold-accent)]',
    bgAccent: 'bg-[var(--alecia-gold-accent)]',
  },
  light: {
    background: 'bg-[var(--alecia-white)]',
    text: 'text-[var(--alecia-midnight)]',
    accent: 'text-[var(--alecia-red)]',
    bgAccent: 'bg-[var(--alecia-red)]',
  },
};

export function SlideEditor({ presentationId }: SlideEditorProps) {
  const presentation = useQuery(api.presentations.get, { id: presentationId });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!presentation) {
    return <div>Chargement...</div>;
  }

  const slides: Slide[] = presentation.slides as unknown as Slide[] || [];
  const currentSlide = slides[currentSlideIndex];
  // @ts-ignore
  const theme = ALECIA_THEMES[presentation.theme as keyof typeof ALECIA_THEMES] || ALECIA_THEMES.corporate;

  const handleExportPDF = () => {
    // We use the exported function from this file or similar logic
    // The previous implementation had exportToPDF export but it was not used here
    exportToPDF("slide-content", presentation.title || "presentation");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row overflow-hidden">
      {/* Sidebar: Slide List */}
      <div className="w-full md:w-64 border-r bg-muted/30 overflow-y-auto p-4 space-y-4 print:hidden">
        <h2 className="font-semibold text-sm mb-4">Diapositives</h2>
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id || `slide-${index}`}
            onClick={() => setCurrentSlideIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentSlideIndex(index);
              }
            }}
            className={cn(
              "w-full text-left cursor-pointer p-3 rounded-lg border text-sm transition-all hover:bg-accent",
              currentSlideIndex === index ? "bg-accent border-primary ring-1 ring-primary" : "bg-card"
            )}
          >
            <div className="font-medium truncate mb-1">
              {index + 1}. {slide.title}
            </div>
          </button>
        ))}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-muted/10">
        {/* Toolbar */}
        <div className="h-14 border-b bg-background px-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{presentation.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exporter en PDF
            </Button>
          </div>
        </div>

        {/* Slide Preview / Edit */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center print:p-0">
          {currentSlide ? (
            <div id="slide-content" className="w-full max-w-4xl aspect-video shadow-2xl rounded-lg overflow-hidden print:shadow-none print:w-full print:h-screen print:rounded-none">
              <div className={cn("w-full h-full p-12 flex flex-col", theme.background, theme.text)}>
                <h1 className={cn("text-4xl font-bold mb-8", theme.accent)}>
                  {currentSlide.title}
                </h1>

                <div className="flex-1 space-y-6">
                  {currentSlide.content?.map((block, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: No stable ID available for blocks
                    <div key={i} className="text-xl">
                      {block.type === 'bullet' && (
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-2 h-2 w-2 rounded-full flex-shrink-0", theme.bgAccent)} />
                          <p>{block.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {currentSlide.rootImage && (
                  <div className="mt-8 h-48 bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                    <p className="text-sm opacity-70">
                      Image placeholder: {currentSlide.rootImage.query}
                    </p>
                  </div>
                )}

                <div className="mt-auto text-sm opacity-50 flex justify-between">
                  <span>Alecia Colab</span>
                  <span>{currentSlideIndex + 1} / {slides.length}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Sélectionnez une diapositive</div>
          )}
        </div>
      </div>

      {/* Print-only View (renders all slides) */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
        {slides.map((slide, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for print view
          <div key={`print-slide-${index}`} className="w-screen h-screen page-break-after-always">
             <div className={cn("w-full h-full p-12 flex flex-col", theme.background, theme.text)}>
                <h1 className={cn("text-4xl font-bold mb-8", theme.accent)}>
                  {slide.title}
                </h1>

                <div className="flex-1 space-y-6">
                  {slide.content?.map((block, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: No stable ID available for blocks
                    <div key={i} className="text-xl">
                      {block.type === 'bullet' && (
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-2 h-2 w-2 rounded-full flex-shrink-0", theme.bgAccent)} />
                          <p>{block.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                 <div className="mt-auto text-sm opacity-50 flex justify-between">
                  <span>Alecia Colab</span>
                  <span>{index + 1} / {slides.length}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
