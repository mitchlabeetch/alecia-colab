import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPresentation = mutation({
  args: {
    title: v.string(),
    workspaceId: v.optional(v.string()),
    theme: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("colab_presentations", {
      ...args,
      userId: identity.subject,
      status: "draft",
      slides: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getPresentations = query({
  args: { workspaceId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // If workspaceId provided, use it, else default to user's private list or just recent
    // For now assuming filtering by user is enough or workspace if context exists
    if (args.workspaceId) {
      return await ctx.db
        .query("colab_presentations")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("colab_presentations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const updatePresentation = mutation({
  args: {
    presentationId: v.id("colab_presentations"),
    slides: v.array(v.object({
      id: v.string(),
      title: v.string(),
      content: v.any(),
      rootImage: v.optional(v.object({
        url: v.string(),
        query: v.string(),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.presentationId, {
      slides: args.slides,
      updatedAt: Date.now(),
    });
  },
});
