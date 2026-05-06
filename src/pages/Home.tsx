import { useEffect } from 'react'
import { useGameEngine } from '@/hooks/useGameEngine'
import { useGameStore } from '@/store/gameStore'
import StartScreen from '@/components/StartScreen'
import GameCanvas from '@/components/GameCanvas'
import ScorePanel from '@/components/ScorePanel'
import ControlPad from '@/components/ControlPad'
import GameOverModal from '@/components/GameOverModal'
import LeaderboardModal from '@/components/LeaderboardModal'
import LevelSelect from '@/components/LevelSelect'
import LevelInfo from '@/components/LevelInfo'
import SkillBar from '@/components/SkillBar'
import StatusPanel from '@/components/StatusPanel'
import LevelTransition from '@/components/LevelTransition'

export default function Home() {
  const { canvasRef, state } = useGameEngine()
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)

  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const isButton = target.closest('button') || target.closest('[touch-manipulation]')
      if (!isButton) e.preventDefault()
    }
    document.addEventListener('touchstart', prevent, { passive: false })
    document.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      document.removeEventListener('touchstart', prevent)
      document.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-neon-dark bg-grid-pattern flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none scanline" />

      <div className="relative z-10 flex flex-col items-center gap-0.5 sm:gap-2 w-full max-w-[640px]">
        <div className="w-full flex items-center justify-between mb-0.5 px-1">
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron text-[10px] sm:text-sm font-bold text-neon-green/60 tracking-[0.2em] sm:tracking-[0.3em]">
              NEON SNAKE
            </h1>
            <LevelInfo />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LeaderboardModal />
            {state === 'playing' && (
              <button
                onClick={pauseGame}
                className="hidden sm:block font-rajdhani text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 border border-neon-yellow/30 text-neon-yellow/70
                  rounded-md hover:bg-neon-yellow/10 hover:text-neon-yellow active:bg-neon-yellow/20
                  transition-all duration-300 tracking-wider touch-manipulation"
              >
                暂停
              </button>
            )}
            {state === 'paused' && (
              <button
                onClick={resumeGame}
                className="hidden sm:block font-rajdhani text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 border border-neon-green/30 text-neon-green/70
                  rounded-md hover:bg-neon-green/10 hover:text-neon-green active:bg-neon-green/20
                  transition-all duration-300 tracking-wider touch-manipulation"
              >
                继续
              </button>
            )}
          </div>
        </div>

        <ScorePanel />

        <div className="relative w-full flex justify-center">
          <GameCanvas canvasRef={canvasRef} />

          {state === 'idle' && <StartScreen />}
          {state === 'gameover' && <GameOverModal />}
          {state === 'levelSelect' && <LevelSelect />}
          {state === 'levelTransition' && <LevelTransition />}

          {state === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm rounded-lg">
              <div className="text-center animate-slide-up">
                <h2 className="font-orbitron text-3xl sm:text-4xl font-black text-neon-yellow tracking-widest mb-3"
                  style={{ textShadow: '0 0 20px #ffe600, 0 0 40px #ffe600' }}>
                  PAUSED
                </h2>
                <p className="font-rajdhani text-sm text-gray-400">
                  按 ESC / P 或点击继续
                </p>
              </div>
            </div>
          )}
        </div>

        <StatusPanel />
        <SkillBar />

        <ControlPad />

        <div className="hidden md:flex items-center gap-4 mt-1 font-rajdhani text-xs text-gray-600">
          <span>↑↓←→ / WASD 控制方向</span>
          <span>·</span>
          <span>ESC / P 暂停</span>
          <span>·</span>
          <span>空格 开始</span>
          <span>·</span>
          <span>Q 火球 E 幽灵 R 磁力 F 减速</span>
        </div>
      </div>
    </div>
  )
}
