"use client";

import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { CardModal } from "./CardModal";
import { ListColumn } from "./ListColumn";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface KanbanBoardProps {
  board: {
    _id: Id<"colab_boards">;
    name: string;
    labels?: { _id: Id<"colab_labels">; name: string; colorCode: string }[];
  };
  lists: {
    _id: Id<"colab_lists">;
    name: string;
    boardId: Id<"colab_boards">;
    index: number;
  }[];
  cards: {
    _id: Id<"colab_cards">;
    title: string;
    listId: Id<"colab_lists">;
    index: number;
    labelIds?: Id<"colab_labels">[];
    dueDate?: number;
    description?: string;
    assigneeIds?: string[];
    // Add other properties as defined in schema
  }[];
  filters?: {
    labelId?: string;
    memberId?: string;
    dueDate?: Date;
  };
}

export function KanbanBoard({ board, lists, cards, filters }: KanbanBoardProps) {
  const { user } = useUser();
  const moveCard = useMutation(api.boards.moveCard);
  const createCard = useMutation(api.boards.createCard);
  const reorderList = useMutation(api.boards.reorderList);
  const createList = useMutation(api.boards.createList);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");

  const filteredCards = cards.filter((card) => {
    if (filters?.labelId && !card.labelIds?.includes(filters.labelId as Id<"colab_labels">)) return false;
    if (filters?.memberId && !card.assigneeIds?.includes(filters.memberId)) return false;
    // Basic due date filter: if filter is set, show cards due on or before that date? Or exact?
    // Implementing "Due before or on"
    if (filters?.dueDate && card.dueDate) {
      if (card.dueDate > filters.dueDate.getTime()) return false;
    } else if (filters?.dueDate && !card.dueDate) {
      return false;
    }
    return true;
  });

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === "LIST") {
      if (user) {
        await reorderList({
          listId: draggableId as Id<"colab_lists">,
          newIndex: destination.index,
        });
      }
      return;
    }

    if (user) {
      await moveCard({
        cardId: draggableId as Id<"colab_cards">,
        newListId: destination.droppableId as Id<"colab_lists">,
        newIndex: destination.index,
        userId: user.id,
      });
    }
  };

  const openCreateCardDialog = (listId: string) => {
    setTargetListId(listId);
    setNewCardTitle("");
    setIsCreateCardOpen(true);
  };

  const handleCreateCard = async () => {
    if (!user || !targetListId || !newCardTitle.trim()) return;

    await createCard({
      title: newCardTitle,
      listId: targetListId as Id<"colab_lists">,
      index: cards.filter((c) => c.listId === targetListId).length,
      createdBy: user.id,
    });

    setIsCreateCardOpen(false);
  };

  const handleCreateList = async () => {
    if (!user || !newListTitle.trim()) return;
    await createList({
      name: newListTitle,
      boardId: board._id,
      index: lists.length,
    });
    setIsCreateListOpen(false);
    setNewListTitle("");
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="board" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex h-full gap-6 overflow-x-auto pb-4 items-start"
            >
              {lists.map((list, index) => (
                <ListColumn
                  key={list._id}
                  list={list}
                  index={index}
                  cards={filteredCards.filter((c) => c.listId === list._id)}
                  onAddCard={openCreateCardDialog}
                  onCardClick={setSelectedCardId}
                  boardLabels={board.labels || []}
                />
              ))}
              {provided.placeholder}

              <div className="w-80 flex-shrink-0">
                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed"
                  onClick={() => setIsCreateListOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une liste
                </Button>
              </div>
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      {/* Create Card Dialog */}
      <Dialog open={isCreateCardOpen} onOpenChange={setIsCreateCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une carte</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Titre de la carte..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCard()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCardOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateCard} disabled={!newCardTitle.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create List Dialog */}
      <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une liste</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom de la liste..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedCardId && (
        <CardModal
          cardId={selectedCardId}
          open={!!selectedCardId}
          onClose={() => setSelectedCardId(null)}
          boardLabels={board.labels || []}
          boardId={board._id}
        />
      )}
    </>
  );
}
