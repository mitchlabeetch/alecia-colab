"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

// Check if Convex is available
const isConvexAvailable = () => {
  return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_CONVEX_URL;
};

/**
 * Hook for managing documents with Convex backend
 * Falls back to localStorage if Convex is not configured
 */
export function useDocuments(userId?: string) {
  const documents = useQuery(
    api.documents.list,
    isConvexAvailable() ? { userId } : "skip"
  );

  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.update);
  const archiveDocument = useMutation(api.documents.archive);

  return {
    documents: documents ?? [],
    isLoading: documents === undefined,
    createDocument,
    updateDocument,
    archiveDocument,
    isConvexAvailable: isConvexAvailable(),
  };
}

/**
 * Hook for managing a single document
 */
export function useDocument(documentId?: Id<"colab_documents">) {
  const document = useQuery(
    api.documents.get,
    documentId ? { id: documentId } : "skip"
  );

  const updateDocument = useMutation(api.documents.update);

  const saveContent = async (content: string, markdown?: string, title?: string) => {
    if (!documentId) return;
    
    await updateDocument({
      id: documentId,
      content,
      markdown,
      title,
    });
  };

  return {
    document,
    isLoading: document === undefined,
    saveContent,
  };
}

/**
 * Hook for managing deals with Convex backend
 */
export function useDeals(userId?: string) {
  const deals = useQuery(
    api.deals.list,
    isConvexAvailable() ? { userId } : "skip"
  );

  const dealsByStage = useQuery(
    api.deals.getByStage,
    isConvexAvailable() ? {} : "skip"
  );

  const createDeal = useMutation(api.deals.create);
  const updateDeal = useMutation(api.deals.update);
  const moveDealStage = useMutation(api.deals.moveStage);
  const archiveDeal = useMutation(api.deals.archive);

  return {
    deals: deals ?? [],
    dealsByStage: dealsByStage ?? null,
    isLoading: deals === undefined,
    createDeal,
    updateDeal,
    moveDealStage,
    archiveDeal,
    isConvexAvailable: isConvexAvailable(),
  };
}

/**
 * Hook for a single deal
 */
export function useDeal(dealId?: Id<"colab_deals">) {
  const deal = useQuery(
    api.deals.get,
    dealId ? { id: dealId } : "skip"
  );

  const updateDeal = useMutation(api.deals.update);
  const moveDealStage = useMutation(api.deals.moveStage);

  return {
    deal,
    isLoading: deal === undefined,
    updateDeal,
    moveDealStage,
  };
}
