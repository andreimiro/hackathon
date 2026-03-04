import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const register = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    githubRepo: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        githubRepo: args.githubRepo,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      githubRepo: args.githubRepo,
      createdAt: Date.now(),
    });
    return id;
  },
});
