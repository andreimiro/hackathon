"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Github, Loader2, CheckCircle, ArrowRight, HelpCircle, X, BookOpen, Globe, Code } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  
  const [githubRepo, setGithubRepo] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Check if user is already registered
  useEffect(() => {
    if (!isLoaded || !user) return
    
    const checkRegistration = async () => {
      try {
        const res = await fetch("/api/users")
        const users = await res.json()
        const currentUser = users.find((u: any) => u.clerkId === user.id)
        
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

  // Redirect if not signed in
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
          clerkId: user?.id,
          name: user?.fullName || user?.emailAddresses[0]?.emailAddress || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
          githubRepo
        })
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to register. Please try again.")
      }
    } catch (err) {
      setError("Failed to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#E84C36] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Checking registration...</p>
        </div>
      </div>
    )
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Already Registered!</h2>
          <p className="text-gray-400 mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E84C36]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Github className="w-8 h-8 text-[#E84C36]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-400">
            Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
            <br />
            Just one more step to join the hackathon.
          </p>
          <button
            onClick={() => setShowHelpModal(true)}
            className="mt-4 text-sm text-[#E84C36] hover:text-[#D13D2A] flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            How to Register?
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Repository URL
              </label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E84C36] focus:ring-1 focus:ring-[#E84C36] transition-all"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Make sure your repository is public so we can track your commits
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E84C36] hover:bg-[#D13D2A] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Skip for now →
          </button>
          <p className="text-sm text-gray-600">
            Not {user?.firstName || user?.emailAddresses[0]?.emailAddress}?{" "}
            <button
              onClick={() => router.push("/sign-in")}
              className="text-[#E84C36] hover:underline"
            >
              Sign in with a different account
            </button>
          </p>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E84C36]" />
                How to Register
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#E84C36]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E84C36] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Create a GitHub Repository</h3>
                    <p className="text-gray-400 text-sm">
                      Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#E84C36] hover:underline">github.com/new</a> and create a new public repository for your project.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#E84C36]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E84C36] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Copy the Repository URL</h3>
                    <p className="text-gray-400 text-sm">
                      Once created, copy the URL. It should look like: <code className="bg-white/10 px-2 py-1 rounded text-xs">https://github.com/username/repo-name</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#E84C36]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E84C36] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Paste URL & Register</h3>
                    <p className="text-gray-400 text-sm">
                      Paste your repository URL in the field above and click "Complete Registration".
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#E84C36]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E84C36] font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Start Coding!</h3>
                    <p className="text-gray-400 text-sm">
                      Once registered, you can start coding. We'll track your commits automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#E84C36]" />
                  Requirements
                </h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E84C36]">•</span>
                    Repository must be public
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E84C36]">•</span>
                    You can use any programming language
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E84C36]">•</span>
                    Code must be written during the hackathon
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#E84C36]" />
                  Quick Start
                </h4>
                <code className="block bg-black/50 rounded-lg p-3 text-xs text-gray-300 font-mono">
                  git clone https://github.com/example/menorca-starter.git
                </code>
              </div>
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#E84C36] hover:bg-[#D13D2A] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
