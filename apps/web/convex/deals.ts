import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Valid deal stages
const dealStages = v.union(
  v.literal("sourcing"),
  v.literal("due-diligence"),
  v.literal("negotiation"),
  v.literal("closing"),
  v.literal("closed-won"),
  v.literal("closed-lost")
);

// Get all deals
export const list = query({
  args: {
    userId: v.optional(v.string()),
    stage: v.optional(dealStages),
  },
  handler: async (ctx, args) => {
    // Fetch all deals and filter in memory for flexibility
    const allDeals = await ctx.db
      .query("colab_deals")
      .order("desc")
      .collect();
    
    let deals = allDeals;
    
    // Filter by stage if provided
    if (args.stage) {
      deals = deals.filter((d) => d.stage === args.stage);
    }
    
    // Filter by user if provided
    if (args.userId) {
      return deals.filter((d) => d.userId === args.userId);
    }
    
    return deals.filter((d) => !d.isArchived);
  },
});

// Get a single deal
export const get = query({
  args: { id: v.id("colab_deals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get deals grouped by stage (for pipeline view)
export const getByStage = query({
  args: {},
  handler: async (ctx) => {
    const deals = await ctx.db
      .query("colab_deals")
      .filter((q) => q.neq(q.field("isArchived"), true))
      .collect();
    
    return {
      sourcing: deals.filter((d) => d.stage === "sourcing"),
      "due-diligence": deals.filter((d) => d.stage === "due-diligence"),
      negotiation: deals.filter((d) => d.stage === "negotiation"),
      closing: deals.filter((d) => d.stage === "closing"),
      "closed-won": deals.filter((d) => d.stage === "closed-won"),
      "closed-lost": deals.filter((d) => d.stage === "closed-lost"),
    };
  },
});

// Create a new deal
export const create = mutation({
  args: {
    company: v.string(),
    stage: dealStages,
    valuation: v.optional(v.string()),
    lead: v.optional(v.string()),
    description: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("colab_deals", {
      company: args.company,
      stage: args.stage,
      valuation: args.valuation,
      lead: args.lead,
      description: args.description,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a deal
export const update = mutation({
  args: {
    id: v.id("colab_deals"),
    company: v.optional(v.string()),
    stage: v.optional(dealStages),
    valuation: v.optional(v.string()),
    lead: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Move deal to a different stage
export const moveStage = mutation({
  args: {
    id: v.id("colab_deals"),
    stage: dealStages,
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      stage: args.stage,
      updatedAt: Date.now(),
    });
  },
});

// Archive a deal
export const archive = mutation({
  args: { id: v.id("colab_deals") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});

// Delete a deal permanently
export const remove = mutation({
  args: { id: v.id("colab_deals") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
