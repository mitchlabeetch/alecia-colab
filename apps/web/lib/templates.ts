import type { JSONContent } from "novel";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "deal" | "company" | "due-diligence" | "valuation" | "integration" | "general";
  content: JSONContent;
}

export const templates: Template[] = [
  {
    id: "deal-summary",
    name: "Deal Summary",
    description: "Comprehensive deal overview and tracking",
    category: "deal",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Deal Summary" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Target Company: " }, { type: "text", text: "[Company Name]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Deal Stage: " }, { type: "text", text: "[Sourcing / Due Diligence / Negotiation / Closing]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Deal Lead: " }, { type: "text", text: "[Name]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Valuation: " }, { type: "text", text: "[Amount]" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Strategic Rationale" }] },
        { type: "bulletList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Market expansion opportunities" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Technology and IP acquisition" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Synergies and cost optimization" }] }] },
        ]},
      ],
    },
  },
  {
    id: "company-profile",
    name: "Company Profile",
    description: "Target company analysis and overview",
    category: "company",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Company Profile" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Company Name: " }, { type: "text", text: "[Name]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Industry: " }, { type: "text", text: "[Industry]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Location: " }, { type: "text", text: "[Location]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Revenue: " }, { type: "text", text: "$[Amount]" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Employees: " }, { type: "text", text: "[Number]" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Business Overview" }] },
        { type: "paragraph", content: [{ type: "text", text: "[Brief description]" }] },
      ],
    },
  },
  {
    id: "due-diligence",
    name: "Due Diligence Checklist",
    description: "Comprehensive DD framework",
    category: "due-diligence",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Due Diligence Checklist" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Financial Due Diligence" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Review financial statements (3-5 years)" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Analyze revenue trends" }] }] },
        ]},
      ],
    },
  },
  {
    id: "valuation",
    name: "Valuation Analysis",
    description: "Financial valuation model",
    category: "valuation",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Valuation Analysis" }] },
        { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Company: " }, { type: "text", text: "[Name]" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Valuation Methodologies" }] },
        { type: "orderedList", content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "DCF Analysis" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Comparable Companies" }] }] },
        ]},
      ],
    },
  },
  {
    id: "integration-plan",
    name: "Integration Plan",
    description: "Post-merger integration roadmap",
    category: "integration",
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Integration Plan" }] },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Day 1 Priorities" }] },
        { type: "taskList", content: [
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Communication to stakeholders" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Establish integration management office" }] }] },
        ]},
      ],
    },
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: Template["category"]): Template[] {
  return templates.filter(t => t.category === category);
}
