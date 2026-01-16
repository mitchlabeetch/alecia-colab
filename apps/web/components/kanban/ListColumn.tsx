import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/tailwind/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface ListColumnProps {
  list: {
    _id: Id<"colab_lists">;
    name: string;
  };
  // biome-ignore lint/suspicious/noExplicitAny: Card type is complex
  cards: any[];
  onAddCard: (listId: string) => void;
  onCardClick: (cardId: string) => void;
}

export function ListColumn({ list, cards, onAddCard, onCardClick }: ListColumnProps) {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col max-h-full">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-t-lg border-x border-t">
        <h3 className="font-semibold text-sm px-1">{list.name}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 bg-muted/30 border-x border-b rounded-b-lg p-2 overflow-y-auto">
        <Droppable droppableId={list._id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[10px] transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
            >
              {cards.map((card, index) => (
                <TaskCard
                  key={card._id}
                  card={card}
                  index={index}
                  onClick={onCardClick}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground mt-2 hover:bg-muted/50"
          onClick={() => onAddCard(list._id)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une carte
        </Button>
      </div>
    </div>
  );
}
