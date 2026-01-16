import { Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { Calendar, MessageSquare } from "lucide-react";

interface BoardCardProps {
  card: {
    _id: string;
    title: string;
    labelIds?: string[];
    dueDate?: number;
    dueDateCompleted?: boolean;
    [key: string]: unknown;
  };
  index: number;
  onClick: () => void;
}

export function BoardCard({ card, index, onClick }: BoardCardProps) {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={cn(
            "bg-card p-3 rounded-lg border shadow-sm group hover:border-primary/50 transition-colors mb-2 cursor-pointer",
            snapshot.isDragging && "shadow-lg rotate-2"
          )}
        >
          {/* Labels (Placeholder for now) */}
          {card.labelIds?.length > 0 && (
            <div className="flex gap-1 mb-2">
              <div className="h-1.5 w-8 rounded-full bg-blue-500" />
            </div>
          )}

          <h4 className="font-medium text-sm text-card-foreground line-clamp-2">
            {card.title}
          </h4>

          <div className="mt-2 flex items-center gap-3 text-muted-foreground">
            {card.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-[10px]",
                card.dueDate < Date.now() && !card.dueDateCompleted ? "text-destructive" : ""
              )}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(card.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            {/* Icons for attachments/checklists/comments if they exist */}
            <div className="flex items-center gap-1 text-[10px]">
              <MessageSquare className="w-3 h-3" />
              <span>0</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
