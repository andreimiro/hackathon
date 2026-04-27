"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { ArrowRight, Github, Plus, Users } from "lucide-react"

interface Participant {
  id: string
  clerkId: string
  name: string
  email: string
  githubRepo: string
  createdAt: number
  metrics?: {
    commits: number
    stars: number
    forks: number
  }
}

export default function ParticipantsPage() {
  const { user } = useUser()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  const fetchParticipants = async () => {
    try {
      const res = await fetch("/api/users")
      const users = (await res.json()) as Participant[]
      setParticipants(users)
      setLoading(false)
    } catch (e) {
      console.error("Failed to fetch participants", e)
      setLoading(false)
    }
  }

  const fetchMetrics = async (githubRepo: string) => {
    try {
      const repoPath = githubRepo.replace("https://github.com/", "").replace(/\/$/, "")
      const [owner, repo] = repoPath.split("/")
      const res = await fetch(`/api/github/metrics?owner=${owner}&repo=${repo}`)
      return await res.json()
    } catch {
      return { commits: 0, stars: 0, forks: 0 }
    }
  }

  useEffect(() => {
    fetchParticipants()
    const interval = setInterval(fetchParticipants, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (participants.length === 0) return

    const loadMetrics = async () => {
      const withMetrics = await Promise.all(
        participants.map(async (p) => ({
          ...p,
          metrics: await fetchMetrics(p.githubRepo),
        }))
      )
      setParticipants(withMetrics)
    }
    loadMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants.length])

  return (
    <main className="warm-shell min-h-screen px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="glass-button inline-flex rounded-full px-4 py-2 text-sm text-muted-foreground">
              Live roster
            </div>
            <h1 className="serif-display mt-6 text-5xl leading-tight text-foreground md:text-7xl">Participants</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              A curated mix of builders, creators, and problem solvers shipping during the event.
            </p>
          </div>
          <div className="metal-strip grid grid-cols-3 overflow-hidden rounded-2xl">
            <div className="p-6 text-center">
              <div className="serif-display text-4xl text-foreground">{participants.length}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Teams</div>
            </div>
            <div className="border-x border-[hsl(var(--line)/0.62)] p-6 text-center">
              <div className="serif-display text-4xl text-foreground">{participants.reduce((sum, p) => sum + (p.metrics?.commits || 0), 0)}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Commits</div>
            </div>
            <div className="p-6 text-center">
              <div className="serif-display text-4xl text-foreground">24h</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Build</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="aqua-panel rounded-[2rem] py-16 text-center text-muted-foreground">Loading participants...</div>
        ) : participants.length === 0 ? (
          <div className="aqua-panel rounded-[2rem] px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[hsl(var(--primary)/0.12)]">
              <Users className="h-10 w-10 text-[hsl(var(--primary))]" />
            </div>
            <h2 className="serif-display text-4xl text-foreground">No participants yet</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Be the first to join the hackathon. Register now to participate and show your work.
            </p>
            <Link href={user ? "/register" : "/sign-up"}>
              <button className="aqua-button mt-7 inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold">
                <Plus className="h-5 w-5" />
                {user ? "Register now" : "Sign up to register"}
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {participants.map((participant, index) => (
              <article key={participant.id} className="aqua-panel overflow-hidden rounded-[2rem] p-3">
                <div className={`h-44 rounded-2xl bg-gradient-to-br ${
                  index % 3 === 0
                    ? "from-amber-100 via-stone-200 to-orange-200"
                    : index % 3 === 1
                    ? "from-stone-100 via-rose-100 to-amber-200"
                    : "from-zinc-200 via-stone-300 to-orange-100"
                } dark:from-stone-800 dark:via-stone-700 dark:to-amber-900/40`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="serif-display text-2xl text-foreground">{participant.name || "Anonymous"}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{participant.email}</p>
                    </div>
                    <Badge className="border-0 bg-emerald-500/14 text-emerald-600 dark:text-emerald-300">Active</Badge>
                  </div>

                  {participant.githubRepo && (
                    <a
                      href={participant.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex items-center gap-2 rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.62)] p-4 text-[hsl(var(--primary))] hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      <span className="truncate text-sm">{participant.githubRepo.replace("https://github.com/", "")}</span>
                    </a>
                  )}

                  {participant.metrics && (
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      {[
                        ["Commits", participant.metrics.commits],
                        ["Stars", participant.metrics.stars],
                        ["Forks", participant.metrics.forks],
                      ].map(([label, value]) => (
                        <div key={label as string} className="rounded-2xl bg-[hsl(var(--foreground)/0.05)] p-3">
                          <div className="font-mono text-xl font-semibold text-foreground">{value as number}</div>
                          <div className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">{label as string}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="aqua-panel rounded-[2rem] p-8 text-center">
          <h3 className="serif-display text-3xl text-foreground">Want to join the competition?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Register now to participate and showcase your project.</p>
          <Link href={user ? "/register" : "/sign-up"}>
            <button className="aqua-button mt-6 inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold">
              {user ? "Register now" : "Sign up to register"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </section>
      </div>
    </main>
  )
}
