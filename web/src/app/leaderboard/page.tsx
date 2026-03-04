"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { isClient } from "@/lib/utils"

interface ParticipantResult {
  name: string
  githubUrl: string
  creativity: number
  design: number
  similarity: number
  performance: number
  total: number
}

export default function LeaderboardPage() {
  const [results, setResults] = useState<ParticipantResult[]>([])
  const [resultsPublished, setResultsPublished] = useState(false)

  useEffect(() => {
    if (!isClient()) return

    const published = localStorage.getItem("resultsPublished")
    setResultsPublished(published === "true")

    const participants = JSON.parse(localStorage.getItem("participants") || "[]")
    const ratings = JSON.parse(localStorage.getItem("ratings") || "{}")

    const participantResults: ParticipantResult[] = participants
      .filter((p: any) => p.status === "submitted" && ratings[p.id])
      .map((p: any) => {
        const rating = ratings[p.id]
        const total = rating.creativity + rating.design + rating.similarity + rating.performance
        return {
          name: p.name,
          githubUrl: p.githubUrl,
          creativity: rating.creativity,
          design: rating.design,
          similarity: rating.similarity,
          performance: rating.performance,
          total,
        }
      })

    participantResults.sort((a, b) => b.total - a.total)
    setResults(participantResults)
  }, [])

  if (!resultsPublished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <h1 className="text-4xl font-bold">Results Coming Soon</h1>
              <p className="text-xl text-muted-foreground">
                The judging is in progress. Results will be published here once all submissions have been rated.
              </p>
              <p className="text-sm text-muted-foreground">
                Check back later or ask the organizers for updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <h1 className="text-4xl font-bold">No Results Yet</h1>
              <p className="text-xl text-muted-foreground">
                Results have been published but no rated submissions are available.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const winner = results[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">🏆 Hackathon Results</h1>
          <p className="text-xl text-muted-foreground">
            See how each participant performed in the competition
          </p>
        </div>

        {/* Winner Announcement */}
        <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <CardTitle className="text-3xl">Winner</CardTitle>
            <CardDescription>
              Congratulations to {winner.name} for winning the hackathon!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
              {winner.total}/40
            </div>
            <Button asChild variant="outline" size="lg">
              <a href={winner.githubUrl} target="_blank" rel="noopener noreferrer">
                View Winning Project
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Final Rankings</h2>
          {results.map((result, index) => (
            <Card key={index} className={index === 0 ? "border-2 border-yellow-500" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-lg px-3 py-1">
                      #{index + 1}
                    </Badge>
                    <div>
                      <CardTitle>{result.name}</CardTitle>
                      <CardDescription>
                        {index === 0 ? "🏆 Winner" : index === 1 ? "🥈 2nd Place" : index === 2 ? "🥉 3rd Place" : ""}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{result.total}/40</div>
                    <Button variant="link" asChild size="sm">
                      <a href={result.githubUrl} target="_blank" rel="noopener noreferrer">
                        View Project
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Creativity</span>
                      <span>{result.creativity}/10</span>
                    </div>
                    <Progress value={result.creativity * 10} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Design</span>
                      <span>{result.design}/10</span>
                    </div>
                    <Progress value={result.design * 10} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Similarity</span>
                      <span>{result.similarity}/10</span>
                    </div>
                    <Progress value={result.similarity * 10} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{result.performance}/10</span>
                    </div>
                    <Progress value={result.performance * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
