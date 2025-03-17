import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
  }),
  workspace: defineTable({
    messages: v.array(
      v.object({
        _id: v.optional(v.string()),
        role: v.union(v.literal("user"), v.literal("ai")),
        content: v.string(),
        createdAt: v.optional(v.number()),
      })
    ),
    fileData: v.optional(v.any()),
    user: v.id("users"),
  }),
});
