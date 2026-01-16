'use client';

import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { SlashCommand } from './slash-command';
import { Suggestion } from './suggestion';

// Extended Block Types as requested
const extensions = [
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
  // Slash Command would be a custom extension handling the "/" trigger
];

export const AdvancedEditor = () => {
  const [_content, setContent] = useState('');

  const editor = useEditor({
    extensions,
    content: '<p>Commencez à écrire ou tapez "/" pour les commandes...</p>',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert focus:outline-none max-w-full min-h-[500px] p-4',
        }
    }
  });

  if (!editor) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-background">
      <EditorContent editor={editor} />
      {/*
         Here we would mount the Slash Command menu if triggered.
         For this batch, we are setting up the structure.
      */}
    </div>
  );
};
