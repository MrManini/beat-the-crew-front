"use client"

import { useState, useEffect, useCallback } from "react"
import { useVotesUpdated } from "@/lib/socket-context"
import {
  getEvent,
  getBracket,
  getVoteTally,
  openVoting,
  closeVoting,
  announceResult,
  rerunBattle,
  forfeitBattle,
} from "@/lib/api"
import { ContestantGroup, type Battle, type Event, type VoteTally } from "@/lib/types"
import { VotingControl } from "./voting-control"
import { RealTimeResults } from "./real-time-results"
import { ScreenControl } from "./screen-control"
import { BracketControl } from "./bracket-control"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

const EVENT_ID = parseInt(process.env.NEXT_PUBLIC_EVENT_ID || "1")

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<ContestantGroup>(ContestantGroup.CREW)
  const [battles, setBattles] = useState<Battle[]>([])
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null)
  const [tally, setTally] = useState<VoteTally>({ yellowVotes: 0, purpleVotes: 0, votingOpen: false })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load event data
  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [eventData, bracketData] = await Promise.all([
        getEvent(EVENT_ID),
        getBracket(EVENT_ID, selectedGroup).catch(() => []),
      ])
      setEvent(eventData)
      setBattles(bracketData)

      // Find active battle
      const active = bracketData.find((b: Battle) => b.votingOpen)
      setActiveBattle(active || null)

      if (active) {
        const tallyData = await getVoteTally(active.id)
        setTally(tallyData)
      }
    } catch (err) {
      console.log("[v0] Failed to load admin data:", err)
      setError("Failed to load data. Make sure the backend is running.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handle real-time vote updates
  const handleVotesUpdated = useCallback((payload: { battleId: number; yellowVotes: number; purpleVotes: number }) => {
    if (activeBattle?.id === payload.battleId) {
      setTally((prev) => ({
        ...prev,
        yellowVotes: payload.yellowVotes,
        purpleVotes: payload.purpleVotes,
      }))
    }
  }, [activeBattle?.id])

  useVotesUpdated(handleVotesUpdated)

  // Battle control handlers
  const handleOpenVoting = async (battleId: number) => {
    try {
      await openVoting(battleId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open voting")
    }
  }

  const handleCloseVoting = async () => {
    if (!activeBattle) return
    try {
      await closeVoting(activeBattle.id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close voting")
    }
  }

  const handleAnnounceResult = async () => {
    if (!activeBattle) return
    try {
      await announceResult(activeBattle.id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to announce result")
    }
  }

  const handleRerun = async () => {
    if (!activeBattle) return
    try {
      await rerunBattle(activeBattle.id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rerun battle")
    }
  }

  const handleForfeit = async (side: "yellow" | "purple") => {
    if (!activeBattle) return
    try {
      await forfeitBattle(activeBattle.id, side)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to forfeit battle")
    }
  }

  const handleSelectWinner = async (battleId: number) => {
    // This is called when clicking a winner in the bracket control
    // It will open voting for that battle
    await handleOpenVoting(battleId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-btc-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-btc-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-btc-dark p-4 md:p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-black text-btc-purple uppercase tracking-wider">
            Panel de Control
          </h1>
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

        {/* Error display */}
        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Voting Control */}
        <VotingControl
          activeBattle={activeBattle}
          tally={tally}
          onOpenVoting={handleOpenVoting}
          onCloseVoting={handleCloseVoting}
          onAnnounceResult={handleAnnounceResult}
          onRerun={handleRerun}
          onForfeit={handleForfeit}
        />

        {/* Real-time Results */}
        <RealTimeResults tally={tally} activeBattle={activeBattle} />

        {/* Screen Control */}
        <ScreenControl />

        {/* Bracket Control */}
        <BracketControl
          battles={battles}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          onSelectBattle={handleSelectWinner}
          activeBattleId={activeBattle?.id || null}
          onRefresh={loadData}
        />
      </div>
    </div>
  )
}
