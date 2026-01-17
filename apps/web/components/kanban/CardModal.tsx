import { Badge } from "@/components/tailwind/ui/badge";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Textarea } from "@/components/tailwind/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, Calendar, CheckSquare, Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";

const KANBAN_STRINGS = {
  addCard: "Ajouter une carte",
  labels: "Étiquettes",
  dueDate: "Échéance",
  activity: "Activité",
  move: "Déplacer",
};

interface CardModalProps {
  cardId: string;
  open: boolean;
  onClose: () => void;
  boardLabels: any[];
  boardId: Id<"colab_boards">;
}

export function CardModal({ cardId, open, onClose, boardLabels, boardId }: CardModalProps) {
  const { user } = useUser();
  // @ts-ignore
  const card = useQuery(api.boards.getCard, { cardId: cardId as Id<"colab_cards"> });
  const updateCard = useMutation(api.boards.updateCard);
  // @ts-ignore
  const checklists = useQuery(api.boards.getChecklists, { cardId: cardId as Id<"colab_cards"> });
  const addChecklist = useMutation(api.boards.addChecklist);
  const deleteChecklist = useMutation(api.boards.deleteChecklist);
  const addChecklistItem = useMutation(api.boards.addChecklistItem);
  const toggleItem = useMutation(api.boards.toggleChecklistItem);
  const deleteItem = useMutation(api.boards.deleteChecklistItem);
  const addLabel = useMutation(api.boards.addLabel);
  // @ts-ignore
  const activities = useQuery(api.boards.getCardActivities, { cardId: cardId as Id<"colab_cards"> });

  const [description, setDescription] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState("");
  const [newItemContents, setNewItemContents] = useState<Record<string, string>>({});
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#EF4444"); // Default red

  useEffect(() => {
    if (card) {
      setDescription(card.description || "");
    }
  }, [card]);

  const handleSaveDescription = async () => {
    if (!user) return;
    // @ts-ignore
    await updateCard({ cardId: cardId as Id<"colab_cards">, description, userId: user.id });
    setIsEditingDesc(false);
  };

  const handleUpdateTitle = async (newTitle: string) => {
    if (!user || !newTitle.trim()) return;
    // @ts-ignore
    await updateCard({ cardId: cardId as Id<"colab_cards">, title: newTitle, userId: user.id });
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
    setNewItemContents((prev) => ({ ...prev, [checklistId]: "" }));
  };

  const toggleLabel = async (labelId: Id<"colab_labels">) => {
    if (!card || !user) return;
    const currentLabels = card.labelIds || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter((id: string) => id !== labelId)
      : [...currentLabels, labelId];

    // @ts-ignore
    await updateCard({ cardId: cardId, labelIds: newLabels, userId: user.id });
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    // @ts-ignore
    await addLabel({ name: newLabelName, colorCode: newLabelColor, boardId });
    setNewLabelName("");
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!user) return;
    // @ts-ignore
    await updateCard({ cardId: cardId, dueDate: date ? date.getTime() : undefined, userId: user.id });
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Banner if exists (future) */}
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full overflow-hidden border-r">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>
                <Input
                  value={card.title}
                  onChange={(e) => handleUpdateTitle(e.target.value)} // Note: this will update on every keystroke which is bad. Ideally use onBlur.
                  onBlur={(e) => handleUpdateTitle(e.target.value)}
                  className="text-xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                />
              </DialogTitle>
              <div className="text-sm text-muted-foreground ml-1">
                dans la liste <span className="underline decoration-dotted">Current List</span>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6 pt-2">
              <div className="space-y-6">
                {/* Labels Display */}
                {(card.labelIds?.length || 0) > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">{KANBAN_STRINGS.labels}</h3>
                    <div className="flex flex-wrap gap-2">
                      {boardLabels
                        .filter((l) => card.labelIds?.includes(l._id))
                        .map((label) => (
                          <Badge
                            key={label._id}
                            style={{ backgroundColor: label.colorCode }}
                            className="hover:opacity-80 cursor-pointer text-white"
                          >
                            {label.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* Due Date Display */}
                {card.dueDate && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">{KANBAN_STRINGS.dueDate}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`flex gap-2 p-2 ${card.dueDate < Date.now() ? "border-red-500 text-red-500 bg-red-50" : ""}`}
                      >
                        <Clock className="h-4 w-4" />
                        {format(card.dueDate, "d MMMM yyyy", { locale: fr })}
                        {card.dueDate < Date.now() && <span className="text-xs font-bold ml-1">EN RETARD</span>}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">Description</h3>
                  {isEditingDesc ? (
                    <div className="space-y-2">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Ajouter une description plus détaillée..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveDescription}>
                          Enregistrer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingDesc(false)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: Interactive div is fine for this specific edit mode
                    <div
                      onClick={() => setIsEditingDesc(true)}
                      className="min-h-[60px] p-3 rounded-md bg-muted/20 hover:bg-muted/50 cursor-pointer transition-all text-sm whitespace-pre-wrap"
                    >
                      {card.description || (
                        <span className="text-muted-foreground italic">Ajouter une description...</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Checklists */}
                <div className="space-y-4">
                  {checklists?.map((list: any) => {
                    const progress = list.items?.length
                      ? Math.round((list.items.filter((i: any) => i.completed).length / list.items.length) * 100)
                      : 0;

                    return (
                      <div key={list._id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" /> {list.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-red-500"
                            onClick={() => deleteChecklist({ checklistId: list._id })}
                          >
                            Supprimer
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="w-8">{progress}%</span>
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          {list.items?.map((item: any) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-2 group hover:bg-muted/20 p-1 rounded -mx-1"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                // @ts-ignore
                                onChange={(e) => toggleItem({ itemId: item._id, completed: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 accent-primary"
                              />
                              <span
                                className={`flex-1 text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                              >
                                {item.content}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => deleteItem({ itemId: item._id })}
                              >
                                <span className="sr-only">Delete</span>
                                <span aria-hidden="true">×</span>
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="pl-6">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ajouter un élément..."
                              value={newItemContents[list._id] || ""}
                              onChange={(e) => setNewItemContents((prev) => ({ ...prev, [list._id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && handleAddItem(list._id)}
                              className="h-8 text-sm"
                            />
                            <Button size="sm" variant="secondary" onClick={() => handleAddItem(list._id)}>
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Activity Log */}
                <div className="space-y-4 pt-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4" /> {KANBAN_STRINGS.activity}
                  </h3>
                  <div className="space-y-3 pl-6">
                    {activities?.map((activity: any) => (
                      <div key={activity._id} className="text-sm">
                        <span className="font-semibold">Utilisateur</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                        <div className="text-xs text-muted-foreground">
                          {format(activity.createdAt, "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Sidebar */}
          <div className="w-60 bg-muted/10 p-4 space-y-6 border-l overflow-y-auto">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Ajouter à la carte</span>

              {/* Labels Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="w-full justify-start h-8">
                    <Tag className="h-4 w-4 mr-2" /> {KANBAN_STRINGS.labels}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Étiquettes</h4>
                    <div className="space-y-1">
                      {boardLabels.map((label) => (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: Button role
                        <div
                          key={label._id}
                          className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer"
                          onClick={() => toggleLabel(label._id)}
                        >
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: label.colorCode }} />
                          <span className="flex-1 text-sm">{label.name}</span>
                          {card.labelIds?.includes(label._id) && <span className="text-xs">✓</span>}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      <Input
                        placeholder="Nom..."
                        className="h-8 text-sm"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                      />
                      <div className="flex gap-1 justify-between">
                        {["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#EC4899"].map((color) => (
                          // biome-ignore lint/a11y/useKeyWithClickEvents: Color picker
                          <div
                            key={color}
                            className={`w-6 h-6 rounded-full cursor-pointer border-2 ${newLabelColor === color ? "border-black" : "border-transparent"}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewLabelColor(color)}
                          />
                        ))}
                      </div>
                      <Button size="sm" className="w-full" onClick={handleCreateLabel} disabled={!newLabelName}>
                        Créer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Checklist */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="w-full justify-start h-8">
                    <CheckSquare className="h-4 w-4 mr-2" /> Checklist
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ajouter une checklist</h4>
                    <Input
                      placeholder="Nom de la checklist..."
                      value={newChecklistName}
                      onChange={(e) => setNewChecklistName(e.target.value)}
                      className="h-8"
                      autoFocus
                    />
                    <Button size="sm" className="w-full" onClick={handleAddChecklist} disabled={!newChecklistName}>
                      Ajouter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Due Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="w-full justify-start h-8">
                    <Calendar className="h-4 w-4 mr-2" /> Dates
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {/* Simple Calendar placeholder since I need to verify if we have a Calendar component */}
                  <div className="p-4">
                    <input
                      type="date"
                      className="border rounded p-1 block w-full"
                      onChange={(e) => handleDateSelect(e.target.valueAsDate || undefined)}
                      value={card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-red-500"
                      onClick={() => handleDateSelect(undefined)}
                    >
                      Retirer
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
