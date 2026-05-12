"use client"

import { useEffect, useState } from "react"

interface WinnerRevealProps {
  winnerName: string
  yellowVotes: number
  purpleVotes: number
}

export function WinnerReveal({ winnerName, yellowVotes, purpleVotes }: WinnerRevealProps) {
  const [showStats, setShowStats] = useState(false)
  const total = yellowVotes + purpleVotes
  const yellowPercent = total > 0 ? Math.round((yellowVotes / total) * 100) : 50
  const purplePercent = total > 0 ? Math.round((purpleVotes / total) * 100) : 50

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen w-full bg-btc-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-4 border-btc-yellow/20 rounded-full animate-radiate"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(234,179,8,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Winner label */}
        <p className="text-3xl md:text-4xl text-muted-foreground uppercase tracking-[0.5em] animate-pulse">
          Ganador
        </p>

        {/* Winner name with dramatic reveal */}
        <h1
          className="text-6xl md:text-9xl font-black text-btc-yellow uppercase tracking-tight animate-in zoom-in-50 duration-1000"
        >
          {winnerName}
        </h1>

        {/* Vote statistics */}
        {showStats && (
          <div className="w-full max-w-2xl space-y-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Vote bar */}
            <div className="flex h-16 rounded-xl overflow-hidden shadow-2xl">
              <div
                className="bg-btc-yellow flex items-center justify-center transition-all duration-1000"
                style={{ width: `${yellowPercent}%` }}
              >
                <span className="text-btc-dark font-black text-2xl">{yellowPercent}%</span>
              </div>
              <div
                className="bg-btc-purple flex items-center justify-center transition-all duration-1000"
                style={{ width: `${purplePercent}%` }}
              >
                <span className="text-foreground font-black text-2xl">{purplePercent}%</span>
              </div>
            </div>
            
            {/* Vote counts */}
            <div className="flex justify-between text-xl text-muted-foreground px-4">
              <span className="text-btc-yellow font-bold">{yellowVotes} votos</span>
              <span className="text-btc-purple font-bold">{purpleVotes} votos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
