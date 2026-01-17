"use client";
import { defaultEditorContent } from "@/lib/content";
import { useMutation } from "convex/react";
import { History, Save } from "lucide-react";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "../../convex/_generated/api";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";

import type { Id } from "../../convex/_generated/dataModel";
import { usePresence } from "../../hooks/use-presence";
import { PresenceIndicator } from "../presence/PresenceAvatars";
import { VersionHistorySidebar } from "../version-history/VersionHistorySidebar";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

// Document ID placeholder - in production, this would come from route params
const DOCUMENT_ID = "demo-document-v1";

const TailwindAdvancedEditor = () => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Enregistré");
  const [charsCount, setCharsCount] = useState<number>();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [lastVersionSaved, setLastVersionSaved] = useState<number>(0);
  const editorRef = useRef<EditorInstance | null>(null);

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  // Presence tracking
  const { otherUsers } = usePresence({
    resourceType: "document",
    resourceId: DOCUMENT_ID,
    enabled: true,
  });

  // Convex mutations (only if configured)
  const isConvexConfigured = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  const saveVersionMutation = useMutation(api.documentVersions.saveVersion);

  // Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  // Save version to Convex (debounced - every 5 minutes or manual)
  const saveVersion = useCallback(
    async (editor: EditorInstance, isManual = false) => {
      if (!isConvexConfigured) return;

      const now = Date.now();
      // Auto-save version every 5 minutes or on manual save
      if (!isManual && now - lastVersionSaved < 5 * 60 * 1000) return;

      try {
        const _json = editor.getJSON();
        const _markdown = editor.storage.markdown?.getMarkdown() || "";

        // Note: In production, use actual document ID from route
        // For now, this is a placeholder that won't work until you have real document IDs
        // await saveVersionMutation({
        //   documentId: documentId as Id<"colab_documents">,
        //   content: JSON.stringify(json),
        //   markdown,
        //   changeDescription: isManual ? "Sauvegarde manuelle" : "Sauvegarde automatique",
        // });

        setLastVersionSaved(now);
        console.log("Version sauvegardée:", isManual ? "manuelle" : "auto");
      } catch (error) {
        console.error("Erreur sauvegarde version:", error);
      }
    },
    [isConvexConfigured, lastVersionSaved, saveVersionMutation],
  );

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());
    window.localStorage.setItem("html-content", highlightCodeblocks(editor.getHTML()));
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
    window.localStorage.setItem("alecia-last-saved", new Date().toISOString());
    setSaveStatus("Enregistré");

    // Try to save version periodically
    saveVersion(editor, false);
  }, 500);

  // Handle preview version from sidebar
  const handlePreviewVersion = useCallback((content: string) => {
    try {
      const parsed = JSON.parse(content);
      // Show in a preview mode (could open a modal or side-by-side view)
      console.log("Preview version:", parsed);
    } catch (error) {
      console.error("Error previewing version:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const content = window.localStorage.getItem("novel-content");
      if (content) {
        setInitialContent(JSON.parse(content));
      } else {
        setInitialContent(defaultEditorContent);
      }
    } catch (error) {
      console.error("Error loading editor content:", error);
      setInitialContent(defaultEditorContent);
    }
  }, []);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg">
      {/* Header avec status, présence et historique */}
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2 items-center">
        {/* Indicateur de présence */}
        {otherUsers.length > 0 && <PresenceIndicator users={otherUsers} />}

        {/* Bouton Historique */}
        <button
          onClick={() => setShowVersionHistory(!showVersionHistory)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors ${
            showVersionHistory
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
          title="Historique des versions"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Historique</span>
        </button>

        {/* Status de sauvegarde */}
        <div
          className={`rounded-lg px-2 py-1 text-sm flex items-center gap-1.5 ${
            saveStatus === "Enregistré"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
          }`}
        >
          <Save className="h-3 w-3" />
          {saveStatus}
        </div>

        {/* Compteur de mots */}
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
          {charsCount} mots
        </div>
      </div>

      {/* Sidebar historique */}
      {showVersionHistory && (
        <div className="absolute right-0 top-16 z-20 w-80">
          <VersionHistorySidebar
            documentId={DOCUMENT_ID as unknown as Id<"colab_documents">}
            isOpen={showVersionHistory}
            onClose={() => setShowVersionHistory(false)}
            onPreviewVersion={handlePreviewVersion}
          />
        </div>
      )}

      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            editorRef.current = editor;
            debouncedUpdates(editor);
            setSaveStatus("Non enregistré");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">Aucun résultat</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
