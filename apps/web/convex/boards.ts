import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- Boards ---

export const createBoard = mutation({
  args: {
    name: v.string(),
    visibility: v.union(v.literal('private'), v.literal('workspace'), v.literal('public')),
    backgroundUrl: v.optional(v.string()),
    workspaceId: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const boardId = await ctx.db.insert("colab_boards", {
      name: args.name,
      visibility: args.visibility,
      backgroundUrl: args.backgroundUrl,
      workspaceId: args.workspaceId,
      createdBy: args.userId,
      createdAt: Date.now(),
    });

    // Create default lists
    const defaultLists = ["À faire", "En cours", "Terminé"];
    await Promise.all(defaultLists.map((name, index) =>
      ctx.db.insert("colab_lists", {
        name,
        boardId,
        order: index,
        createdAt: Date.now(),
      })
    ));

    return boardId;
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

    const cards = await Promise.all(
      lists.map(async (list) => {
        const listCards = await ctx.db
          .query("colab_cards")
          .withIndex("by_list", (q) => q.eq("listId", list._id))
          .collect();
        return listCards;
      })
    );

    const flatCards = cards.flat().sort((a, b) => a.order - b.order);

    return {
      ...board,
      lists,
      cards: flatCards,
    };
  },
});

export const listBoards = query({
  args: { userId: v.string(), workspaceId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Basic implementation: fetch boards created by user or in workspace
    // In production, would handle complex visibility rules
    // biome-ignore lint/style/useConst: will add workspace boards
    let boards = await ctx.db
      .query("colab_boards")
      .withIndex("by_user", (q) => q.eq("createdBy", args.userId))
      .collect();

    if (args.workspaceId) {
      const workspaceBoards = await ctx.db
        .query("colab_boards")
        // biome-ignore lint/style/noNonNullAssertion: Checked by if condition
        .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId!))
        .collect();
      // Merge unique boards (simple dedupe)
      const boardIds = new Set(boards.map(b => b._id));
      for (const b of workspaceBoards) {
        if (!boardIds.has(b._id)) {
          boards.push(b);
        }
      }
    }

    return boards.sort((a, b) => b.createdAt - a.createdAt);
  },
});


// --- Lists ---

export const createList = mutation({
  args: {
    name: v.string(),
    boardId: v.id("colab_boards"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_lists", {
      name: args.name,
      boardId: args.boardId,
      order: args.order,
      createdAt: Date.now(),
    });
  },
});

export const reorderList = mutation({
  args: {
    listId: v.id("colab_lists"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    // Simplified reordering: usually requires shifting other items
    // For this implementation, we assume client sends correct order or we just update single item
    // A robust implementation updates all affected items' indices
    await ctx.db.patch(args.listId, { order: args.newOrder });
  },
});


// --- Cards ---

export const createCard = mutation({
  args: {
    title: v.string(),
    listId: v.id("colab_lists"),
    order: v.number(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const cardId = await ctx.db.insert("colab_cards", {
      title: args.title,
      listId: args.listId,
      order: args.order,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("colab_card_activities", {
      cardId,
      userId: args.createdBy,
      action: "a créé la carte",
      createdAt: Date.now(),
    });

    return cardId;
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
    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    await ctx.db.patch(args.cardId, {
      listId: args.newListId,
      order: args.newOrder,
      updatedAt: Date.now(),
    });

    if (card.listId !== args.newListId) {
       await ctx.db.insert("colab_card_activities", {
        cardId: args.cardId,
        userId: args.userId,
        action: "a déplacé la carte",
        details: { from: card.listId, to: args.newListId },
        createdAt: Date.now(),
      });
    }
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
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { cardId, userId, ...updates } = args;
    await ctx.db.patch(cardId, {
      ...updates,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("colab_card_activities", {
      cardId,
      userId,
      action: "a mis à jour la carte",
      details: Object.keys(updates),
      createdAt: Date.now(),
    });
  },
});

// --- Labels ---

export const getLabels = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colab_labels")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});

export const addLabel = mutation({
  args: {
    name: v.string(),
    colorCode: v.string(),
    boardId: v.id("colab_boards"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("colab_labels", args);
  },
});

// --- Checklists ---

export const getChecklists = query({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    const checklists = await ctx.db
      .query("colab_checklists")
      .withIndex("by_card", (q) => q.eq("cardId", args.cardId))
      .collect();

    // Fetch items for each checklist
    const checklistsWithItems = await Promise.all(
        checklists.map(async (checklist) => {
            const items = await ctx.db
                .query("colab_checklist_items")
                .withIndex("by_checklist", (q) => q.eq("checklistId", checklist._id))
                .collect();
            return { ...checklist, items };
        })
    );

    return checklistsWithItems;
  },
});

export const addChecklist = mutation({
  args: {
    name: v.string(),
    cardId: v.id("colab_cards"),
  },
  handler: async (ctx, args) => {
    // get max order
    const existing = await ctx.db.query("colab_checklists").withIndex("by_card", q => q.eq("cardId", args.cardId)).collect();
    const order = existing.length;
    return await ctx.db.insert("colab_checklists", { ...args, order });
  },
});

export const addChecklistItem = mutation({
  args: {
    content: v.string(),
    checklistId: v.id("colab_checklists"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("colab_checklist_items").withIndex("by_checklist", q => q.eq("checklistId", args.checklistId)).collect();
    const order = existing.length;
    return await ctx.db.insert("colab_checklist_items", {
        content: args.content,
        checklistId: args.checklistId,
        completed: false,
        order
    });
  },
});

export const toggleChecklistItem = mutation({
  args: {
    itemId: v.id("colab_checklist_items"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, { completed: args.completed });
  },
});
