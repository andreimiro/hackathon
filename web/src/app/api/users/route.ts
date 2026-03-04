import { NextRequest, NextResponse } from "next/server";

const users: Map<string, { name: string; email: string; githubRepo: string; createdAt: number }> = new Map();

export async function GET() {
  return NextResponse.json(Array.from(users.entries()).map(([id, user]) => ({ id, ...user })));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, name, email, githubRepo } = body;

    console.log("Register request:", { clerkId, name, email, githubRepo });

    const userId = clerkId || `demo_${Date.now()}`;

    if (!githubRepo) {
      return NextResponse.json({ error: "GitHub repository URL is required" }, { status: 400 });
    }

    users.set(userId, {
      name: name || "",
      email: email || "",
      githubRepo,
      createdAt: Date.now(),
    });

    console.log("User registered:", userId);
    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
