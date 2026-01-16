import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBoard = mutation({
  args: {
    name: v.string(),
    visibility: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const boardId = await ctx.db.insert("colab_boards", {
      name: args.name,
      visibility: args.visibility,
      userId: args.userId,
      createdAt: Date.now(),
    });
    return boardId;
  },
});

export const listBoards = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("colab_boards")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getBoard = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) return null;

    const lists = await ctx.db
      .query("colab_lists")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    // Sort lists by order
    lists.sort((a, b) => a.order - b.order);

    const cards = [];
    for (const list of lists) {
        const listCards = await ctx.db
            .query("colab_cards")
            .withIndex("by_list", (q) => q.eq("listId", list._id))
            .collect();
        cards.push(...listCards);
    }

    return {
        ...board,
        lists,
        cards,
    };
  },
});

export const createCard = mutation({
  args: {
    title: v.string(),
    listId: v.id("colab_lists"),
    order: v.number(),
    createdBy: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_cards", {
        title: args.title,
        listId: args.listId,
        order: args.order,
        createdBy: args.createdBy,
        description: args.description,
    });
  },
});

export const moveCard = mutation({
  args: {
    cardId: v.id("colab_cards"),
    newListId: v.id("colab_lists"),
    newOrder: v.number(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.cardId, {
        listId: args.newListId,
        order: args.newOrder,
    });
  },
});

export const getCard = query({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.cardId);
  },
});

export const updateCard = mutation({
  args: {
    cardId: v.id("colab_cards"),
    description: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { cardId, userId, ...updates } = args;
    await ctx.db.patch(cardId, updates);
  },
});

export const getChecklists = query({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    const checklists = await ctx.db
      .query("colab_checklists")
      .withIndex("by_card", (q) => q.eq("cardId", args.cardId))
      .collect();

    const checklistsWithItems = [];
    for (const list of checklists) {
      const items = await ctx.db
        .query("colab_checklist_items")
        .withIndex("by_checklist", (q) => q.eq("checklistId", list._id))
        .collect();
      checklistsWithItems.push({
        ...list,
        items,
      });
    }
    return checklistsWithItems;
  },
});

export const addChecklist = mutation({
  args: {
    cardId: v.id("colab_cards"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_checklists", {
      cardId: args.cardId,
      name: args.name,
    });
  },
});

export const addChecklistItem = mutation({
  args: {
    checklistId: v.id("colab_checklists"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_checklist_items", {
      checklistId: args.checklistId,
      content: args.content,
      completed: false,
    });
  },
});

export const toggleChecklistItem = mutation({
  args: {
    itemId: v.id("colab_checklist_items"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      completed: args.completed,
    });
  },
});
