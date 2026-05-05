import { useGameStore, Direction } from '@/store/gameStore'

const DIRS: { dir: Direction; icon: string }[] = [
  { dir: 'UP', icon: '▲' },
  { dir: 'LEFT', icon: '◄' },
  { dir: 'DOWN', icon: '▼' },
  { dir: 'RIGHT', icon: '►' },
]

export default function ControlPad() {
  const setDirection = useGameStore(s => s.setDirection)
  const state = useGameStore(s => s.state)

  if (state !== 'playing' && state !== 'paused') return null

  return (
    <div className="md:hidden mt-3 flex justify-center select-none">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5" style={{ width: '180px', height: '180px' }}>
        <div />
        <button
          onTouchStart={(e) => { e.preventDefault(); setDirection('UP') }}
          className="flex items-center justify-center bg-neon-surface/80 border border-neon-green/30
            rounded-xl text-neon-green text-2xl active:bg-neon-green/25 active:scale-90
            transition-all duration-75 select-none touch-manipulation"
        >
          ▲
        </button>
        <div />

        <button
          onTouchStart={(e) => { e.preventDefault(); setDirection('LEFT') }}
          className="flex items-center justify-center bg-neon-surface/80 border border-neon-green/30
            rounded-xl text-neon-green text-2xl active:bg-neon-green/25 active:scale-90
            transition-all duration-75 select-none touch-manipulation"
        >
          ◄
        </button>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-neon-green/15 border border-neon-green/20" />
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); setDirection('RIGHT') }}
          className="flex items-center justify-center bg-neon-surface/80 border border-neon-green/30
            rounded-xl text-neon-green text-2xl active:bg-neon-green/25 active:scale-90
            transition-all duration-75 select-none touch-manipulation"
        >
          ►
        </button>

        <div />
        <button
          onTouchStart={(e) => { e.preventDefault(); setDirection('DOWN') }}
          className="flex items-center justify-center bg-neon-surface/80 border border-neon-green/30
            rounded-xl text-neon-green text-2xl active:bg-neon-green/25 active:scale-90
            transition-all duration-75 select-none touch-manipulation"
        >
          ▼
        </button>
        <div />
      </div>
    </div>
  )
}
