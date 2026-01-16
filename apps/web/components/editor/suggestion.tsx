// import { ReactRenderer } from '@tiptap/react';

export const Suggestion = {
  items: ({ query }) => {
    return [
      { title: 'Titre 1', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run() },
      { title: 'Titre 2', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run() },
      { title: 'Liste à puces', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
      { title: 'Liste numérotée', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
      { title: 'Encadré', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setBlockquote().run() }, // Placeholder for Callout
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
  },

  render: () => {
    // let _component;
    // let _popup;

    return {
      onStart: _props => {
        // We would create a React component here to render the menu
        // component = new ReactRenderer(CommandList, { props, editor: props.editor });
        // popup = tippy('body', { ... });
      },
      onUpdate(_props) {
        // component.updateProps(props);
      },
      onKeyDown(_props) {
        // if (props.event.key === 'Escape') { popup.hide(); return true; }
        // return component.ref?.onKeyDown(props);
      },
      onExit() {
        // popup.destroy();
        // component.destroy();
      },
    };
  },
};
