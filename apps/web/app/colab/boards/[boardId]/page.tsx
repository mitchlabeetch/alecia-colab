'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { KanbanBoard } from '@/components/kanban/Board';
import type { Id } from '@/convex/_generated/dataModel';

interface PageProps {
  params: {
    boardId: string;
  };
}

export default function SingleBoardPage({ params }: PageProps) {
  // @ts-ignore
  const boardData = useQuery(api.boards.getBoard, { boardId: params.boardId as Id<"colab_boards"> });

  if (!boardData) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b px-6 py-3 bg-background flex items-center justify-between">
        <h1 className="text-xl font-bold">{boardData.name}</h1>
        {/* Filters and options here */}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-muted/20">
        <KanbanBoard
            board={boardData}
            lists={boardData.lists}
            cards={boardData.cards}
        />
      </div>
    </div>
  );
}
