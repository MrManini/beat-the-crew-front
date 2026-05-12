"use client"

import { ContestantGroup, type Battle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

interface BracketControlProps {
  battles: Battle[]
  selectedGroup: ContestantGroup
  onGroupChange: (group: ContestantGroup) => void
  onSelectBattle: (battleId: number) => void
  activeBattleId: number | null
  onRefresh: () => void
}

// Helper to get round name
function getRoundName(round: number, totalRounds: number): string {
  const roundsFromFinal = totalRounds - round
  switch (roundsFromFinal) {
    case 0:
      return "FINAL"
    case 1:
      return "SEMI"
    case 2:
      return "CUARTOS"
    case 3:
      return "OCTAVOS"
    default:
      return `RONDA ${round}`
  }
}

interface BattleRowProps {
  battle: Battle
  index: number
  roundName: string
  isActive: boolean
  onSelect: () => void
}

function BattleRow({ battle, index, roundName, isActive, onSelect }: BattleRowProps) {
  const yellowName = battle.yellowContestant?.name || "TBD"
  const purpleName = battle.purpleContestant?.name || "TBD"
  const winnerId = battle.winnerId
  const hasWinner = winnerId !== null
  const isYellowWinner = winnerId === battle.yellowContestantId
  const canStartVoting = battle.yellowContestantId && battle.purpleContestantId && !hasWinner

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${
        isActive ? "bg-btc-purple/20 border border-btc-purple" : "bg-btc-dark"
      }`}
    >
      {/* Position number */}
      <span className="text-muted-foreground text-sm w-6">{index + 1}.</span>

      {/* Yellow contestant */}
      <div
        className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold uppercase ${
          hasWinner
            ? isYellowWinner
              ? "bg-btc-yellow text-btc-dark"
              : "bg-btc-yellow/20 text-btc-yellow/50"
            : "bg-btc-yellow/30 text-btc-yellow"
        }`}
      >
        {yellowName}
      </div>

      {/* VS */}
      <span className="text-muted-foreground text-xs">vs</span>

      {/* Purple contestant */}
      <div
        className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold uppercase ${
          hasWinner
            ? !isYellowWinner
              ? "bg-btc-purple text-foreground"
              : "bg-btc-purple/20 text-btc-purple/50"
            : "bg-btc-purple/30 text-btc-purple"
        }`}
      >
        {purpleName}
      </div>

      {/* Winner indicator or action button */}
      {hasWinner ? (
        <span className="text-xs text-muted-foreground w-24 text-right">
          {"✓ "}
          {isYellowWinner ? yellowName : purpleName}
        </span>
      ) : canStartVoting ? (
        <Button
          onClick={onSelect}
          disabled={isActive}
          size="sm"
          variant="ghost"
          className="text-xs text-btc-yellow hover:text-btc-dark hover:bg-btc-yellow w-24"
        >
          {isActive ? "En curso" : "Iniciar"}
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground w-24 text-right">Pendiente</span>
      )}
    </div>
  )
}

export function BracketControl({
  battles,
  selectedGroup,
  onGroupChange,
  onSelectBattle,
  activeBattleId,
  onRefresh,
}: BracketControlProps) {
  // Organize battles by round
  const battlesByRound = new Map<number, Battle[]>()
  battles.forEach((battle) => {
    if (!battlesByRound.has(battle.round)) {
      battlesByRound.set(battle.round, [])
    }
    battlesByRound.get(battle.round)!.push(battle)
  })

  const rounds = Array.from(battlesByRound.keys()).sort((a, b) => a - b)
  const totalRounds = rounds.length

  // Get first round battles (the ones with most matchups)
  const firstRound = rounds[0] || 1
  const firstRoundBattles = battlesByRound.get(firstRound) || []

  return (
    <Card className="bg-btc-dark-lighter border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-foreground text-sm uppercase tracking-wider">
          Control del Bracket
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Group tabs */}
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => onGroupChange(ContestantGroup.CREW)}
              className={`px-3 py-1 text-xs uppercase ${
                selectedGroup === ContestantGroup.CREW
                  ? "bg-btc-yellow text-btc-dark"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Crew
            </button>
            <button
              onClick={() => onGroupChange(ContestantGroup.INVITED)}
              className={`px-3 py-1 text-xs uppercase ${
                selectedGroup === ContestantGroup.INVITED
                  ? "bg-btc-purple text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Invitados
            </button>
          </div>
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Round label */}
        {firstRoundBattles.length > 0 && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {getRoundName(firstRound, totalRounds)}
          </p>
        )}

        {/* Battle rows */}
        {battles.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay bracket generado para este grupo
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {battles
              .sort((a, b) => a.round - b.round || a.position - b.position)
              .map((battle, index) => (
                <BattleRow
                  key={battle.id}
                  battle={battle}
                  index={index}
                  roundName={getRoundName(battle.round, totalRounds)}
                  isActive={battle.id === activeBattleId}
                  onSelect={() => onSelectBattle(battle.id)}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
