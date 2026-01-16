import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/tailwind/ui/dialog';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/tailwind/ui/textarea';
import { Button } from '@/components/tailwind/ui/button';
import { Input } from '@/components/tailwind/ui/input';
import { CheckSquare, Plus } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface CardModalProps {
  cardId: string;
  open: boolean;
  onClose: () => void;
}

export function CardModal({ cardId, open, onClose }: CardModalProps) {
  // @ts-ignore
  const card = useQuery(api.boards.getCard, { cardId: cardId as Id<"colab_cards"> });
  const updateCard = useMutation(api.boards.updateCard);
  // @ts-ignore
  const checklists = useQuery(api.boards.getChecklists, { cardId: cardId as Id<"colab_cards"> });
  const addChecklist = useMutation(api.boards.addChecklist);
  const addChecklistItem = useMutation(api.boards.addChecklistItem);
  const toggleItem = useMutation(api.boards.toggleChecklistItem);

  const [description, setDescription] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newItemContents, setNewItemContents] = useState<Record<string, string>>({});

  useEffect(() => {
    if (card) {
      setDescription(card.description || "");
    }
  }, [card]);

  const handleSaveDescription = async () => {
    // @ts-ignore
    await updateCard({ cardId: cardId as Id<"colab_cards">, description, userId: "user" }); // Need user context
    setIsEditingDesc(false);
  };

  const handleAddChecklist = async () => {
    if (!newChecklistName.trim()) return;
    // @ts-ignore
    await addChecklist({ name: newChecklistName, cardId: cardId as Id<"colab_cards"> });
    setNewChecklistName("");
  };

  const handleAddItem = async (checklistId: string) => {
    const content = newItemContents[checklistId];
    if (!content?.trim()) return;
    // @ts-ignore
    await addChecklistItem({ content, checklistId: checklistId as Id<"colab_checklists"> });
    setNewItemContents(prev => ({ ...prev, [checklistId]: "" }));
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{card.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">

            {/* Description */}
            <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">Description</h3>
                {isEditingDesc ? (
                    <div className="space-y-2">
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveDescription}>Enregistrer</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditingDesc(false)}>Annuler</Button>
                        </div>
                    </div>
                ) : (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: Interactive div is fine for this specific edit mode
                    <div
                        onClick={() => setIsEditingDesc(true)}
                        className="min-h-[60px] p-3 rounded-md hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-all"
                    >
                        {card.description || <span className="text-muted-foreground italic">Ajouter une description...</span>}
                    </div>
                )}
            </div>

            {/* Checklists */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" /> Checklists
                    </h3>
                </div>

                {checklists?.map((list: { _id: string; name: string; items?: { _id: string; completed: boolean; content: string }[] }) => (
                    <div key={list._id} className="space-y-2 border rounded-lg p-3">
                        <h4 className="font-medium text-sm">{list.name}</h4>
                        <div className="space-y-1">
                            {list.items?.map((item) => (
                                <div key={item._id} className="flex items-center gap-2 group">
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        // @ts-ignore
                                        onChange={(e) => toggleItem({ itemId: item._id, completed: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                        {item.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Input
                                placeholder="Nouvel élément..."
                                value={newItemContents[list._id] || ""}
                                onChange={(e) => setNewItemContents(prev => ({ ...prev, [list._id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem(list._id)}
                                className="h-8 text-sm"
                            />
                            <Button size="sm" variant="outline" onClick={() => handleAddItem(list._id)}>Ajouter</Button>
                        </div>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Input
                        placeholder="Nom de la checklist..."
                        value={newChecklistName}
                        onChange={(e) => setNewChecklistName(e.target.value)}
                        className="h-9"
                    />
                    <Button size="sm" onClick={handleAddChecklist} disabled={!newChecklistName}>
                        <Plus className="h-4 w-4 mr-1" /> Nouvelle liste
                    </Button>
                </div>
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
