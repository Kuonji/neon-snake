import { useGameStore, LEVEL_CONFIGS, LevelType } from '@/store/gameStore'

const LEVEL_TYPE_NAMES: Record<LevelType, string> = {
  classic: '经典',
  timedSurvival: '限时生存',
  bounty: '赏金',
  spaceEscape: '太空逃亡',
  challenge: '挑战',
}

const LEVEL_TYPE_DESC: Record<LevelType, string> = {
  classic: '标准贪吃蛇，达到目标分数过关',
  timedSurvival: '限时5分钟，尽可能高分',
  bounty: '击杀敌人获得金豆',
  spaceEscape: '地图不断收缩',
  challenge: '连续击杀有连击奖励',
}

export default function LevelSelect() {
  const state = useGameStore(s => s.state)
  const levelProgress = useGameStore(s => s.levelProgress)
  const startGame = useGameStore(s => s.startGame)
  const hideLevelSelect = useGameStore(s => s.hideLevelSelect)

  if (state !== 'levelSelect') return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-neon-surface border-2 border-neon-green/30 rounded-xl p-4 sm:p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-orbitron text-xl sm:text-2xl font-black text-neon-green text-glow-green tracking-wider">
            关卡选择
          </h2>
          <button
            onClick={hideLevelSelect}
            className="font-rajdhani text-sm px-3 py-1 border border-gray-600/40 text-gray-400
              rounded-md hover:bg-gray-600/10 hover:text-gray-300 transition-all duration-200"
          >
            返回
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LEVEL_CONFIGS.map(config => {
            const isUnlocked = levelProgress.unlockedLevels.includes(config.id)
            const isCompleted = levelProgress.completedLevels.includes(config.id)

            return (
              <button
                key={config.id}
                onClick={() => isUnlocked && startGame(config.id)}
                disabled={!isUnlocked}
                className={`relative text-left p-3 sm:p-4 rounded-lg border transition-all duration-200
                  ${isUnlocked
                    ? isCompleted
                      ? 'border-neon-green/40 bg-neon-green/5 hover:bg-neon-green/10 active:scale-[0.98]'
                      : 'border-neon-cyan/30 bg-neon-surface hover:bg-neon-cyan/5 active:scale-[0.98]'
                    : 'border-gray-700/30 bg-neon-dark/50 opacity-40 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-orbitron text-lg font-bold ${isUnlocked ? 'text-neon-green' : 'text-gray-600'}`}>
                    {config.id}
                  </span>
                  {isCompleted && (
                    <span className="text-neon-yellow text-xs font-orbitron">✓ 通关</span>
                  )}
                  {!isUnlocked && (
                    <span className="text-gray-600 text-xs">🔒</span>
                  )}
                </div>

                <div className={`font-rajdhani text-sm font-semibold mb-1 ${isUnlocked ? 'text-gray-200' : 'text-gray-600'}`}>
                  {LEVEL_TYPE_NAMES[config.type]}
                </div>

                <div className={`font-rajdhani text-xs mb-2 ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                  {LEVEL_TYPE_DESC[config.type]}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-orbitron text-xs ${isUnlocked ? 'text-neon-pink/70' : 'text-gray-700'}`}>
                    目标: {config.targetScore}
                  </span>
                  {config.timeLimit && (
                    <span className={`font-orbitron text-xs ${isUnlocked ? 'text-neon-yellow/60' : 'text-gray-700'}`}>
                      {Math.floor(config.timeLimit / 60)}:00
                    </span>
                  )}
                </div>

                {config.hasDangerZone && (
                  <div className="mt-1 font-rajdhani text-[10px] text-red-400/60">⚠ 危险区域</div>
                )}
                {config.hasShrinkingBorder && (
                  <div className="mt-1 font-rajdhani text-[10px] text-red-400/60">⚠ 收缩边界</div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
