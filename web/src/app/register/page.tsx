"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ArrowRight, BookOpen, CheckCircle, Code, Github, Globe, HelpCircle, Loader2, X } from "lucide-react"
import type { AppUser } from "@/lib/user-types"

export default function RegisterPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const [githubRepo, setGithubRepo] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  useEffect(() => {
    if (!isLoaded || !user) return

    const checkRegistration = async () => {
      try {
        const res = await fetch("/api/users")
        const users = (await res.json()) as AppUser[]
        const currentUser = users.find((u) => u.clerkId === user.id)

        if (currentUser?.githubRepo) {
          setIsRegistered(true)
          router.push("/dashboard")
        }
      } catch (e) {
        console.error("Failed to check registration", e)
      } finally {
        setChecking(false)
      }
    }

    checkRegistration()
  }, [user, isLoaded, router])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in")
    }
  }, [user, isLoaded, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.fullName || user?.emailAddresses[0]?.emailAddress || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
          githubRepo,
        }),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to register. Please try again.")
      }
    } catch {
      setError("Failed to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || checking) {
    return (
      <div className="warm-shell flex min-h-screen items-center justify-center px-4">
        <div className="aqua-panel rounded-3xl px-10 py-8 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
          <p className="text-muted-foreground">Checking registration...</p>
        </div>
      </div>
    )
  }

  if (isRegistered) {
    return (
      <div className="warm-shell flex min-h-screen items-center justify-center px-4">
        <div className="aqua-panel rounded-3xl px-10 py-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-[hsl(var(--primary))]" />
          <h2 className="serif-display text-3xl text-foreground">Already registered</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="warm-shell min-h-screen px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="glass-button inline-flex rounded-full px-4 py-2 text-sm text-muted-foreground">
            Registration · Step 1 of 1
          </div>
          <h1 className="serif-display mt-6 max-w-xl text-5xl leading-tight text-foreground md:text-6xl">
            Bring your repository. We will handle the rest.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
            Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}. Add a public GitHub repository to join the event roster.
          </p>

          <div className="metal-strip mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl">
            {[
              ["01", "Account"],
              ["02", "Repository"],
              ["03", "Build"],
            ].map(([step, label]) => (
              <div key={step} className="border-r border-[hsl(var(--line)/0.62)] p-5 text-center last:border-r-0">
                <div className="serif-display text-3xl text-foreground">{step}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="aqua-panel rounded-[2rem] p-6 md:p-8">
          <div className="mb-7 flex items-start justify-between gap-6">
            <div>
              <Github className="mb-4 h-8 w-8 text-[hsl(var(--primary))]" />
              <h2 className="serif-display text-3xl text-foreground">Complete registration</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">One repository URL is all we need.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(true)}
              className="glass-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">GitHub Repository URL</label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  required
                  className="w-full rounded-2xl border border-[hsl(var(--line))] bg-[hsl(var(--card)/0.72)] py-4 pl-12 pr-4 text-foreground outline-none transition focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-[hsl(var(--primary)/0.14)]"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Make sure your repository is public so we can track your progress.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="aqua-button flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Complete registration
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <button onClick={() => router.push("/dashboard")} className="hover:text-foreground">
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/58 p-4 backdrop-blur-md">
          <div className="aqua-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-[hsl(var(--line)/0.72)] p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />
                How to register
              </h2>
              <button onClick={() => setShowHelpModal(false)} className="glass-button rounded-full p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {[
                ["Create a GitHub repository", "Go to github.com/new and create a public repository for your project."],
                ["Copy the repository URL", "Use a URL like https://github.com/username/repo-name."],
                ["Paste URL and register", "Paste the URL in the form and complete registration."],
                ["Start coding", "Once registered, you can build and update your project."],
              ].map(([title, copy], index) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.14)] text-sm font-semibold text-[hsl(var(--primary))]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--card)/0.56)] p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Requirements
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Repository must be public.</li>
                  <li>You can use any programming language.</li>
                  <li>Code must be written during the hackathon.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[hsl(var(--line)/0.72)] bg-[hsl(var(--foreground)/0.04)] p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Code className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Quick start
                </h4>
                <code className="block rounded-xl bg-[hsl(var(--foreground)/0.08)] p-3 text-xs text-muted-foreground">
                  git clone https://github.com/example/menorca-starter.git
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
