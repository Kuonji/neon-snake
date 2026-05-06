import { useGameStore, LEVEL_CONFIGS, LevelType } from '@/store/gameStore'

const LEVEL_TYPE_NAMES: Record<LevelType, string> = {
  classic: '经典',
  timedSurvival: '限时生存',
  bounty: '赏金',
  spaceEscape: '太空逃亡',
  challenge: '挑战',
}

export default function LevelInfo() {
  const state = useGameStore(s => s.state)
  const levelConfig = useGameStore(s => s.levelConfig)
  const score = useGameStore(s => s.score)
  const timeRemaining = useGameStore(s => s.timeRemaining)

  if (state !== 'playing' && state !== 'paused') return null

  const progress = Math.min(score / levelConfig.targetScore, 1) * 100

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5">
        <span className="font-orbitron text-[10px] sm:text-xs text-neon-cyan/50 tracking-widest">
          LV.{levelConfig.id}
        </span>
        <span className="font-rajdhani text-[10px] sm:text-xs text-gray-500">
          {LEVEL_TYPE_NAMES[levelConfig.type]}
        </span>
      </div>
      <div className="w-16 sm:w-24 h-1.5 bg-neon-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-300"
          style={{ width: `${Math.max(2, progress)}%` }}
        />
      </div>
      <span className="font-orbitron text-[9px] sm:text-[10px] text-gray-500">
        {score}/{levelConfig.targetScore}
      </span>
      {timeRemaining !== null && (
        <span className={`font-orbitron text-[10px] sm:text-xs ${timeRemaining < 30 ? 'text-neon-pink animate-pulse-neon' : 'text-neon-yellow/60'}`}>
          {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
        </span>
      )}
    </div>
  )
}
