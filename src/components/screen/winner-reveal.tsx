"use client"

import { useEffect, useState } from "react"

interface WinnerRevealProps {
  winnerName: string
  yellowVotes: number
  purpleVotes: number
}

export function WinnerReveal({ winnerName, yellowVotes, purpleVotes }: WinnerRevealProps) {
  let color = "yellow"
  let radialColor = "rgb(234,179,8,0.2)"
  if (purpleVotes > yellowVotes) {
    color = "purple";
    radialColor = "rgb(123,47,190,0.2)";
  }

  return (
    <div className="min-h-screen w-full bg-btc-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background layer */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url('/images/tv-background.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 border-4 border-btc-${color}/20 rounded-full animate-radiate`}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${radialColor} 0%, transparent 70%)`,
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
          className={`text-6xl md:text-9xl font-black text-btc-${color} uppercase tracking-tight animate-in zoom-in-50 duration-1000`}
        >
          {winnerName}
        </h1>
      </div>
    </div>
  )
}
