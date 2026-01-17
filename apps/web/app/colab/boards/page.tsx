"use client";

import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoardsListPage() {
  // Safe use of useUser with fallback for environments without Clerk
  let user: { id: string } | null | undefined = null;
  let isLoaded = true;

  try {
    const clerk = useUser();
    user = clerk.user;
    isLoaded = clerk.isLoaded;
  } catch (_e) {
    if (process.env.NODE_ENV === "development") {
      user = { id: "dev_user_mock" };
      isLoaded = true;
    }
  }

  const createBoard = useMutation(api.boards.createBoard);
  const router = useRouter();

  // @ts-ignore
  const boards = useQuery(api.boards.listBoards, isLoaded && user ? { userId: user.id } : "skip");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreateBoard = async () => {
    if (!user || !newBoardName.trim()) return;

    const boardId = await createBoard({
      name: newBoardName,
      visibility: "private",
      userId: user.id,
    });

    setNewBoardName("");
    setIsDialogOpen(false);
    router.push(`/colab/boards/${boardId}`);
  };

  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tableaux Kanban</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau tableau
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau tableau</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Nom du tableau..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boards?.map((board: { _id: string; name: string; createdAt: number }) => (
          <Card
            key={board._id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => router.push(`/colab/boards/${board._id}`)}
          >
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Créé le {new Date(board.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </CardContent>
          </Card>
        ))}

        {boards?.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            Aucun tableau pour le moment. Créez-en un pour commencer !
          </div>
        )}
      </div>
    </div>
  );
}
