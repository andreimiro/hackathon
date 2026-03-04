"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { isClient } from "@/lib/utils"

interface Participant {
  id: string
  name: string
  githubUrl: string
  status: "working" | "submitted"
  submittedAt?: string
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    if (!isClient()) return

    const stored = localStorage.getItem("participants")
    if (stored) {
      setParticipants(JSON.parse(stored))
    } else {
      // Initialize with placeholder participants
      const initial: Participant[] = [
        { id: "1", name: "Participant 1", githubUrl: "", status: "working" },
        { id: "2", name: "Participant 2", githubUrl: "", status: "working" },
      ]
      setParticipants(initial)
      localStorage.setItem("participants", JSON.stringify(initial))
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Participants</h1>
          <p className="text-xl text-muted-foreground">
            Track the progress of our competing developers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {participants.map((participant) => (
            <Card key={participant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{participant.name}</CardTitle>
                  <Badge variant={participant.status === "submitted" ? "default" : "secondary"}>
                    {participant.status}
                  </Badge>
                </div>
                <CardDescription>
                  {participant.status === "submitted"
                    ? `Submitted at ${new Date(participant.submittedAt!).toLocaleString()}`
                    : "Still working on their submission"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {participant.githubUrl ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">GitHub Repository:</p>
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={participant.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {participant.status === "submitted"
                      ? "Repository URL pending"
                      : "No submission yet"}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
