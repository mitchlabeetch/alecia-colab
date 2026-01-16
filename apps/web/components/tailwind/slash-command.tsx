import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Youtube,
  Briefcase,
  Calculator,
  ClipboardCheck,
  TrendingUp,
  Building,
  Users,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "novel";
import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
  // M&A Templates Section
  {
    title: "Deal Summary Template",
    description: "Comprehensive deal overview and tracking template.",
    searchTerms: ["deal", "summary", "overview", "m&a", "acquisition"],
    icon: <Briefcase size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Deal Summary" }] },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Target Company: " },
              { type: "text", text: "[Company Name]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Deal Stage: " },
              { type: "text", text: "[Sourcing / Due Diligence / Negotiation / Closing]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Deal Lead: " },
              { type: "text", text: "[Name]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Valuation: " },
              { type: "text", text: "[Amount]" },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Strategic Rationale" }] },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Market expansion opportunities" }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Technology and IP acquisition" }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Synergies and cost optimization" }] }],
              },
            ],
          },
        ])
        .run();
    },
  },
  {
    title: "Due Diligence Checklist",
    description: "Comprehensive DD checklist for M&A transactions.",
    searchTerms: ["due diligence", "dd", "checklist", "review"],
    icon: <ClipboardCheck size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Due Diligence Checklist" }] },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Financial Due Diligence" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Review financial statements (3-5 years)" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Analyze revenue trends and customer concentration" }],
                  },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Evaluate debt structure and obligations" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Review working capital requirements" }] },
                ],
              },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Legal Due Diligence" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Corporate structure and governance" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [{ type: "paragraph", content: [{ type: "text", text: "Material contracts review" }] }],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [{ type: "paragraph", content: [{ type: "text", text: "Intellectual property assessment" }] }],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Litigation and regulatory compliance" }] },
                ],
              },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Operational Due Diligence" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Operations and supply chain review" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Technology infrastructure assessment" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Human resources and culture evaluation" }] },
                ],
              },
            ],
          },
        ])
        .run();
    },
  },
  {
    title: "Valuation Model",
    description: "Financial valuation framework and analysis.",
    searchTerms: ["valuation", "dcf", "model", "financial", "analysis"],
    icon: <Calculator size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Valuation Analysis" }] },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Company: " },
              { type: "text", text: "[Target Company Name]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Valuation Date: " },
              { type: "text", text: "[Date]" },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Valuation Methodologies" }] },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "DCF Analysis: " },
                      { type: "text", text: "$[Amount]" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Comparable Companies: " },
                      { type: "text", text: "$[Amount]" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", marks: [{ type: "bold" }], text: "Precedent Transactions: " },
                      { type: "text", text: "$[Amount]" },
                    ],
                  },
                ],
              },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Key Assumptions" }] },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Revenue growth rate: [X]%" }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "EBITDA margin: [X]%" }] }],
              },
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "WACC: [X]%" }] }] },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Terminal growth rate: [X]%" }] }],
              },
            ],
          },
        ])
        .run();
    },
  },
  {
    title: "Integration Plan",
    description: "Post-merger integration roadmap and checklist.",
    searchTerms: ["integration", "pmi", "post-merger", "synergies"],
    icon: <TrendingUp size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Integration Plan" }] },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Day 1 Priorities" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Communication to employees and stakeholders" }],
                  },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Establish integration management office (IMO)" }],
                  },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [{ type: "paragraph", content: [{ type: "text", text: "IT systems access and security" }] }],
              },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "First 100 Days" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Organizational structure alignment" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [{ type: "paragraph", content: [{ type: "text", text: "Systems and process integration" }] }],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "Quick wins and synergy realization" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [{ type: "paragraph", content: [{ type: "text", text: "Culture integration initiatives" }] }],
              },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Expected Synergies" }] },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Cost synergies: $[Amount]" }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Revenue synergies: $[Amount]" }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Timeline to achieve: [X] months" }] }],
              },
            ],
          },
        ])
        .run();
    },
  },
  {
    title: "Company Profile",
    description: "Target company overview and analysis.",
    searchTerms: ["company", "profile", "target", "overview"],
    icon: <Building size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Company Profile" }] },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Company Name: " },
              { type: "text", text: "[Name]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Industry: " },
              { type: "text", text: "[Industry]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Location: " },
              { type: "text", text: "[Location]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Revenue: " },
              { type: "text", text: "$[Amount]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Employees: " },
              { type: "text", text: "[Number]" },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Business Overview" }] },
          {
            type: "paragraph",
            content: [
              { type: "text", text: "[Brief description of the business, products/services, and market position]" },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Key Strengths" }] },
          {
            type: "bulletList",
            content: [
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "[Strength 1]" }] }] },
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "[Strength 2]" }] }] },
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "[Strength 3]" }] }] },
            ],
          },
        ])
        .run();
    },
  },
  {
    title: "Meeting Notes",
    description: "Template for M&A meeting notes and action items.",
    searchTerms: ["meeting", "notes", "minutes", "discussion"],
    icon: <Users size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent([
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Meeting Notes" }] },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Date: " },
              { type: "text", text: "[Date]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Attendees: " },
              { type: "text", text: "[Names]" },
            ],
          },
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Topic: " },
              { type: "text", text: "[Subject]" },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Discussion Points" }] },
          {
            type: "bulletList",
            content: [
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "[Point 1]" }] }] },
              { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "[Point 2]" }] }] },
            ],
          },
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Action Items" }] },
          {
            type: "taskList",
            content: [
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "[Action 1] - [Owner] - [Due Date]" }] },
                ],
              },
              {
                type: "taskItem",
                attrs: { checked: false },
                content: [
                  { type: "paragraph", content: [{ type: "text", text: "[Action 2] - [Owner] - [Due Date]" }] },
                ],
              },
            ],
          },
        ])
        .run();
    },
  },
  // Standard Formatting Options
  {
    title: "Text",
    description: "Start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "Task List",
    description: "Track tasks with a checklist.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
  {
    title: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter the Youtube video link");
      //From https://regexr.com/3dj5t
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a valid Youtube link");
        }
      }
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
