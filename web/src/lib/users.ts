import { createSupabaseAdminClient } from "@/lib/supabase/server"
import type { AppUser } from "@/lib/user-types"

type UserRow = {
  id: string
  clerk_id: string
  name: string
  email: string
  github_repo: string
  created_at: string
}

export type RegisterUserInput = {
  clerkId: string
  name: string
  email: string
  githubRepo: string
}

function mapUser(row: UserRow): AppUser {
  return {
    id: row.id,
    _id: row.id,
    clerkId: row.clerk_id,
    name: row.name,
    email: row.email,
    githubRepo: row.github_repo,
    createdAt: new Date(row.created_at).getTime(),
  }
}

export async function listUsers() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, clerk_id, name, email, github_repo, created_at")
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return data.map(mapUser)
}

export async function upsertUser(input: RegisterUserInput) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: input.clerkId,
        name: input.name,
        email: input.email,
        github_repo: input.githubRepo,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_id" }
    )
    .select("id")
    .single()

  if (error) {
    throw error
  }

  return data.id
}
