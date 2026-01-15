import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all documents for a user
export const list = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("colab_documents")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("colab_documents").order("desc").take(50);
  },
});

// Get a single document by ID
export const get = query({
  args: { id: v.id("colab_documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get documents for a specific deal
export const getByDeal = query({
  args: { dealId: v.id("colab_deals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colab_documents")
      .withIndex("by_deal", (q) => q.eq("dealId", args.dealId))
      .collect();
  },
});

// Create a new document
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    markdown: v.optional(v.string()),
    userId: v.optional(v.string()),
    dealId: v.optional(v.id("colab_deals")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("colab_documents", {
      title: args.title,
      content: args.content,
      markdown: args.markdown,
      userId: args.userId,
      dealId: args.dealId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a document
export const update = mutation({
  args: {
    id: v.id("colab_documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    markdown: v.optional(v.string()),
    dealId: v.optional(v.id("colab_deals")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Archive a document (soft delete)
export const archive = mutation({
  args: { id: v.id("colab_documents") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});

// Permanently delete a document
export const remove = mutation({
  args: { id: v.id("colab_documents") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
