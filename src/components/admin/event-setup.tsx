"use client"

import { useState } from "react"
import { ContestantGroup } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"

interface EventSetupProps {
  onCreateEvent: (eventName: string) => Promise<void>
  onLogout: () => void
}

export function EventSetup({ onCreateEvent, onLogout }: EventSetupProps) {
  const [eventName, setEventName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      setError("Event name cannot be empty")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await onCreateEvent(eventName)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-btc-dark p-4 md:p-6 relative overflow-hidden flex items-center justify-center">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-btc-purple uppercase tracking-wider">Beat The Crew</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-btc-purple">Create New Event</CardTitle>
            <CardDescription>Start by creating a new event for the competition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                placeholder="Beat the Crew 2026"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateEvent()}
                disabled={isLoading}
                className="bg-input border-border"
              />
            </div>

            <Button
              onClick={handleCreateEvent}
              disabled={isLoading || !eventName.trim()}
              className="w-full bg-btc-yellow text-btc-dark hover:bg-btc-yellow-light font-semibold"
            >
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}