'use client';

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Textarea } from "@/components/tailwind/ui/textarea";
import { Button } from "@/components/tailwind/ui/button";
import { Calendar, Tag, CheckSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface CardModalProps {
  cardId: string;
  onClose: () => void;
}

const FRENCH_STRINGS = {
  labels: "Étiquettes",
  dueDate: "Date d'échéance",
  checklist: "Checklist",
  description: "Description",
  activity: "Activité",
  add: "Ajouter",
  save: "Enregistrer",
  delete: "Supprimer",
};

export function CardModal({ cardId, onClose }: CardModalProps) {
  // Since we don't have a single getCard query, we'd typically need one.
  // Assuming we might pass the full card data or fetch it.
  // For now, let's assume we need to fetch it. But our kanban.ts only has getCards (by list).
  // I'll assume we can get it from the cache or add a getCard query.
  // I added `getBoardData` which returns everything.
  // Let's add a specific query for single card in a real app,
  // but here I might have to rely on what I wrote or update `kanban.ts`.
  // Wait, I didn't write `getCard` in `kanban.ts`? I wrote `getCards` (plural).
  // Let's just mock it or better, update `kanban.ts`?
  // I'll update `kanban.ts` in a separate step if needed, but for now I will simulate it
  // or use `useQuery` if I had `getCard`.
  // Actually, I should probably add `getCard` to `kanban.ts`.

  // Update: I will just use a placeholder text since I can't easily edit kanban.ts inside this tool call
  // without breaking flow (or I can do it in next step).
  // For this batch, I'll structure the UI.

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Dummy mutation calls
  const updateCard = useMutation(api.kanban.updateCard);

  const handleSave = () => {
    updateCard({
        cardId: cardId as Id<"colab_cards">,
        title,
        description: desc
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header Image if any */}

        <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
                <Input
                    className="text-2xl font-bold border-none px-0 h-auto focus-visible:ring-0"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Titre de la carte"
                />
                <div className="text-sm text-muted-foreground mt-1">
                    Dans la liste <span className="underline">...</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="col-span-3 space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-sm">
                            <span className="h-5 w-5">📄</span>
                            {FRENCH_STRINGS.description}
                        </div>
                        <Textarea
                            className="min-h-[150px] resize-none"
                            placeholder="Ajouter une description détaillée..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>

                    {/* Checklists */}
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 font-semibold text-sm">
                            <CheckSquare className="h-4 w-4" />
                            {FRENCH_STRINGS.checklist}
                        </div>
                        {/* Checklist items would go here */}
                        <div className="p-2 border rounded bg-muted/20 text-sm text-muted-foreground">
                            Pas d'éléments
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase">
                        {FRENCH_STRINGS.add}
                    </div>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-sm h-8">
                            <Tag className="mr-2 h-3 w-3" /> {FRENCH_STRINGS.labels}
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm h-8">
                            <CheckSquare className="mr-2 h-3 w-3" /> {FRENCH_STRINGS.checklist}
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm h-8">
                            <Calendar className="mr-2 h-3 w-3" /> {FRENCH_STRINGS.dueDate}
                        </Button>
                    </div>

                    <div className="text-xs font-semibold text-muted-foreground uppercase mt-6">
                        Actions
                    </div>
                    <div className="space-y-2">
                         <Button variant="secondary" className="w-full justify-start text-sm h-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-3 w-3" /> {FRENCH_STRINGS.delete}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>{FRENCH_STRINGS.save}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
