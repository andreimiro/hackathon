"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { CheckCircle, Github, ExternalLink, User, Plus } from "lucide-react"

const HACKATHON_START = new Date("2026-03-05T19:00:00Z")
const HACKATHON_END = new Date("2026-03-06T19:00:00Z")

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
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
        const users = await res.json()
        const currentUser = users.find((u: any) => u.clerkId === user.id)
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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black dark:border-white pb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-black dark:text-white mb-2">
                Welcome, {user.fullName || user.emailAddresses[0]?.emailAddress || "Developer"}!
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {hackathonStatus === "not-started"
                  ? `Hackathon starts ${HACKATHON_START.toLocaleString()}`
                  : hackathonStatus === "in-progress"
                  ? "Hackathon is in progress!"
                  : "Hackathon has ended"}
              </p>
            </div>
            {!isRegistered && (
              <Link href="/register" className="self-start md:self-auto">
                <button className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white px-4 md:px-6 py-2 md:py-3 font-bold hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  Register
                </button>
              </Link>
            )}
          </div>

          <div className="border-2 border-black dark:border-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">
                Contest Status
              </div>
              <div className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-none ${
                hackathonStatus === "in-progress"
                  ? "bg-green-600 text-white"
                  : hackathonStatus === "not-started"
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  : "bg-red-600 text-white"
              }`}>
                {hackathonStatus === "not-started" 
                  ? "Not Started" 
                  : hackathonStatus === "in-progress" 
                    ? "LIVE" 
                    : "Ended"}
              </div>
            </div>

            {(hackathonStatus === "not-started" || hackathonStatus === "in-progress") && (
              <div>
                <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-4">
                  {hackathonStatus === "not-started" 
                    ? `Countdown to start`
                    : "Time remaining until end of contest"}
                </div>
                <div className="flex justify-center gap-4 md:gap-16">
                  <div className="text-center">
                    <div className="text-5xl md:text-8xl font-black text-black dark:text-white mb-2">{timeLeft.hours.toString().padStart(2, "0")}</div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl md:text-8xl font-black text-black dark:text-white mb-2">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl md:text-8xl font-black text-black dark:text-white mb-2">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                    <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">Seconds</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-2 border-black dark:border-white p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black dark:text-white">
                Registration Status
              </h2>
              <div className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-none ${
                isRegistered
                  ? "bg-green-600 text-white"
                  : "bg-orange-500 text-white"
              }`}>
                {isRegistered ? "Registered" : "Not Registered"}
              </div>
            </div>
            
            {!isRegistered ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  You can browse the dashboard without registering. Register anytime to participate and submit your project.
                </p>
                <Link href="/register" className="block sm:inline-block">
                  <button className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white px-4 md:px-6 py-2 md:py-3 font-bold hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors text-sm md:text-base">
                    Register Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600 dark:text-green-400">
                  You are registered! Good luck!
                </p>
                <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 bg-[#E84C36]/10 flex items-center justify-center flex-shrink-0">
                    <Github className="w-5 h-5 text-[#E84C36]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-black dark:text-white font-medium truncate text-sm md:text-base">{githubRepoSaved.replace("https://github.com/", "")}</p>
                    <a
                      href={githubRepoSaved}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#E84C36] hover:underline flex items-center gap-1 mt-1"
                    >
                      View Repository
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {hackathonStatus === "not-started" && (
            <div className="border-2 border-black dark:border-white p-8">
              <h2 className="text-2xl font-black text-black dark:text-white mb-6">
                Contest Rules
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p><strong className="text-black dark:text-white">1. Duration:</strong> 24 hours to complete the challenge.</p>
                <p><strong className="text-black dark:text-white">2. Team Size:</strong> Individual or teams of up to 3 members.</p>
                <p><strong className="text-black dark:text-white">3. Tech Stack:</strong> Use any technology you prefer - web, mobile, or desktop.</p>
                <p><strong className="text-black dark:text-white">4. Original Work:</strong> All code must be written during the hackathon.</p>
                <p><strong className="text-black dark:text-white">5. Public Repository:</strong> Your repo must be public for tracking commits.</p>
                <p><strong className="text-black dark:text-white">6. Submission:</strong> Submit your GitHub repo URL before the deadline.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center pt-8">
            <Link href="/participants" className="w-full sm:w-auto">
              <button className="w-full bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-none hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300">
                View Participants
              </button>
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full sm:w-auto bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-none hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
