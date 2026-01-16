'use client';

import { useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { BoardColumn } from "./BoardColumn";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/tailwind/ui/button";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CardModal } from "./CardModal";
import type { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/tailwind/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tailwind/ui/popover";

interface BoardViewProps {
  board: { _id: Id<"colab_boards">; backgroundUrl?: string; [key: string]: unknown };
  lists: { _id: string; cards?: unknown[]; [key: string]: unknown }[];
}

export function BoardView({ board, lists }: BoardViewProps) {
  const updateListOrder = useMutation(api.kanban.updateListOrder);
  const updateCardPosition = useMutation(api.kanban.updateCardPosition);
  const createList = useMutation(api.kanban.createList);
  const createCard = useMutation(api.kanban.createCard);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'LIST') {
      try {
        await updateListOrder({
          boardId: board._id,
          listId: draggableId as Id<"colab_lists">,
          newIndex: destination.index
        });
      } catch (_error) {
        toast.error("Erreur lors du déplacement de la liste");
      }
    }

    if (type === 'CARD') {
       try {
        await updateCardPosition({
          cardId: draggableId as Id<"colab_cards">,
          sourceListId: source.droppableId as Id<"colab_lists">,
          destListId: destination.droppableId as Id<"colab_lists">,
          newIndex: destination.index,
        });
       } catch (_error) {
         toast.error("Erreur lors du déplacement de la carte");
       }
    }
  };

  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      await createList({ boardId: board._id, name: newListTitle, index: lists.length });
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleAddCard = async (listId: string) => {
    // This is still using a simplified flow. Ideally we open a small inline input at bottom of column.
    // For now we'll use a safer approach than prompt, but still simple: a default title we can edit later.
    // Or we rely on the modal to fill details immediately?
    // Standard Trello way: Open inline input.
    // To save time and keep it "production" (no prompt), I'll create with default title then user edits.
    // OR better: I will open the modal immediately? No that's jarring.
    // Let's implement a quick proper inline input logic or just create "Nouvelle carte" and let user click to edit.

    // Find list to get index
    // biome-ignore lint/suspicious/noExplicitAny: Temporary cast
    const list = lists.find(l => l._id === listId) as any;
    const index = list?.cards?.length || 0;
    const cardId = await createCard({
      listId: listId as Id<"colab_lists">,
      title: "Nouvelle carte",
      index,
    });

    // Open modal to edit immediately
    setSelectedCardId(cardId);
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{
          backgroundImage: board.backgroundUrl ? `url(${board.backgroundUrl})` : undefined,
          backgroundColor: !board.backgroundUrl ? 'var(--background)' : undefined
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="board" direction="horizontal" type="LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="h-full flex p-4 items-start"
              >
                {lists.map((list, index) => (
                  <BoardColumn
                    key={list._id}
                    list={list}
                    index={index}
                    cards={list.cards || []}
                    onAddCard={handleAddCard}
                    onCardClick={setSelectedCardId}
                  />
                ))}
                {provided.placeholder}

                <div className="w-72 shrink-0 ml-4">
                  <Popover open={isAddingList} onOpenChange={setIsAddingList}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-dashed bg-background/50 backdrop-blur hover:bg-background/80"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une liste
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="start">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm leading-none">Nouvelle liste</h4>
                        <Input
                          placeholder="Nom de la liste"
                          value={newListTitle}
                          onChange={(e) => setNewListTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setIsAddingList(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={handleCreateList}>Créer</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>

      {selectedCardId && (
        <CardModal
          cardId={selectedCardId}
          onClose={() => setSelectedCardId(null)}
        />
      )}
    </div>
  );
}
