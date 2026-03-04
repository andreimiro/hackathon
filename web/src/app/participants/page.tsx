"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Github, Users, Plus } from "lucide-react"

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
      const users = await res.json()
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
    } catch (e) {
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
          metrics: await fetchMetrics(p.githubRepo)
        }))
      )
      setParticipants(withMetrics)
    }
    loadMetrics()
  }, [participants.length])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Participants
            </h1>
            <p className="text-lg text-gray-400">
              Track the progress of our competing developers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#E84C36] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading participants...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Participants Yet</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Be the first to join the hackathon! Register now to participate and compete for the grand prize.
              </p>
              {user ? (
                <Link href="/register">
                  <button className="bg-[#E84C36] hover:bg-[#D13D2A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Register Now
                  </button>
                </Link>
              ) : (
                <Link href="/sign-up">
                  <button className="bg-[#E84C36] hover:bg-[#D13D2A] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Sign Up to Register
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {participants.map((participant) => (
                  <Card key={participant.id} className="bg-white/5 border border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">
                          {participant.name || "Anonymous"}
                        </CardTitle>
                        <Badge className="bg-green-600/20 text-green-400 border-0">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {participant.githubRepo && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                            Repository
                          </p>
                          <a
                            href={participant.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#E84C36] hover:underline"
                          >
                            <Github className="w-4 h-4" />
                            <span className="truncate">{participant.githubRepo.replace("https://github.com/", "")}</span>
                          </a>
                        </div>
                      )}
                      {participant.metrics && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xl font-bold text-white">
                              {participant.metrics.commits}
                            </div>
                            <div className="text-xs text-gray-500">Commits</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xl font-bold text-white">
                              {participant.metrics.stars}
                            </div>
                            <div className="text-xs text-gray-500">Stars</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xl font-bold text-white">
                              {participant.metrics.forks}
                            </div>
                            <div className="text-xs text-gray-500">Forks</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Register CTA at bottom */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Want to join the competition?</h3>
                <p className="text-gray-400 mb-4">Register now to participate and showcase your skills!</p>
                {user ? (
                  <Link href="/register">
                    <button className="bg-[#E84C36] hover:bg-[#D13D2A] text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Register Now
                    </button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <button className="bg-[#E84C36] hover:bg-[#D13D2A] text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Sign Up to Register
                    </button>
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="text-center pt-4">
            <Link href="/dashboard" className="text-[#E84C36] hover:underline">
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
