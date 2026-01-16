import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { BoardCard } from "./BoardCard";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";

interface BoardColumnProps {
  list: { _id: string; name: string; [key: string]: unknown };
  index: number;
  cards: unknown[];
  onAddCard: (listId: string) => void;
  onCardClick: (cardId: string) => void;
}

export function BoardColumn({ list, index, cards, onAddCard, onCardClick }: BoardColumnProps) {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided, _snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-72 shrink-0 h-full max-h-full flex flex-col bg-muted/50 rounded-xl border ml-4 first:ml-0"
        >
          {/* Header */}
          <div
            {...provided.dragHandleProps}
            className="p-3 flex items-center justify-between font-semibold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="truncate">{list.name}</span>
              <span className="text-muted-foreground text-xs font-normal">
                {cards.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Cards Area */}
          <StrictModeDroppable droppableId={list._id} type="CARD">
            {(provided, _snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 px-2 pb-2 overflow-y-auto min-h-[100px]"
              >
                {/* biome-ignore lint/suspicious/noExplicitAny: Card type is complex and evolving */}
                {cards.map((card: any, index) => (
                  <BoardCard
                    key={card._id}
                    card={card}
                    index={index}
                    onClick={() => onCardClick(card._id)}
                  />
                ))}
                {provided.placeholder}

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground text-sm h-9 hover:bg-background/50 hover:text-foreground"
                  onClick={() => onAddCard(list._id)}
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Ajouter une carte
                </Button>
              </div>
            )}
          </StrictModeDroppable>
        </div>
      )}
    </Draggable>
  );
}
