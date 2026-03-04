import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const users = await convex.query(api.users.getAll);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, name, email, githubRepo } = body;

    console.log("Register request:", { clerkId, name, email, githubRepo });

    if (!githubRepo) {
      return NextResponse.json({ error: "GitHub repository URL is required" }, { status: 400 });
    }

    const userId = await convex.mutation(api.users.register, {
      clerkId: clerkId || `demo_${Date.now()}`,
      name: name || "",
      email: email || "",
      githubRepo,
    });

    console.log("User registered:", userId);
    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
