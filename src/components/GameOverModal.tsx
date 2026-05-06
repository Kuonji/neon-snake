import { useGameStore, LEVEL_CONFIGS, LevelType } from '@/store/gameStore'

const LEVEL_TYPE_NAMES: Record<LevelType, string> = {
  classic: '经典',
  timedSurvival: '限时生存',
  bounty: '赏金',
  spaceEscape: '太空逃亡',
  challenge: '挑战',
}

export default function GameOverModal() {
  const state = useGameStore(s => s.state)
  const score = useGameStore(s => s.score)
  const highScore = useGameStore(s => s.highScore)
  const level = useGameStore(s => s.level)
  const levelConfig = useGameStore(s => s.levelConfig)
  const levelProgress = useGameStore(s => s.levelProgress)
  const combo = useGameStore(s => s.combo)
  const startGame = useGameStore(s => s.startGame)

  if (state !== 'gameover') return null

  const isNewHighScore = score === highScore && score > 0
  const isLevelCleared = score >= levelConfig.targetScore
  const nextLevel = LEVEL_CONFIGS.find(l => l.id === levelConfig.id + 1)
  const nextUnlocked = nextLevel && levelProgress.unlockedLevels.includes(nextLevel.id)

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-neon-surface border-2 border-neon-pink/40 rounded-xl p-6 sm:p-8 max-w-sm w-full mx-4 border-glow-pink animate-slide-up">
        <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-neon-pink text-glow-pink text-center mb-5 tracking-wider">
          GAME OVER
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center px-3 py-2 bg-neon-dark/50 rounded-lg">
            <span className="font-rajdhani text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              本局分数
            </span>
            <span className="font-orbitron text-xl sm:text-2xl font-bold text-neon-green text-glow-green">
              {score}
            </span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-neon-dark/50 rounded-lg">
            <span className="font-rajdhani text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              最高纪录
            </span>
            <span className="font-orbitron text-xl sm:text-2xl font-bold text-neon-pink text-glow-pink">
              {highScore}
            </span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-neon-dark/50 rounded-lg">
            <span className="font-rajdhani text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              到达等级
            </span>
            <span className="font-orbitron text-xl sm:text-2xl font-bold text-neon-cyan text-glow-cyan">
              {level}
            </span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-neon-dark/50 rounded-lg">
            <span className="font-rajdhani text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
              关卡 {levelConfig.id} · {LEVEL_TYPE_NAMES[levelConfig.type]}
            </span>
            <span className={`font-orbitron text-sm font-bold ${isLevelCleared ? 'text-neon-green' : 'text-neon-pink/60'}`}>
              {isLevelCleared ? '✓ 通关' : `${score}/${levelConfig.targetScore}`}
            </span>
          </div>

          {isNewHighScore && (
            <div className="text-center font-orbitron text-xs sm:text-sm text-neon-yellow animate-pulse-neon tracking-widest">
              ★ NEW HIGH SCORE ★
            </div>
          )}

          {isLevelCleared && nextLevel && (
            <div className="text-center font-rajdhani text-xs text-neon-cyan/60">
              关卡 {nextLevel.id} 已解锁！
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => startGame(levelConfig.id)}
            className="w-full font-orbitron text-base sm:text-lg px-8 py-3 border-2 border-neon-green text-neon-green
              rounded-lg hover:bg-neon-green/10 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              active:bg-neon-green/20 active:scale-95
              transition-all duration-300 tracking-widest border-glow-green touch-manipulation"
          >
            RETRY
          </button>

          {isLevelCleared && nextUnlocked && (
            <button
              onClick={() => startGame(nextLevel.id)}
              className="w-full font-orbitron text-sm px-8 py-2.5 border border-neon-cyan/50 text-neon-cyan
                rounded-lg hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]
                active:bg-neon-cyan/20 active:scale-95
                transition-all duration-300 tracking-widest touch-manipulation"
            >
              NEXT LEVEL →
            </button>
          )}
        </div>

        <p className="font-rajdhani text-xs sm:text-sm text-gray-500 text-center mt-3">
          按空格键 / 点击按钮重新开始
        </p>
      </div>
    </div>
  )
}
