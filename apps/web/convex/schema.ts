import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Alecia Colab Schema
 * 
 * IMPORTANT: All tables are prefixed with "colab_" to avoid conflicts
 * with existing Alecia Panel tables in the shared Convex database.
 */
export default defineSchema({
  // Documents for the Notion-like editor
  colab_documents: defineTable({
    title: v.string(),
    content: v.string(), // JSON stringified editor content
    markdown: v.optional(v.string()),
    userId: v.optional(v.string()), // Clerk user ID
    dealId: v.optional(v.id("colab_deals")), // Optional link to a deal
    createdAt: v.number(),
    updatedAt: v.number(),
    isArchived: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_deal", ["dealId"])
    .index("by_updated", ["updatedAt"]),

  // Document version history (Sprint 3)
  colab_document_versions: defineTable({
    documentId: v.id("colab_documents"),
    content: v.string(),
    markdown: v.optional(v.string()),
    versionNumber: v.number(),
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    changeDescription: v.optional(v.string()),
  })
    .index("by_document", ["documentId"])
    .index("by_version", ["documentId", "versionNumber"]),

  // M&A Deals for the Deal Pipeline
  colab_deals: defineTable({
    company: v.string(),
    stage: v.union(
      v.literal("sourcing"),
      v.literal("due-diligence"),
      v.literal("negotiation"),
      v.literal("closing"),
      v.literal("closed-won"),
      v.literal("closed-lost")
    ),
    valuation: v.optional(v.string()),
    lead: v.optional(v.string()),
    description: v.optional(v.string()),
    userId: v.optional(v.string()), // Created by
    createdAt: v.number(),
    updatedAt: v.number(),
    isArchived: v.optional(v.boolean()),
    // Sprint 1: Multi-view support
    dueDate: v.optional(v.number()), // Timestamp for calendar view
    priority: v.optional(v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    )),
    tags: v.optional(v.array(v.string())),
    // Sprint 2: Deal flow visualization
    nodePosition: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    // Sprint 4: Custom properties (key = property ID, value = property value)
    customProperties: v.optional(v.any()),
  })
    .index("by_stage", ["stage"])
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"])
    .index("by_due_date", ["dueDate"]),

  // Sprint 4: Custom property definitions
  colab_property_definitions: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("number"),
      v.literal("date"),
      v.literal("select"),
      v.literal("multiselect"),
      v.literal("checkbox")
    ),
    options: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      color: v.string(),
    }))),
    order: v.number(),
  })
    .index("by_order", ["order"]),

  // Sprint 5: Presence for real-time collaboration
  colab_presence: defineTable({
    resourceType: v.union(v.literal("document"), v.literal("deal")),
    resourceId: v.string(),
    userId: v.string(),
    userName: v.optional(v.string()),
    userColor: v.optional(v.string()),
    cursorPosition: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    lastActiveAt: v.number(),
  })
    .index("by_resource", ["resourceType", "resourceId"])
    .index("by_resource_user", ["resourceType", "resourceId", "userId"]),

  // Batch 12: Presentations
  colab_presentations: defineTable({
    title: v.string(),
    userId: v.string(),
    workspaceId: v.optional(v.string()),
    theme: v.string(),
    language: v.string(), // 'fr-FR' default
    slides: v.array(v.object({
      id: v.string(),
      title: v.string(),
      content: v.any(), // Block content
      rootImage: v.optional(v.object({
        url: v.string(),
        query: v.string(),
      })),
    })),
    status: v.union(v.literal('draft'), v.literal('generating'), v.literal('complete')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_updated", ["updatedAt"]),
});
