import { useState } from 'react'
import { useGameStore, ScoreRecord } from '@/store/gameStore'

export default function LeaderboardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const leaderboard = useGameStore(s => s.leaderboard)
  const state = useGameStore(s => s.state)

  if (state === 'playing') return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-rajdhani text-sm px-4 py-1.5 border border-neon-cyan/30 text-neon-cyan/70
          rounded-md hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-300 tracking-wider"
      >
        排行榜
      </button>

      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-neon-surface border-2 border-neon-cyan/30 rounded-xl p-6 max-w-sm w-full mx-4 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-orbitron text-xl font-bold text-neon-cyan text-glow-cyan tracking-wider">
                排行榜
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-neon-pink transition-colors text-xl font-bold w-8 h-8
                  flex items-center justify-center rounded-full hover:bg-neon-pink/10"
              >
                ✕
              </button>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-rajdhani text-gray-500 text-lg">暂无记录</p>
                <p className="font-rajdhani text-gray-600 text-sm mt-1">开始游戏创造你的第一个纪录</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-3 py-1 text-xs text-gray-500 font-orbitron uppercase tracking-wider">
                  <span>#</span>
                  <span>分数</span>
                  <span>等级</span>
                  <span>日期</span>
                </div>
                {leaderboard.map((record: ScoreRecord, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-3 py-2 bg-neon-dark/50 rounded-lg
                      items-center hover:bg-neon-dark/80 transition-colors"
                  >
                    <span className={`font-orbitron font-bold ${
                      index === 0 ? 'text-neon-yellow' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-amber-600' :
                      'text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-orbitron font-bold text-neon-green">
                      {record.score}
                    </span>
                    <span className="font-rajdhani text-neon-cyan">
                      关卡{record.level}
                    </span>
                    <span className="font-rajdhani text-gray-400 text-sm">
                      {record.date}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 font-rajdhani text-sm px-6 py-2 border border-neon-cyan/30
                text-neon-cyan/70 rounded-lg hover:bg-neon-cyan/10 hover:text-neon-cyan
                transition-all duration-300 tracking-wider"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}
