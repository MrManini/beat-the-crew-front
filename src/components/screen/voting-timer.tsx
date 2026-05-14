'use client'

interface VotingTimerProps {
  secondsLeft: number
  yellow: string
  purple: string
}

export function VotingTimer({ secondsLeft, yellow, purple }: VotingTimerProps) {
  const isUrgent = secondsLeft <= 10
  const progress = secondsLeft / 60

  return (
    <div className="min-h-screen w-full bg-btc-dark flex flex-col items-center justify-center relative overflow-hidden dark-stripe-texture">
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
      {/* Background decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Yellow orb */}
        <div
          className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-btc-yellow/70 blur-[100px]"
          style={{
            animation: "pulseGlow 4s ease-in-out infinite, floatOrb1 10s ease-in-out infinite",
          }}
        />

        {/* Purple orb */}
        <div
          className="absolute -right-32 bottom-1/3 w-96 h-96 rounded-full bg-btc-purple/70 blur-[100px]"
          style={{
            animation: "pulseGlow 4s ease-in-out infinite 1s, floatOrb2 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Contestant names */}
      <div className="flex items-center gap-12 mb-24">
        <span
          className="font-bebas text-7xl tracking-wide"
          style={{ color: '#F5C400', textShadow: '0 0 30px rgba(245,196,0,0.4)' }}
        >
          {yellow.toUpperCase()}
        </span>
        <span className="font-bebas text-5xl text-white/25">VS</span>
        <span
          className="font-bebas text-7xl tracking-wide"
          style={{ color: '#7B2FBE', textShadow: '0 0 30px rgba(123,47,190,0.4)' }}
        >
          {purple.toUpperCase()}
        </span>
      </div>

      {/* Big countdown number */}
      <div className="relative flex items-center justify-center mb-16">
        <svg width="420" height="420" className="absolute">
          <circle
            cx="210" cy="210" r="180"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="210" cy="210" r="180"
            fill="none"
            stroke={isUrgent ? '#FF4444' : '#F5C400'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 180}`}
            strokeDashoffset={`${2 * Math.PI * 180 * (1 - progress)}`}
            transform="rotate(-90 210 210)"
            style={{ 
              transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
              filter: isUrgent 
                ? 'drop-shadow(0 0 8px rgba(255,68,68,0.8))' 
                : 'drop-shadow(0 0 8px rgba(245,196,0,0.6))'
            }}
          />
        </svg>

        <span
          className="font-bebas relative z-10"
          style={{
            fontSize: '14rem',
            lineHeight: 1,
            color: isUrgent ? '#FF4444' : '#ffffff',
            textShadow: isUrgent
              ? '0 0 40px rgba(255,68,68,0.6)'
              : '0 0 40px rgba(255,255,255,0.2)',
            transition: 'color 0.3s ease, text-shadow 0.3s ease',
            minWidth: '300px',
            textAlign: 'center',
          }}
        >
          {secondsLeft}
        </span>
      </div>

      {/* Vote hint */}
      <p className="font-barlow font-bold text-2xl tracking-[0.3em] uppercase text-white/40 mt-8">
        ¡Voten desde sus teléfonos!
      </p>

      {/* Urgency pulse overlay when low */}
      {isUrgent && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{ background: 'radial-gradient(circle at center, rgba(255,68,68,0.06) 0%, transparent 70%)' }}
        />
      )}

      {/* Logo */}
      <img
        src="/images/logo.svg"
        alt="Beat The Crew"
        className="absolute bottom-6 right-6 h-16 opacity-60"
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}