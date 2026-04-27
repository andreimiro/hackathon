import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { normalizeGitHubRepoUrl } from "@/lib/github";
import { listUsers, upsertUser } from "@/lib/users";

export async function GET() {
  try {
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, githubRepo } = body;

    const normalizedGithubRepo = normalizeGitHubRepoUrl(githubRepo || "");
    if (!normalizedGithubRepo) {
      return NextResponse.json({ error: "GitHub repository URL is required" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    const savedUserId = await upsertUser({
      clerkId: userId,
      name: clerkUser?.fullName || name || clerkUser?.primaryEmailAddress?.emailAddress || "",
      email: clerkUser?.primaryEmailAddress?.emailAddress || email || "",
      githubRepo: normalizedGithubRepo,
    });

    return NextResponse.json({ success: true, userId: savedUserId });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
