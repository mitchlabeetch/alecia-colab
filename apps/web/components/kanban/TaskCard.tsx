import { Card, CardContent } from "@/components/tailwind/ui/card";
import type { Id } from "@/convex/_generated/dataModel";
import { AlignLeft, Calendar } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

interface TaskCardProps {
  card: {
    _id: Id<"colab_cards">;
    title: string;
    description?: string;
    dueDate?: number;
    labelIds?: Id<"colab_labels">[];
    // Add other fields as needed
  };
  index: number;
  onClick: (cardId: string) => void;
  boardLabels: any[];
}

export function TaskCard({ card, index, onClick, boardLabels }: TaskCardProps) {
  const cardLabels = boardLabels.filter((l) => card.labelIds?.includes(l._id));

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={() => onClick(card._id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick(card._id);
            }
          }}
        >
          <Card
            className={`hover:border-primary/50 transition-colors cursor-pointer ${snapshot.isDragging ? "shadow-lg rotate-2" : ""}`}
          >
            <CardContent className="p-3 space-y-2">
              {cardLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {cardLabels.map((label) => (
                    <span
                      key={label._id}
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: label.colorCode }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm font-medium leading-none">{card.title}</div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {card.dueDate && (
                  <div
                    className={`flex items-center gap-1 ${card.dueDate < Date.now() ? "text-red-500 font-bold" : ""}`}
                  >
                    <Calendar className="h-3 w-3" />
                    {new Date(card.dueDate).toLocaleDateString("fr-FR")}
                  </div>
                )}
                {card.description && <AlignLeft className="h-3 w-3" />}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
