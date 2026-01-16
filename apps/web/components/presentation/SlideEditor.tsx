'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/tailwind/ui/button';
import { Textarea } from '@/components/tailwind/ui/textarea';
import { Input } from '@/components/tailwind/ui/input';
import { ScrollArea } from '@/components/tailwind/ui/scroll-area';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

export type SlideTheme = 'midnight' | 'corporate' | 'light';

export const ALECIA_THEMES = {
  midnight: {
    background: 'bg-[#1e293b]', // var(--alecia-midnight) approx
    text: 'text-white',
    accent: 'border-[#0ea5e9]', // var(--alecia-sky) approx
  },
  corporate: {
    background: 'bg-[#0f172a]', // var(--alecia-corporate) approx
    text: 'text-white',
    accent: 'border-[#eab308]', // var(--alecia-gold-accent) approx
  },
  light: {
    background: 'bg-white', // var(--alecia-white)
    text: 'text-[#1e293b]', // var(--alecia-midnight)
    accent: 'border-[#ef4444]', // var(--alecia-red) approx
  },
};

interface Slide {
  id: string;
  title: string;
  content: string[]; // Simplification for bullet points
  rootImage?: {
    url: string;
    query: string;
  };
}

interface SlideEditorProps {
  slides: Slide[];
  currentSlideIndex: number;
  theme: SlideTheme;
  onUpdateSlide: (index: number, slide: Slide) => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  onSelectSlide: (index: number) => void;
}

export const exportToPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${fileName}.pdf`);
};

export function SlideEditor({
  slides,
  currentSlideIndex,
  theme,
  onUpdateSlide,
  onAddSlide,
  onRemoveSlide,
  onSelectSlide,
}: SlideEditorProps) {
  const currentSlide = slides[currentSlideIndex];
  const themeStyles = ALECIA_THEMES[theme];
  const slideRef = useRef<HTMLDivElement>(null);

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Aucune diapositive sélectionnée
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar: Thumbnails */}
      <div className="w-64 border-r flex flex-col bg-muted/30">
        <div className="p-4 border-b font-semibold">
          Diapositives ({slides.length})
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => onSelectSlide(index)}
                className={cn(
                  "relative group cursor-pointer border-2 rounded-lg aspect-video p-2 flex flex-col overflow-hidden transition-all text-left",
                  index === currentSlideIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/20",
                   themeStyles.background
                )}
              >
                <div className={cn("text-[10px] font-bold truncate mb-1", themeStyles.text)}>
                  {slide.title || "Sans titre"}
                </div>
                <div className={cn("text-[8px] opacity-70 line-clamp-3", themeStyles.text)}>
                  {slide.content.map((b, i) => <div key={`${i}-${b.substring(0, 10)}`}>• {b}</div>)}
                </div>

                <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSlide(index);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="absolute bottom-1 left-2 text-[10px] text-muted-foreground">
                  {index + 1}
                </div>
              </button>
            ))}

            <Button
              variant="outline"
              className="w-full h-24 border-dashed"
              onClick={onAddSlide}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une diapositive
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-8 bg-muted/10 flex flex-col items-center overflow-hidden">
        <div
          id="slide-content"
          ref={slideRef}
          className={cn(
          "w-full max-w-4xl aspect-video rounded-xl shadow-2xl p-12 flex flex-col relative",
          themeStyles.background,
          themeStyles.text
        )}>
           {/* Slide Content */}
           <Input
             className={cn(
               "text-4xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 mb-8",
               themeStyles.text
             )}
             value={currentSlide.title}
             onChange={(e) => onUpdateSlide(currentSlideIndex, { ...currentSlide, title: e.target.value })}
             placeholder="Titre de la diapositive"
           />

           <div className="flex-1 flex gap-8">
             <div className="flex-1 space-y-4">
               {currentSlide.content.map((point, i) => (
                 <div key={`${i}-${point.substring(0, 10)}`} className="flex gap-2">
                   <div className={cn("mt-2 h-2 w-2 rounded-full shrink-0",
                     theme === 'light' ? 'bg-primary' : 'bg-white'
                   )} />
                   <Textarea
                     className={cn(
                       "flex-1 bg-transparent border-none p-0 min-h-[40px] resize-none focus-visible:ring-0 text-lg leading-relaxed",
                       themeStyles.text
                     )}
                     value={point}
                     onChange={(e) => {
                       const newContent = [...currentSlide.content];
                       newContent[i] = e.target.value;
                       onUpdateSlide(currentSlideIndex, { ...currentSlide, content: newContent });
                     }}
                   />
                 </div>
               ))}
               <Button
                 variant="ghost"
                 size="sm"
                 className="mt-2 text-muted-foreground hover:text-foreground"
                 onClick={() => onUpdateSlide(currentSlideIndex, {
                   ...currentSlide,
                   content: [...currentSlide.content, "Nouveau point"]
                 })}
               >
                 <Plus className="mr-2 h-3 w-3" /> Ajouter un point
               </Button>
             </div>

             {/* Image Placehoder */}
             <div className={cn(
               "w-1/3 rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden group",
               themeStyles.accent
             )}>
                {currentSlide.rootImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentSlide.rootImage.url}
                    alt="Slide visual"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs opacity-70">
                      {currentSlide.rootImage?.query || "Image générée par IA"}
                    </p>
                  </div>
                )}
             </div>
           </div>

           <div className={cn(
             "absolute bottom-4 right-6 text-sm font-medium opacity-50",
             themeStyles.text
           )}>
             Alecia Colab
           </div>
        </div>
      </div>
    </div>
  );
}
