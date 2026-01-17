import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // If userId is provided, filter by it. Otherwise, return all (or handle auth)
    // For now, assuming we filter by userId if present
    if (args.userId) {
      return await ctx.db
        .query("colab_presentations")
        // biome-ignore lint/style/noNonNullAssertion: Checked by if condition
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("colab_presentations").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("colab_presentations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    userId: v.string(),
    workspaceId: v.optional(v.string()),
    theme: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_presentations", {
      title: args.title,
      userId: args.userId,
      workspaceId: args.workspaceId,
      theme: args.theme,
      language: args.language,
      slides: [],
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("colab_presentations"),
    slides: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          content: v.any(),
          rootImage: v.optional(
            v.object({
              url: v.string(),
              query: v.string(),
            }),
          ),
        }),
      ),
    ),
    status: v.optional(v.union(v.literal("draft"), v.literal("generating"), v.literal("complete"))),
    title: v.optional(v.string()),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deletePresentation = mutation({
  args: { id: v.id("colab_presentations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
