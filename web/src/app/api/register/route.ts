import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage (same as /api/users)
const users: Map<string, { name: string; email: string; githubRepo: string; createdAt: number }> = new Map();

export async function POST(req: NextRequest) {
  try {
    const { clerkId, name, email, githubRepo } = await req.json();

    if (!clerkId || !name || !email || !githubRepo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate GitHub repo format
    const repoPath = githubRepo.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = repoPath.split("/");
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    // Check if repo exists on GitHub (if token available)
    const token = process.env.GITHUB_TOKEN;
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

    // Save user (update if exists)
    users.set(clerkId, {
      name,
      email,
      githubRepo,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true, message: "User registered", userId: clerkId });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
