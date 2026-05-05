import { useGameStore, MAX_LEVEL, BASE_SPEED, MIN_SPEED } from '@/store/gameStore'

export default function ScorePanel() {
  const score = useGameStore(s => s.score)
  const highScore = useGameStore(s => s.highScore)
  const level = useGameStore(s => s.level)
  const speed = useGameStore(s => s.speed)
  const state = useGameStore(s => s.state)

  const speedPercent = ((BASE_SPEED - speed) / (BASE_SPEED - MIN_SPEED)) * 100

  return (
    <div className="w-full max-w-[600px] flex items-center justify-between px-2 py-1.5 sm:py-3 font-rajdhani">
      <div className="flex items-center gap-3 sm:gap-6">
        <div>
          <div className="text-[10px] sm:text-xs text-neon-green/50 uppercase tracking-widest font-orbitron">
            Score
          </div>
          <div className="font-orbitron text-lg sm:text-2xl font-bold text-neon-green text-glow-green">
            {String(score).padStart(4, '0')}
          </div>
        </div>

        <div className="w-px h-6 sm:h-8 bg-neon-green/20" />

        <div>
          <div className="text-[10px] sm:text-xs text-neon-pink/50 uppercase tracking-widest font-orbitron">
            Best
          </div>
          <div className="font-orbitron text-lg sm:text-2xl font-bold text-neon-pink text-glow-pink">
            {String(highScore).padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right">
          <div className="text-[10px] sm:text-xs text-neon-cyan/50 uppercase tracking-widest font-orbitron">
            Level
          </div>
          <div className="font-orbitron text-lg sm:text-2xl font-bold text-neon-cyan text-glow-cyan">
            {level}/{MAX_LEVEL}
          </div>
        </div>

        <div className="w-14 sm:w-20 hidden sm:block">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-orbitron mb-1">
            Speed
          </div>
          <div className="h-1.5 bg-neon-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, speedPercent)}%` }}
            />
          </div>
        </div>

        {state === 'paused' && (
          <div className="font-orbitron text-xs sm:text-sm text-neon-yellow animate-pulse-neon tracking-widest">
            PAUSED
          </div>
        )}
      </div>
    </div>
  )
}
