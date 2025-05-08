import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // if user already exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // if not, then add new user
    if (user?.length === 0) {
      const newUserId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        clerkId: args.clerkId,
        token: 5000,
      });

      // Fetch the newly created user to return
      const newUser = await ctx.db.get(newUserId);
      return [
        {
          ...newUser,
          _id: newUserId,
        },
      ];
    }

    // If user exists, make sure _id field is included
    return user.map((u) => ({
      ...u,
      _id: u._id, // Ensure _id is explicitly included
    }));
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });
    return result;
  },
});
