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
  })
    .index("by_stage", ["stage"])
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),
});
