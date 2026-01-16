import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- Queries ---

export const getBoards = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("colab_boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const getBoard = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.boardId);
  },
});

export const getLists = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colab_lists")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});

export const getCards = query({
  args: { listId: v.id("colab_lists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colab_cards")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
  },
});

export const getCard = query({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.cardId);
  },
});

export const getBoardData = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    const lists = await ctx.db
      .query("colab_lists")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    // Ideally we would fetch all cards for the board in one go, but
    // without a by_board index on cards (which is on lists), we iterate.
    // Optimization: Add secondary index on cards or fetch all lists then all cards.
    // For now, simpler approach:

    const listsWithCards = await Promise.all(
      lists.map(async (list) => {
        const cards = await ctx.db
          .query("colab_cards")
          .withIndex("by_list", (q) => q.eq("listId", list._id))
          .collect();
        return { ...list, cards: cards.sort((a, b) => a.index - b.index) };
      })
    );

    return listsWithCards.sort((a, b) => a.index - b.index);
  },
});


// --- Mutations ---

export const createBoard = mutation({
  args: {
    name: v.string(),
    workspaceId: v.string(),
    visibility: v.union(v.literal('private'), v.literal('workspace'), v.literal('public')),
    backgroundUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const publicId = crypto.randomUUID();
    return await ctx.db.insert("colab_boards", {
      ...args,
      createdBy: identity.subject,
      publicId,
      createdAt: Date.now(),
    });
  },
});

export const createList = mutation({
  args: {
    name: v.string(),
    boardId: v.id("colab_boards"),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const publicId = crypto.randomUUID();
    return await ctx.db.insert("colab_lists", {
      ...args,
      publicId,
      createdAt: Date.now(),
    });
  },
});

export const createCard = mutation({
  args: {
    title: v.string(),
    listId: v.id("colab_lists"),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const publicId = crypto.randomUUID();
    const cardId = await ctx.db.insert("colab_cards", {
      title: args.title,
      listId: args.listId,
      index: args.index,
      createdBy: identity.subject,
      publicId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      labelIds: [],
      assigneeIds: [],
    });

    // Log activity
    await ctx.db.insert("colab_cardActivities", {
      cardId,
      userId: identity.subject,
      action: "created",
      createdAt: Date.now(),
    });

    return cardId;
  },
});

export const updateCardPosition = mutation({
  args: {
    cardId: v.id("colab_cards"),
    sourceListId: v.id("colab_lists"),
    destListId: v.id("colab_lists"),
    newIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 1. Get all cards in destination list
    const destCards = await ctx.db
      .query("colab_cards")
      .withIndex("by_list", (q) => q.eq("listId", args.destListId))
      .collect();

    // Sort by index
    const sortedDestCards = destCards
      .filter(c => c._id !== args.cardId) // Exclude current if moving within same list
      .sort((a, b) => a.index - b.index);

    // Insert at new index
    // biome-ignore lint/suspicious/noExplicitAny: Temporary cast for splice
    sortedDestCards.splice(args.newIndex, 0, { _id: args.cardId } as any);

    // Update all indices
    await Promise.all(sortedDestCards.map((card, i) =>
      ctx.db.patch(card._id, {
        index: i,
        listId: args.destListId, // Ensure listId is updated
        updatedAt: Date.now()
      })
    ));

    // Log if list changed
    if (args.sourceListId !== args.destListId) {
      await ctx.db.insert("colab_cardActivities", {
        cardId: args.cardId,
        userId: identity.subject,
        action: "moved",
        details: { fromList: args.sourceListId, toList: args.destListId },
        createdAt: Date.now(),
      });
    }
  },
});

export const updateListOrder = mutation({
  args: {
    boardId: v.id("colab_boards"),
    listId: v.id("colab_lists"),
    newIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const lists = await ctx.db
      .query("colab_lists")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    const sortedLists = lists
      .filter(l => l._id !== args.listId)
      .sort((a, b) => a.index - b.index);

    // biome-ignore lint/suspicious/noExplicitAny: Temporary cast for splice
    sortedLists.splice(args.newIndex, 0, { _id: args.listId } as any);

    await Promise.all(sortedLists.map((list, i) =>
      ctx.db.patch(list._id, { index: i })
    ));
  },
});

export const updateCard = mutation({
  args: {
    cardId: v.id("colab_cards"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    dueDateCompleted: v.optional(v.boolean()),
    labelIds: v.optional(v.array(v.id("colab_labels"))),
  },
  handler: async (ctx, args) => {
    const { cardId, ...updates } = args;
    await ctx.db.patch(cardId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const getLabels = query({
  args: { boardId: v.id("colab_boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("colab_labels")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});

export const createLabel = mutation({
  args: {
    boardId: v.id("colab_boards"),
    name: v.string(),
    colorCode: v.string(),
  },
  handler: async (ctx, args) => {
    const publicId = crypto.randomUUID();
    return await ctx.db.insert("colab_labels", {
      ...args,
      publicId,
    });
  },
});

export const getChecklists = query({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    const checklists = await ctx.db
      .query("colab_checklists")
      .withIndex("by_card", (q) => q.eq("cardId", args.cardId))
      .collect();

    const checklistsWithItems = await Promise.all(
      checklists.map(async (list) => {
        const items = await ctx.db
          .query("colab_checklistItems")
          .withIndex("by_checklist", (q) => q.eq("checklistId", list._id))
          .collect();
        return { ...list, items: items.sort((a, b) => a.index - b.index) };
      })
    );

    return checklistsWithItems.sort((a, b) => a.index - b.index);
  },
});

export const createChecklist = mutation({
  args: {
    cardId: v.id("colab_cards"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const publicId = crypto.randomUUID();
    const existingCount = (
      await ctx.db
        .query("colab_checklists")
        .withIndex("by_card", (q) => q.eq("cardId", args.cardId))
        .collect()
    ).length;

    return await ctx.db.insert("colab_checklists", {
      ...args,
      publicId,
      index: existingCount,
    });
  },
});

export const addChecklistItem = mutation({
  args: {
    checklistId: v.id("colab_checklists"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const publicId = crypto.randomUUID();
    const existingItems = await ctx.db
      .query("colab_checklistItems")
      .withIndex("by_checklist", (q) => q.eq("checklistId", args.checklistId))
      .collect();

    return await ctx.db.insert("colab_checklistItems", {
      checklistId: args.checklistId,
      content: args.content,
      completed: false,
      index: existingItems.length,
      publicId,
    });
  },
});

export const toggleChecklistItem = mutation({
  args: {
    itemId: v.id("colab_checklistItems"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, { completed: args.completed });
  },
});

export const deleteCard = mutation({
  args: { cardId: v.id("colab_cards") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cardId);
  },
});
