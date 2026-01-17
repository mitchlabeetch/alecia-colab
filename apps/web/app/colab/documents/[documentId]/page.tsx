"use client";

import { DocumentEditor } from "@/components/editor/DocumentEditor";
import type { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default function DocumentPage({ params }: PageProps) {
  const { documentId } = React.use(params);
  return <DocumentEditor documentId={documentId as Id<"colab_documents">} />;
}
