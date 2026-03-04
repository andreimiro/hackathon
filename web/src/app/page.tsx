"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { isClient } from "@/lib/utils"

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!isClient()) return

    setMounted(true)
    const endTime = localStorage.getItem("hackathonEndTime")
    let targetTime: number

    if (endTime) {
      targetTime = parseInt(endTime)
    } else {
      const now = Date.now()
      targetTime = now + 24 * 60 * 60 * 1000 // 24 hours from now
      localStorage.setItem("hackathonEndTime", targetTime.toString())
    }

    const timer = setInterval(() => {
      const now = Date.now()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const criteria = [
    { name: "Creativity", description: "How innovative and unique is your approach?" },
    { name: "Design", description: "How visually appealing and well-designed is the UI?" },
    { name: "Similarity", description: "How closely does it match the original iOS app?" },
    { name: "Performance", description: "How well does it run and function?" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Iteration #1
          </Badge>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Vibecoding Hackathon
          </h1>
          <p className="text-xl text-muted-foreground">
            24 hours to recreate an iOS app. No rules, just pure creativity.
          </p>
        </div>

        {/* Countdown Timer */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Time Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 text-center">
              <div className="bg-muted rounded-lg p-4 min-w-[100px]">
                <div className="text-4xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-muted rounded-lg p-4 min-w-[100px]">
                <div className="text-4xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-muted rounded-lg p-4 min-w-[100px]">
                <div className="text-4xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Judging Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Judging Criteria</CardTitle>
            <CardDescription>Your submissions will be evaluated on these four categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {criteria.map((criterion) => (
                <div key={criterion.name} className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-500">●</span>
                    {criterion.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{criterion.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Get Started</h3>
                <p className="text-sm text-muted-foreground">Clone the repository and check out the STARTER.md for setup instructions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Build Your App</h3>
                <p className="text-sm text-muted-foreground">Choose any tech stack and recreate the selected iOS app in 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Submit Your Work</h3>
                <p className="text-sm text-muted-foreground">Make your repo public and submit the URL before the deadline</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold">Judging & Results</h3>
                <p className="text-sm text-muted-foreground">Judges evaluate submissions and results are announced on the leaderboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/participants">View Participants</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/submit">Submit Project</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/leaderboard">View Results</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
