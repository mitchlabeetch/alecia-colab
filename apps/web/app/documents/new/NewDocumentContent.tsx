"use client";

import { TemplateSelector } from "@/components/templates/TemplateSelector";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Prevent static generation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function NewDocumentPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const createDocument = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (content: string, title = "Sans titre") => {
    if (!user || isCreating) return;

    setIsCreating(true);
    try {
      const docId = await createDocument({
        title,
        content,
        userId: user.id,
      });
      router.replace(`/documents/${docId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <TemplateSelector onSelect={handleCreate} isCreating={isCreating} />;
}
