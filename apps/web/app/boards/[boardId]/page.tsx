'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BoardView } from "@/components/kanban/BoardView";
import type { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import React from 'react';

// Next.js 15 App Router dynamic page props type
type PageProps = {
  params: Promise<{ boardId: string }>;
};

export default function BoardPage({ params }: PageProps) {
  // Unwrap params using React.use() or await (since it's a promise in newer Next.js versions)
  // However, in client component we can use React.use() hook or standard async handling if parent is async
  // But here this is a client component ('use client').
  // Next.js 15: params is a Promise.

  const { boardId } = React.use(params);

  const board = useQuery(api.kanban.getBoard, { boardId: boardId as Id<"colab_boards"> });
  const lists = useQuery(api.kanban.getBoardData, { boardId: boardId as Id<"colab_boards"> });

  if (!board || !lists) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 border-b flex items-center px-4 bg-background/50 backdrop-blur z-10 sticky top-0">
        <h1 className="font-semibold text-lg">{board.name}</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <BoardView board={board} lists={lists} />
      </div>
    </div>
  );
}
