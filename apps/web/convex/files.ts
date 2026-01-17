import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    size: v.number(),
    folderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { storageId, fileName, fileType, size, folderId } = args;

    const fileId = await ctx.db.insert("colab_files", {
      storageId,
      fileName,
      fileType,
      size,
      folderId,
      userId: identity.subject,
      createdAt: Date.now(),
    });

    return fileId;
  },
});
