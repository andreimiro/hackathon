"use client"

import { useEffect, useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ExternalLink, Github, Plus, Timer, Users } from "lucide-react"
import type { AppUser } from "@/lib/user-types"

const HACKATHON_START = new Date("2026-03-05T19:00:00Z")

type TimeLeft = { hours: number; minutes: number; seconds: number }

function TimeTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.62)] px-5 py-4 text-center shadow-inner">
      <div className="font-mono text-4xl font-semibold text-foreground md:text-6xl">{value.toString().padStart(2, "0")}</div>
      <div className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const { signOut } = useClerk()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [hackathonStatus, setHackathonStatus] = useState("not-started")
  const [githubRepoSaved, setGithubRepoSaved] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [checkingRegistration, setCheckingRegistration] = useState(true)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch("/api/hackathon-time")
        const data = await res.json()
        setHackathonStatus(data.status)
        setTimeLeft(data.timeLeft)
      } catch (e) {
        console.error("Failed to fetch hackathon time", e)
      }
    }

    fetchTime()
    const interval = setInterval(fetchTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const loadUser = async () => {
      try {
        const res = await fetch("/api/users")
        const users = (await res.json()) as AppUser[]
        const currentUser = users.find((u) => u.clerkId === user.id)
        if (currentUser?.githubRepo) {
          setGithubRepoSaved(currentUser.githubRepo)
          setIsRegistered(true)
        }
      } catch (e) {
        console.error("Failed to load user", e)
      } finally {
        setCheckingRegistration(false)
      }
    }
    loadUser()
  }, [user?.id])

  if (!user || checkingRegistration) {
    return (
      <div className="warm-shell flex min-h-screen items-center justify-center px-4">
        <div className="aqua-panel rounded-3xl px-10 py-8 text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <main className="warm-shell min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="glass-button inline-flex rounded-full px-4 py-2 text-sm text-muted-foreground">
              {hackathonStatus === "not-started"
                ? `Hackathon starts ${HACKATHON_START.toLocaleDateString()}`
                : hackathonStatus === "in-progress"
                ? "Hackathon is live"
                : "Hackathon has ended"}
            </div>
            <h1 className="serif-display mt-6 max-w-4xl text-5xl leading-tight text-foreground md:text-7xl">
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress || "builder"}.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Your project workspace, registration status, repository, and event clock in one calm place.
            </p>
          </div>

          {!isRegistered && (
            <Link href="/register" className="lg:justify-self-end">
              <button className="aqua-button inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold">
                <Plus className="h-5 w-5" />
                Register
              </button>
            </Link>
          )}
        </section>

        <section className="aqua-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="fine-label">Contest status</div>
              <h2 className="serif-display mt-2 text-3xl text-foreground">
                {hackathonStatus === "not-started" ? "Countdown to start" : hackathonStatus === "in-progress" ? "Time remaining" : "Results period"}
              </h2>
            </div>
            <div
              className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                hackathonStatus === "in-progress"
                  ? "bg-emerald-500/14 text-emerald-600 dark:text-emerald-300"
                  : hackathonStatus === "not-started"
                  ? "bg-[hsl(var(--foreground)/0.07)] text-muted-foreground"
                  : "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))]"
              }`}
            >
              {hackathonStatus === "not-started" ? "Not Started" : hackathonStatus === "in-progress" ? "Live" : "Ended"}
            </div>
          </div>

          {(hackathonStatus === "not-started" || hackathonStatus === "in-progress") && (
            <div className="grid gap-4 md:grid-cols-3">
              <TimeTile value={timeLeft.hours} label="Hours" />
              <TimeTile value={timeLeft.minutes} label="Minutes" />
              <TimeTile value={timeLeft.seconds} label="Seconds" />
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="aqua-panel rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="fine-label">Registration</div>
                <h2 className="serif-display mt-2 text-3xl text-foreground">Status</h2>
              </div>
              <div className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${isRegistered ? "bg-emerald-500/14 text-emerald-600 dark:text-emerald-300" : "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))]"}`}>
                {isRegistered ? "Registered" : "Not Registered"}
              </div>
            </div>

            {!isRegistered ? (
              <div className="mt-8">
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                  You can browse the dashboard without registering. Register anytime to participate and submit your repository.
                </p>
                <Link href="/register">
                  <button className="aqua-button mt-6 inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold">
                    Register now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.64)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--primary)/0.14)]">
                    <Github className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">You are registered</span>
                    </div>
                    <p className="truncate font-medium text-foreground">{githubRepoSaved.replace("https://github.com/", "")}</p>
                    <a href={githubRepoSaved} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-[hsl(var(--primary))] hover:underline">
                      View repository
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="metal-strip rounded-[2rem] p-6 md:p-8">
            <div className="fine-label">Quick actions</div>
            <div className="mt-6 space-y-3">
              {[
                [Users, "View participants", "/participants"],
                [Github, "Update repository", "/register"],
                [Timer, "Check event timing", "/"],
              ].map(([Icon, label, href]) => (
                <Link key={label as string} href={href as string} className="flex items-center justify-between rounded-2xl border border-[hsl(var(--line)/0.68)] bg-[hsl(var(--card)/0.54)] p-4 text-sm font-medium hover:bg-[hsl(var(--card)/0.8)]">
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[hsl(var(--primary))]" />
                    {label as string}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="glass-button flex w-full items-center justify-between rounded-2xl p-4 text-sm font-medium"
              >
                Sign out
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
