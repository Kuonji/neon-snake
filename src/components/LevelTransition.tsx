import { useGameStore } from '@/store/gameStore'

export default function LevelTransition() {
  const state = useGameStore(s => s.state)
  const levelConfig = useGameStore(s => s.levelConfig)

  if (state !== 'levelTransition') return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm rounded-lg">
      <div className="text-center animate-slide-up">
        <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-neon-cyan tracking-widest mb-2"
          style={{ textShadow: '0 0 20px #00e5ff, 0 0 40px #00e5ff' }}>
          LEVEL UP!
        </h2>
        <p className="font-rajdhani text-lg text-neon-green">
          进入关卡 {levelConfig.id + 1}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-neon-yellow animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
