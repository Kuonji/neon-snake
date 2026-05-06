import { useGameStore } from '@/store/gameStore'

export default function StartScreen() {
  const startGame = useGameStore(s => s.startGame)
  const showLevelSelect = useGameStore(s => s.showLevelSelect)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-neon-dark/80 backdrop-blur-sm">
      <div className="text-center animate-slide-up px-4">
        <h1 className="font-orbitron text-5xl sm:text-6xl md:text-7xl font-black tracking-wider text-neon-green text-glow-green mb-2">
          NEON
        </h1>
        <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-neon-pink text-glow-pink mb-6">
          SNAKE
        </h1>

        <div className="w-24 sm:w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-neon-green to-transparent mb-6" />

        <div className="space-y-3 mb-8">
          <p className="font-rajdhani text-base sm:text-lg text-neon-green/70 tracking-wide">
            在数字矩阵中穿行，吞噬能量粒子
          </p>
          <p className="font-rajdhani text-xs sm:text-sm text-gray-500">
            方向键 / WASD 控制方向 &middot; ESC 暂停
          </p>
          <p className="font-rajdhani text-xs sm:text-sm text-gray-500">
            Q 火球 &middot; E 幽灵 &middot; R 磁力爆发 &middot; F 减速
          </p>
          <p className="font-rajdhani text-xs sm:text-sm text-gray-500 md:hidden">
            滑动屏幕或使用方向键控制
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => startGame(1)}
            className="font-orbitron text-base sm:text-lg px-8 sm:px-10 py-3 border-2 border-neon-green text-neon-green
              rounded-lg hover:bg-neon-green/10 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
              active:bg-neon-green/20 active:scale-95
              transition-all duration-300 tracking-widest border-glow-green touch-manipulation"
          >
            START GAME
          </button>

          <button
            onClick={showLevelSelect}
            className="font-orbitron text-xs sm:text-sm px-6 sm:px-8 py-2 border border-neon-cyan/40 text-neon-cyan/70
              rounded-lg hover:bg-neon-cyan/10 hover:text-neon-cyan hover:border-neon-cyan/60
              active:bg-neon-cyan/20 active:scale-95
              transition-all duration-300 tracking-widest touch-manipulation"
          >
            SELECT LEVEL
          </button>
        </div>

        <p className="font-rajdhani text-xs sm:text-sm text-neon-green/40 mt-5 animate-blink">
          按空格键 / 点击按钮开始
        </p>
      </div>
    </div>
  )
}
