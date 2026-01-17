"use client";

import { AISelector } from "@/components/tailwind/generative/ai-selector";
import { mentionCommand } from "@/components/tailwind/mention-command";
import { slashCommand } from "@/components/tailwind/slash-command";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Markdown } from "tiptap-markdown";
import { useDebounce } from "use-debounce";
import { CalloutExtension } from "./extensions/callout-extension";
import { KanbanExtension } from "./extensions/kanban-extension";

interface DocumentEditorProps {
  documentId: Id<"colab_documents">;
}

export const DocumentEditor = ({ documentId }: DocumentEditorProps) => {
  const document = useQuery(api.documents.get, { id: documentId });
  const updateDocument = useMutation(api.documents.update);

  const [content, setContent] = useState<string | undefined>(undefined);
  const [debouncedContent] = useDebounce(content, 1000);

  useEffect(() => {
    if (document && content === undefined) {
      setContent(document.content);
    }
  }, [document, content]);

  useEffect(() => {
    if (debouncedContent !== undefined && document) {
      updateDocument({
        id: documentId,
        content: debouncedContent,
      });
    }
  }, [debouncedContent, documentId, updateDocument, document]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Markdown,
      slashCommand,
      mentionCommand,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CalloutExtension,
      KanbanExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-none max-w-full min-h-[500px] p-4",
      },
    },
  });

  if (!editor || !document) return <div>Chargement...</div>;

  return (
    <div className="relative w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-background mt-8">
      <div className="absolute right-4 top-4 z-10">
        <AISelector editor={editor} open={false} onOpenChange={() => {}} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
