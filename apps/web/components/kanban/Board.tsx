'use client';

import { useState } from 'react';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ListColumn } from './ListColumn';
import { Button } from '@/components/tailwind/ui/button';
import { Plus } from 'lucide-react';
import { CardModal } from './CardModal';
import { useUser } from '@clerk/nextjs';
import type { Id } from '@/convex/_generated/dataModel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/tailwind/ui/dialog';
import { Input } from '@/components/tailwind/ui/input';
import { StrictModeDroppable } from './StrictModeDroppable';

interface KanbanBoardProps {
  board: {
    _id: Id<"colab_boards">;
    name: string;
  };
  lists: {
    _id: Id<"colab_lists">;
    name: string;
    boardId: Id<"colab_boards">;
  }[];
  cards: {
    _id: Id<"colab_cards">;
    title: string;
    listId: Id<"colab_lists">;
    // Add other properties as defined in schema
  }[];
}

export function KanbanBoard({ board: _board, lists, cards }: KanbanBoardProps) {
  const { user } = useUser();
  const moveCard = useMutation(api.boards.moveCard);
  const createCard = useMutation(api.boards.createCard);

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (user) {
        // @ts-ignore
        await moveCard({
            // @ts-ignore
            cardId: draggableId,
            // @ts-ignore
            newListId: destination.droppableId,
            newOrder: destination.index,
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

    // @ts-ignore
    await createCard({
      title: newCardTitle,
      // @ts-ignore
      listId: targetListId,
      // @ts-ignore
      order: cards.filter(c => c.listId === targetListId).length,
      createdBy: user.id,
    });

    setIsCreateCardOpen(false);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
          {lists.map(list => (
            <ListColumn
              key={list._id}
              list={list}
              // @ts-ignore
              cards={cards.filter(c => c.listId === list._id)}
              onAddCard={openCreateCardDialog}
              onCardClick={setSelectedCardId}
            />
          ))}

          <div className="w-80 flex-shrink-0">
             <Button variant="outline" className="w-full h-12 border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une liste
             </Button>
          </div>
        </div>
      </DragDropContext>

      {/* Create Card Dialog */}
      <Dialog open={isCreateCardOpen} onOpenChange={setIsCreateCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle carte</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Titre de la carte..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCard()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCardOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateCard} disabled={!newCardTitle.trim()}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedCardId && (
        <CardModal
          cardId={selectedCardId}
          open={!!selectedCardId}
          onClose={() => setSelectedCardId(null)}
        />
      )}
    </>
  );
}
