import { useGameStore } from '@/store/gameStore'

export default function GameOverModal() {
  const state = useGameStore(s => s.state)
  const score = useGameStore(s => s.score)
  const highScore = useGameStore(s => s.highScore)
  const level = useGameStore(s => s.level)
  const startGame = useGameStore(s => s.startGame)

  if (state !== 'gameover') return null

  const isNewHighScore = score === highScore && score > 0

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

          {isNewHighScore && (
            <div className="text-center font-orbitron text-xs sm:text-sm text-neon-yellow animate-pulse-neon tracking-widest">
              ★ NEW HIGH SCORE ★
            </div>
          )}
        </div>

        <button
          onClick={startGame}
          className="w-full font-orbitron text-base sm:text-lg px-8 py-3 border-2 border-neon-green text-neon-green
            rounded-lg hover:bg-neon-green/10 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
            active:bg-neon-green/20 active:scale-95
            transition-all duration-300 tracking-widest border-glow-green touch-manipulation"
        >
          RESTART
        </button>

        <p className="font-rajdhani text-xs sm:text-sm text-gray-500 text-center mt-3">
          按空格键 / 点击按钮重新开始
        </p>
      </div>
    </div>
  )
}
