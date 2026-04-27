"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { isClient } from "@/lib/utils"

interface Rating {
  creativity: number
  design: number
  similarity: number
  performance: number
  comments: string
}

interface Submission {
  participantId: string
  participantName: string
  githubUrl: string
  submittedAt: string
  ratings?: Rating
}

type StoredParticipant = {
  id: string
  name: string
}

type StoredSubmission = Omit<Submission, "participantName" | "ratings">

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [currentSubmission, setCurrentSubmission] = useState<number | null>(null)
  const [ratings, setRatings] = useState<Rating>({
    creativity: 5,
    design: 5,
    similarity: 5,
    performance: 5,
    comments: "",
  })
  const [resultsPublished, setResultsPublished] = useState(false)

  useEffect(() => {
    if (!isClient()) return

    const storedResults = localStorage.getItem("resultsPublished")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResultsPublished(storedResults === "true")

    const participants = JSON.parse(localStorage.getItem("participants") || "[]") as StoredParticipant[]
    const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]") as StoredSubmission[]

    const storedRatings = JSON.parse(localStorage.getItem("ratings") || "{}") as Record<string, Rating>

    const fullSubmissions: Submission[] = storedSubmissions.map((sub) => {
      const participant = participants.find((p) => p.id === sub.participantId)
      return {
        ...sub,
        participantName: participant?.name || "Unknown",
        ratings: storedRatings[sub.participantId],
      }
    })

    setSubmissions(fullSubmissions)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = localStorage.getItem("adminPassword") || "admin123"
    if (password === adminPassword) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  const handleRate = (field: keyof Rating, value: number) => {
    setRatings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitRating = () => {
    if (currentSubmission === null) return

    const submission = submissions[currentSubmission]
    const allRatings = JSON.parse(localStorage.getItem("ratings") || "{}")
    allRatings[submission.participantId] = ratings
    localStorage.setItem("ratings", JSON.stringify(allRatings))

    const updatedSubmissions = submissions.map((sub, idx) =>
      idx === currentSubmission ? { ...sub, ratings } : sub
    )
    setSubmissions(updatedSubmissions)
    setCurrentSubmission(null)
    setRatings({
      creativity: 5,
      design: 5,
      similarity: 5,
      performance: 5,
      comments: "",
    })
  }

  const handlePublishResults = () => {
    localStorage.setItem("resultsPublished", "true")
    setResultsPublished(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter password to access the judging dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentSubmission !== null) {
    const submission = submissions[currentSubmission]

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Rate Submission</h1>
            <Button variant="outline" onClick={() => setCurrentSubmission(null)}>
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{submission.participantName}</CardTitle>
              <CardDescription>
                Submitted at {new Date(submission.submittedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer">
                  View GitHub Repository
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Judging Criteria</CardTitle>
              <CardDescription>Rate each criteria from 1-10</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Creativity: {ratings.creativity}/10</Label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings.creativity}
                  onChange={(e) => handleRate("creativity", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How innovative and unique is their approach?
                </p>
              </div>

              <div className="space-y-2">
                <Label>Design: {ratings.design}/10</Label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings.design}
                  onChange={(e) => handleRate("design", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How visually appealing and well-designed is the UI?
                </p>
              </div>

              <div className="space-y-2">
                <Label>Similarity: {ratings.similarity}/10</Label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings.similarity}
                  onChange={(e) => handleRate("similarity", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How closely does it match the original iOS app?
                </p>
              </div>

              <div className="space-y-2">
                <Label>Performance: {ratings.performance}/10</Label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings.performance}
                  onChange={(e) => handleRate("performance", parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  How well does it run and function?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments & Feedback</Label>
                <Textarea
                  id="comments"
                  placeholder="Provide detailed feedback for the participant..."
                  value={ratings.comments}
                  onChange={(e) => setRatings({ ...ratings, comments: e.target.value })}
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmitRating} className="w-full" size="lg">
                Submit Rating
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const allRated = submissions.every((s) => s.ratings)
  const totalScores = submissions.map((s) => {
    if (!s.ratings) return { name: s.participantName, score: 0 }
    const total =
      s.ratings.creativity + s.ratings.design + s.ratings.similarity + s.ratings.performance
    return { name: s.participantName, score: total }
  })
  totalScores.sort((a, b) => b.score - a.score)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Judging Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Review submissions and rate each criteria
          </p>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No submissions yet. Waiting for participants...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{submission.participantName}</CardTitle>
                      <CardDescription>
                        Submitted at {new Date(submission.submittedAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant={submission.ratings ? "default" : "secondary"}>
                      {submission.ratings ? "Rated" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild className="flex-1">
                      <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer">
                        View Repository
                      </a>
                    </Button>
                    <Button
                      onClick={() => setCurrentSubmission(index)}
                      className="flex-1"
                      disabled={submission.ratings !== undefined}
                    >
                      {submission.ratings ? "Rated" : "Rate Submission"}
                    </Button>
                  </div>
                  {submission.ratings && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Creativity:</span> {submission.ratings.creativity}/10
                        </div>
                        <div>
                          <span className="font-semibold">Design:</span> {submission.ratings.design}/10
                        </div>
                        <div>
                          <span className="font-semibold">Similarity:</span> {submission.ratings.similarity}/10
                        </div>
                        <div>
                          <span className="font-semibold">Performance:</span> {submission.ratings.performance}/10
                        </div>
                      </div>
                      {submission.ratings.comments && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold">Feedback:</span> {submission.ratings.comments}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {submissions.length > 0 && allRated && !resultsPublished && (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Publish Results</CardTitle>
              <CardDescription>All submissions have been rated. Publish the results now.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handlePublishResults} className="w-full" size="lg">
                Publish Results
              </Button>
            </CardContent>
          </Card>
        )}

        {resultsPublished && (
          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle>Results Published</CardTitle>
              <CardDescription>Results are now visible on the leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">Final Rankings:</h3>
                {totalScores.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span>
                      <Badge variant="outline" className="mr-2">
                        #{index + 1}
                      </Badge>
                      {item.name}
                    </span>
                    <span className="font-bold">{item.score}/40</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
