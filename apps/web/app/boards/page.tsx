'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BoardsPage() {
  const boards = useQuery(api.kanban.getBoards, { workspaceId: "default" }); // TODO: Real workspace ID
  const createBoard = useMutation(api.kanban.createBoard);
  const [newBoardName, setNewBoardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!newBoardName) return;
    const boardId = await createBoard({
      name: newBoardName,
      workspaceId: "default",
      visibility: "workspace",
      createdBy: "user_temp",
    });
    setIsOpen(false);
    setNewBoardName("");
    router.push(`/boards/${boardId}`);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tableaux</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau tableau
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un tableau</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom du tableau</Label>
                <Input
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Ex: Projet Fusion X"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards?.map((board) => (
          <Link key={board._id} href={`/boards/${board._id}`}>
            <div
              className="group relative h-32 rounded-lg border bg-muted/20 hover:bg-muted/40 p-4 transition-all overflow-hidden"
              style={{
                backgroundImage: board.backgroundUrl ? `url(${board.backgroundUrl})` : undefined,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <h3 className="relative font-semibold text-lg text-foreground drop-shadow-sm">
                {board.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
