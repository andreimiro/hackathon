import { NextRequest, NextResponse } from "next/server";
import { internalAction } from "../../../../convex/_generated/server";

const registerUser = internalAction({
  args: {
    clerkId: {} as any,
    name: {} as any,
    email: {} as any,
    githubRepo: {} as any,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users" as any)
      .withIndex("clerkId" as any, (q: any) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        githubRepo: args.githubRepo,
      });
      return existing._id;
    }

    return await ctx.db.insert("users" as any, {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      githubRepo: args.githubRepo,
      createdAt: Date.now(),
    });
  },
});

export async function POST(req: NextRequest) {
  try {
    const { clerkId, name, email, githubRepo } = await req.json();

    if (!clerkId || !name || !email || !githubRepo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    const repoPath = githubRepo.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = repoPath.split("/");
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    if (token) {
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!repoResponse.ok) {
        return NextResponse.json(
          { error: "Repository not found or is private" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, message: "User registered" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
