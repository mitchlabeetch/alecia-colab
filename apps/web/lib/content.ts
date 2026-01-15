export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Welcome to Alecia Colab" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Your comprehensive M&A knowledge base and collaboration platform. Streamline deal workflows, due diligence, and integration planning.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Quick Start Guide" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Use the ",
        },
        { type: "text", marks: [{ type: "code" }], text: "/" },
        {
          type: "text",
          text: " command to access templates and formatting options. Type ",
        },
        { type: "text", marks: [{ type: "code" }], text: "++" },
        {
          type: "text",
          text: " to activate AI-powered suggestions.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "M&A Templates" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Access specialized templates for your M&A workflow:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Deal Pipeline",
                },
                {
                  type: "text",
                  text: " - Track opportunities from sourcing to closing",
                },
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
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Due Diligence Checklist",
                },
                {
                  type: "text",
                  text: " - Comprehensive DD frameworks and questionnaires",
                },
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
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Valuation Models",
                },
                {
                  type: "text",
                  text: " - Financial modeling and analysis templates",
                },
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
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "Integration Planning",
                },
                {
                  type: "text",
                  text: " - Post-merger integration checklists and timelines",
                },
              ],
            },
          ],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Key Features" }],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Rich text editing with slash commands and bubble menu",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "AI-powered content suggestions and autocompletion",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Image uploads via drag & drop or copy & paste",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Mathematical formulas and LaTeX support for financial models",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Document versioning and collaboration features (coming soon)",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Example: Deal Summary Template" }],
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "Target Company: [Company Name]" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Deal Stage:",
        },
        { type: "text", text: " [Sourcing / Due Diligence / Negotiation / Closing]" },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Deal Lead:",
        },
        { type: "text", text: " [Name]" },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Valuation:",
        },
        { type: "text", text: " [Amount]" },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Strategic Rationale:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "• Market expansion opportunities",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "• Technology and IP acquisition",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "• Synergies and cost optimization",
        },
      ],
    },
  ],
};
