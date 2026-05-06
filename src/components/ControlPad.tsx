import { useGameStore, Direction, SkillId, SKILL_DEFINITIONS } from '@/store/gameStore'

const SKILL_BTNS: { id: SkillId; icon: string; name: string }[] = [
  { id: 'fireball', icon: '🔥', name: '火球' },
  { id: 'ghost', icon: '👻', name: '幽灵' },
  { id: 'magnetBurst', icon: '💫', name: '磁力' },
  { id: 'slowField', icon: '❄', name: '减速' },
]

export default function ControlPad() {
  const setDirection = useGameStore(s => s.setDirection)
  const activateSkill = useGameStore(s => s.activateSkill)
  const state = useGameStore(s => s.state)
  const skills = useGameStore(s => s.skills)
  const startGame = useGameStore(s => s.startGame)
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)

  if (state === 'idle') {
    return (
      <div className="md:hidden mt-4 flex flex-col items-center gap-3 select-none">
        <button
          onTouchStart={(e) => { e.preventDefault(); startGame(1) }}
          className="font-orbitron text-base px-10 py-3.5 border-2 border-neon-green text-neon-green
            rounded-lg active:bg-neon-green/20 active:scale-95
            transition-all duration-200 tracking-widest touch-manipulation"
        >
          START
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); useGameStore.getState().showLevelSelect() }}
          className="font-orbitron text-xs px-6 py-2 border border-neon-cyan/40 text-neon-cyan/70
            rounded-lg active:bg-neon-cyan/20 active:scale-95
            transition-all duration-200 tracking-widest touch-manipulation"
        >
          关卡选择
        </button>
      </div>
    )
  }

  if (state === 'gameover') {
    return (
      <div className="md:hidden mt-4 flex flex-col items-center gap-3 select-none">
        <button
          onTouchStart={(e) => { e.preventDefault(); startGame(useGameStore.getState().levelConfig.id) }}
          className="font-orbitron text-base px-10 py-3.5 border-2 border-neon-green text-neon-green
            rounded-lg active:bg-neon-green/20 active:scale-95
            transition-all duration-200 tracking-widest touch-manipulation"
        >
          RETRY
        </button>
      </div>
    )
  }

  if (state !== 'playing' && state !== 'paused') return null

  const activeSkillIds = skills.filter(s => s.charge > 0 && s.remainingCooldown <= 0 && SKILL_DEFINITIONS[s.id].type === 'active').map(s => s.id)
  const hasSkills = activeSkillIds.length > 0

  return (
    <div className="md:hidden mt-2 w-full px-2 select-none">
      <div className="flex items-center justify-between max-w-[400px] mx-auto">
        <div className="flex flex-col items-center gap-1">
          <button
            onTouchStart={(e) => {
              e.preventDefault()
              if (state === 'playing') pauseGame()
              else resumeGame()
            }}
            className="font-rajdhani text-xs px-4 py-1 border border-neon-yellow/30 text-neon-yellow/70
              rounded-md active:bg-neon-yellow/20 transition-all duration-200 touch-manipulation"
          >
            {state === 'playing' ? '暂停' : '继续'}
          </button>

          <div className="grid grid-cols-3 grid-rows-3 gap-1" style={{ width: '160px', height: '160px' }}>
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); setDirection('UP') }}
              className="flex items-center justify-center bg-neon-surface/90 border-2 border-neon-green/30
                rounded-xl text-neon-green text-2xl active:bg-neon-green/30 active:scale-90
                transition-all duration-75 select-none touch-manipulation"
              style={{ aspectRatio: '1/1' }}
            >
              ▲
            </button>
            <div />

            <button
              onTouchStart={(e) => { e.preventDefault(); setDirection('LEFT') }}
              className="flex items-center justify-center bg-neon-surface/90 border-2 border-neon-green/30
                rounded-xl text-neon-green text-2xl active:bg-neon-green/30 active:scale-90
                transition-all duration-75 select-none touch-manipulation"
              style={{ aspectRatio: '1/1' }}
            >
              ◄
            </button>
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-neon-green/15 border border-neon-green/20" />
            </div>
            <button
              onTouchStart={(e) => { e.preventDefault(); setDirection('RIGHT') }}
              className="flex items-center justify-center bg-neon-surface/90 border-2 border-neon-green/30
                rounded-xl text-neon-green text-2xl active:bg-neon-green/30 active:scale-90
                transition-all duration-75 select-none touch-manipulation"
              style={{ aspectRatio: '1/1' }}
            >
              ►
            </button>

            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); setDirection('DOWN') }}
              className="flex items-center justify-center bg-neon-surface/90 border-2 border-neon-green/30
                rounded-xl text-neon-green text-2xl active:bg-neon-green/30 active:scale-90
                transition-all duration-75 select-none touch-manipulation"
              style={{ aspectRatio: '1/1' }}
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        <div className="flex-1 min-w-[80px]" />

        {hasSkills && (
          <div className="flex flex-col items-center gap-2 pt-8">
            {SKILL_BTNS.filter(s => activeSkillIds.includes(s.id)).map(btn => (
              <button
                key={btn.id}
                onTouchStart={(e) => { e.preventDefault(); activateSkill(btn.id) }}
                className="w-14 h-14 flex flex-col items-center justify-center bg-neon-surface/90 border border-neon-yellow/30
                  rounded-lg active:bg-neon-yellow/25 active:scale-90
                  transition-all duration-75 select-none touch-manipulation shadow-lg"
                style={{ boxShadow: '0 4px 15px rgba(255, 230, 0, 0.2)' }}
              >
                <span className="text-lg leading-none">{btn.icon}</span>
                <span className="font-rajdhani text-[9px] text-neon-yellow/70 leading-none mt-0.5">{btn.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (orientation: landscape) {
          .md\\:hidden.max-w-\\[400px\\] {
            max-width: 100%;
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  )
}
