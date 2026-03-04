"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { isClient } from "@/lib/utils"

interface Submission {
  participantId: string
  githubUrl: string
  submittedAt: string
}

export default function SubmitPage() {
  const [selectedParticipant, setSelectedParticipant] = useState<string>("")
  const [githubUrl, setGithubUrl] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [availableParticipants, setAvailableParticipants] = useState<any[]>([])

  useEffect(() => {
    if (!isClient()) return

    const stored = localStorage.getItem("participants")
    if (stored) {
      const participants = JSON.parse(stored)
      const workingParticipants = participants.filter((p: any) => p.status === "working")
      setAvailableParticipants(workingParticipants)

      if (workingParticipants.length === 0) {
        setMessage({
          type: "error",
          text: "No participants available for submission. All participants have submitted.",
        })
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedParticipant || !githubUrl) {
      setMessage({ type: "error", text: "Please select a participant and enter your GitHub URL" })
      return
    }

    // Validate GitHub URL
    try {
      const url = new URL(githubUrl)
      if (!url.hostname.includes("github.com")) {
        setMessage({ type: "error", text: "Please enter a valid GitHub repository URL" })
        return
      }
    } catch {
      setMessage({ type: "error", text: "Please enter a valid URL" })
      return
    }

    // Update participant status
    const stored = localStorage.getItem("participants")
    if (stored) {
      const participants = JSON.parse(stored)
      const updatedParticipants = participants.map((p: any) => {
        if (p.id === selectedParticipant) {
          return {
            ...p,
            status: "submitted",
            githubUrl,
            submittedAt: new Date().toISOString(),
          }
        }
        return p
      })
      localStorage.setItem("participants", JSON.stringify(updatedParticipants))

      // Store submission
      const submissions: Submission[] = JSON.parse(localStorage.getItem("submissions") || "[]")
      submissions.push({
        participantId: selectedParticipant,
        githubUrl,
        submittedAt: new Date().toISOString(),
      })
      localStorage.setItem("submissions", JSON.stringify(submissions))

      setMessage({
        type: "success",
        text: "Submission successful! Good luck! 🚀",
      })
      setSelectedParticipant("")
      setGithubUrl("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Submit Your Project</h1>
          <p className="text-xl text-muted-foreground">
            Make your repository public and submit the URL before the deadline
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {availableParticipants.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Submission Form</CardTitle>
              <CardDescription>
                Submit your GitHub repository URL to complete your hackathon entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="participant">Select Your Name</Label>
                  <select
                    id="participant"
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    className="w-full p-3 border rounded-md bg-background"
                    required
                  >
                    <option value="">Choose a participant...</option>
                    {availableParticipants.map((participant: any) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Repository URL</Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Make sure your repository is set to public before submitting
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Project
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Submission Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                Repository is set to public
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                README with setup instructions
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                App is functional and can be tested
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">✓</Badge>
                Submitted before the 24-hour deadline
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
