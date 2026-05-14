"use client"

import { useEffect, useState, useCallback } from "react"
import { SocketProvider, useVotingOpened, useBattleWinner, useBattleTie, useBattleRerun, useBattleForfeit, useSocket, useScreenCommand, useScreenGroupCommand, useVotingTick } from "@/lib/socket-context"
import { getBracket, getActiveBattle, getEvent } from "@/lib/api"
import { ContestantGroup, VotingOpenedPayload, type Battle, type Event } from "@/lib/types"
import { BracketView } from "@/components/screen/bracket-view"
import { LogoView } from "@/components/screen/logo-view"
import { WinnerReveal } from "@/components/screen/winner-reveal"
import { TieReveal } from "@/components/screen/tie-reveal"
import { VotingTimer } from "@/components/screen/voting-timer"

const EVENT_ID = parseInt(process.env.NEXT_PUBLIC_EVENT_ID || "1")

type ScreenMode = "logo" | "bracket" | "winner" | "tie" | "timer"

interface ScreenState {
  mode: ScreenMode
  group: ContestantGroup
  battles: Battle[]
  event: Event | null
  currentYellow?: string,
  currentPurple?: string,
  winnerData?: {
    battleId: number
    winnerId: number
    winnerName: string
    yellowVotes: number
    purpleVotes: number
  }
}

function ScreenApp() {
  const [state, setState] = useState<ScreenState>({
    mode: "logo",
    group: ContestantGroup.CREW,
    battles: [],
    event: null,
  })
  const { isConnected } = useSocket()
  const [currentMode, setCurrentMode] = useState<ScreenMode>('logo')
  const [prevMode, setPrevMode] = useState<ScreenMode | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const switchMode = useCallback((newMode: ScreenMode) => {
    if (newMode === currentMode || isTransitioning) return
    setIsTransitioning(true)
    
    // Change content halfway through the wipe animation (300ms out of 600ms)
    setTimeout(() => {
      setCurrentMode(newMode)
      setPrevMode(null)
    }, 300)
    
    // Finish transitioning after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [currentMode, isTransitioning])

  // Load event and bracket data
  const loadData = useCallback(async () => {
    try {
      const [event, battles] = await Promise.all([
        getEvent(EVENT_ID),
        getBracket(EVENT_ID, state.group),
      ])
      setState((prev) => ({ ...prev, event, battles }))
    } catch (err) {
      console.log("[v0] Failed to load screen data:", err)
    }
  }, [state.group])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Socket event handlers
  const handleVotingTick = useCallback((data: { battleId: number; secondsLeft: number }) => {
    setSecondsLeft(data.secondsLeft)
  }, [])

  const handleVotingOpened = useCallback((data: VotingOpenedPayload) => {
    setState((prev) => ({
      ...prev,
      currentYellow: data.yellow,
      currentPurple: data.purple,
    }))
    console.log(data, state.currentYellow, state.currentPurple)
    setSecondsLeft(30)
    switchMode("timer")
    loadData()
  }, [loadData, switchMode])

  const handleBattleWinner = useCallback((payload: { battleId: number; winnerId: number; winnerName: string; yellowVotes: number; purpleVotes: number }) => {
    setSecondsLeft(null)
    setState((prev) => ({ ...prev, winnerData: payload }))
    switchMode("winner")

/*     setTimeout(() => {
      loadData()
      switchMode("bracket")
      setState((prev) => ({ ...prev, winnerData: undefined }))
    }, 8000) */
  }, [loadData, switchMode])

  const handleBattleTie = useCallback((payload: { battleId: number }) => {
    setSecondsLeft(null)
    setState((prev) => ({ ...prev, mode: "tie" }))
    switchMode("tie")
    setTimeout(() => {
      setState((prev) => ({ ...prev, mode: "bracket" }))
    }, 5000)
  }, [switchMode])

  const handleBattleRerun = useCallback(() => {
    setState((prev) => ({ ...prev, mode: "bracket" }))
    switchMode("bracket")
    loadData()
  }, [loadData, switchMode])

  const handleBattleForfeit = useCallback(() => {
    loadData()
  }, [loadData])

  useVotingTick(handleVotingTick)
  useVotingOpened(handleVotingOpened)
  useBattleWinner(handleBattleWinner)
  useBattleTie(handleBattleTie)
  useBattleRerun(handleBattleRerun)
  useBattleForfeit(handleBattleForfeit)

  // Listen for admin commands via WebSocket
  const handleScreenCommand = useCallback((command: string) => {
    if (command === "show_bracket") {
      switchMode("bracket")
      setState((prev) => ({ ...prev, mode: "bracket" }))
    } else if (command === "show_logo") {
      switchMode("logo")
      setState((prev) => ({ ...prev, mode: "logo" }))
    }
  }, [switchMode])

  const handleScreenGroup = useCallback((group: string) => {
    // Always trigger transition when switching groups
    setIsTransitioning(true)
    setTimeout(() => {
      setState((prev) => ({ ...prev, group: group as ContestantGroup }))
      loadData()
    }, 300)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [loadData])

  useScreenCommand(handleScreenCommand)
  useScreenGroupCommand(handleScreenGroup)

  return (
    <main className="min-h-screen w-full overflow-hidden bg-btc-dark relative">
      <style>{`
        @keyframes wipeRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
      
      {/* Base content */}
      <div className="absolute inset-0">
        <ModeContent mode={currentMode} state={state} secondsLeft={secondsLeft} />
      </div>

      {/* Wipe overlay - purple and yellow stripes */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #eab308 0%, #9333ea 50%, #eab308 100%)',
            backgroundSize: '200% 100%',
            animation: 'wipeRight 0.6s ease-in-out forwards',
            zIndex: 50,
          }}
        />
      )}
    </main>
  )
}

function ModeContent({ mode, state, secondsLeft }: { mode: ScreenMode, state: ScreenState, secondsLeft: number | null }) {
  switch (mode) {
    case 'logo':    return <LogoView eventName={state.event?.name} />
    case 'bracket': return <BracketView battles={state.battles} group={state.group} />
    case 'winner':  return state.winnerData ? <WinnerReveal {...state.winnerData} /> : null
    case 'tie':     return <TieReveal />
    case 'timer':   return <VotingTimer
        secondsLeft={secondsLeft ?? 60}
        yellow={state.currentYellow ?? ''}
        purple={state.currentPurple ?? ''}
      />
  }
}

export default function ScreenPage() {
  return (
    <SocketProvider>
      <ScreenApp />
    </SocketProvider>
  )
}
