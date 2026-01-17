import { Button } from "@/components/tailwind/ui/button";
import type { Id } from "@/convex/_generated/dataModel";
import { MoreHorizontal, Plus } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { TaskCard } from "./TaskCard";

interface ListColumnProps {
  list: {
    _id: Id<"colab_lists">;
    name: string;
  };
  index: number;
  // biome-ignore lint/suspicious/noExplicitAny: Card type is complex
  cards: any[];
  onAddCard: (listId: string) => void;
  onCardClick: (cardId: string) => void;
  boardLabels: any[];
}

export function ListColumn({ list, index, cards, onAddCard, onCardClick, boardLabels }: ListColumnProps) {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided, _snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="w-80 flex-shrink-0 flex flex-col max-h-full bg-muted/20 rounded-lg border shadow-sm"
        >
          <div className="flex items-center justify-between p-3 border-b bg-muted/50 rounded-t-lg cursor-grab active:cursor-grabbing">
            <h3 className="font-semibold text-sm px-1">{list.name}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 p-2 overflow-y-auto min-h-[100px]">
            <StrictModeDroppable droppableId={list._id} type="CARD">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col gap-2 min-h-[10px] transition-colors rounded-md p-1 ${snapshot.isDraggingOver ? "bg-primary/5" : ""}`}
                >
                  {cards.map((card, index) => (
                    <TaskCard
                      key={card._id}
                      card={card}
                      index={index}
                      onClick={onCardClick}
                      boardLabels={boardLabels}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>

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
      )}
    </Draggable>
  );
}
