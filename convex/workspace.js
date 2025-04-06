import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
  args: {
    messages: v.array(
      v.object({
        _id: v.string(),
        role: v.union(v.literal("user"), v.literal("ai")),
        content: v.string(),
        createdAt: v.number(),
      })
    ),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert("workspace", {
      messages: args.messages,
      user: args.user,
      fileData: {
        files: [],
        steps: [],
        llmMessages: [],
        createdAt: new Date().toISOString(),
      },
    });
    return workspaceId;
  },
});

export const GetWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return null;

    // Sort messages by createdAt
    const sortedMessages = workspace.messages.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    return {
      ...workspace,
      messages: sortedMessages,
    };
  },
});

export const UpdateMessage = mutation({
  args: {
    workspaceId: v.id("workspace"),
    messages: v.array(
      v.object({
        _id: v.string(),
        role: v.union(v.literal("user"), v.literal("ai")),
        content: v.string(),
        createdAt: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { workspaceId, messages } = args;

    // Replace temporary IDs with permanent ones
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      _id: msg._id.startsWith("temp-") ? crypto.randomUUID() : msg._id,
    }));

    await ctx.db.patch(workspaceId, {
      messages: updatedMessages,
    });
  },
});

export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),
    files: v.optional(v.any()),
    steps: v.optional(v.any()),
    llmMessages: v.optional(v.array(v.any())),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      fileData: {
        files: args.files,
        steps: args.steps,
        llmMessages: args.llmMessages || [],
        createdAt: args.createdAt || new Date().toISOString(),
      },
    });
    return result;
  },
});

export const GetAllWorkspace = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

    return result;
  },
});

export const DeleteWorkspace = mutation({
  args: { workspaceId: v.id("workspace"), uuid: v.string() },
  handler: async (ctx, args) => {
    // Fetch the workspace
    const workspace = await ctx.db.get(args.workspaceId);
    console.log(workspace._id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    // Ensure the user owns the workspace
    if (workspace.user !== args.uuid) {
      throw new Error(
        "Unauthorized: You do not have permission to delete this workspace"
      );
    }
    // Delete the workspace
    await ctx.db.delete(args.workspaceId);
    return { success: true, message: "Workspace deleted successfully" };
  },
});
