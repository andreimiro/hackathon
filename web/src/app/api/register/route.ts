import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { normalizeGitHubRepoUrl } from "@/lib/github";
import { upsertUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, githubRepo } = await req.json();

    if (!githubRepo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedGithubRepo = normalizeGitHubRepoUrl(githubRepo);
    if (!normalizedGithubRepo) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    const repoPath = normalizedGithubRepo.replace("https://github.com/", "");
    const [owner, repo] = repoPath.split("/");

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

    const clerkUser = await currentUser();
    const savedUserId = await upsertUser({
      clerkId: userId,
      name: clerkUser?.fullName || name || clerkUser?.primaryEmailAddress?.emailAddress || "",
      email: clerkUser?.primaryEmailAddress?.emailAddress || email || "",
      githubRepo: normalizedGithubRepo,
    });

    return NextResponse.json({ success: true, message: "User registered", userId: savedUserId });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
