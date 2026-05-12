"use client"

import Image from "next/image"

interface LogoViewProps {
  eventName?: string
}

export function LogoView({ eventName }: LogoViewProps) {
  const eventDate = "19 DE MAYO DE 2026"

  return (
    <div className="min-h-screen w-full bg-btc-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Yellow orb - left */}
        <div className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-btc-yellow/30 blur-[100px] animate-pulse-glow" />
        {/* Purple orb - right */}
        <div
          className="absolute -right-32 bottom-1/3 w-96 h-96 rounded-full bg-btc-purple/30 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Dark overlay pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <div className="w-[600px] max-w-[90vw]">
          <Image
            src="/images/logo.svg"
            alt="Beat The Crew - Dance Battle UNC"
            width={600}
            height={255}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Event Date */}
        <p className="text-2xl md:text-3xl font-medium text-foreground/80 uppercase tracking-[0.3em]">
          {eventDate}
        </p>
      </div>
    </div>
  )
}
