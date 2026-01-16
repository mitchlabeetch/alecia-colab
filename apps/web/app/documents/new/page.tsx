"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function NewDocumentPage() {
  const router = useRouter();
  const isClerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const { user, isLoaded } = isClerkEnabled ? useUser() : { user: null, isLoaded: true };
  const createDocument = useMutation(api.documents.create);

  useEffect(() => {
    if (!isLoaded) return;
    
    const create = async () => {
      try {
        const docId = await createDocument({
          title: "",
          content: "",
          userId: user?.id || "anonymous",
        });
        router.replace(`/documents/${docId}`);
      } catch (error) {
        console.error("Failed to create document:", error);
        router.replace("/documents");
      }
    };

    create();
  }, [isLoaded, user, createDocument, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Création du document...</p>
      </div>
    </div>
  );
}
