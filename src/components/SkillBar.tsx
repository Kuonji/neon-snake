import { useGameStore, SkillId, SKILL_DEFINITIONS } from '@/store/gameStore'

const SKILL_ICONS: Record<SkillId, string> = {
  magnet: '🧲', shield: '🛡', scoreMultiplier: '✨',
  fireball: '🔥', ghost: '👻', magnetBurst: '💫', slowField: '❄',
}
const SKILL_NAMES: Record<SkillId, string> = {
  magnet: '磁铁', shield: '护盾', scoreMultiplier: '双倍',
  fireball: '火球', ghost: '幽灵', magnetBurst: '磁力爆发', slowField: '减速',
}
const SKILL_KEYS: Record<SkillId, string> = {
  magnet: '1', shield: '2', scoreMultiplier: '3',
  fireball: 'Q', ghost: 'E', magnetBurst: 'R', slowField: 'F',
}

export default function SkillBar() {
  const skills = useGameStore(s => s.skills)
  const state = useGameStore(s => s.state)
  const activateSkill = useGameStore(s => s.activateSkill)

  if (state !== 'playing' && state !== 'paused') return null

  const activeSkills = skills.filter(s => s.charge > 0 || s.isActive)
  if (activeSkills.length === 0) return null

  return (
    <div className="hidden md:flex items-center gap-2 mt-1">
      {activeSkills.map(skill => {
        const def = SKILL_DEFINITIONS[skill.id]
        const isReady = skill.charge > 0 && skill.remainingCooldown <= 0
        const cooldownPercent = skill.remainingCooldown > 0
          ? (1 - skill.remainingCooldown / skill.cooldown) * 100
          : 100
        const durationPercent = skill.isActive && skill.duration > 0
          ? (skill.remainingDuration / skill.duration) * 100
          : 0

        return (
          <button
            key={skill.id}
            onClick={() => def.type === 'active' && isReady && activateSkill(skill.id)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 touch-manipulation
              ${skill.isActive
                ? 'border-neon-yellow/60 bg-neon-yellow/10 shadow-[0_0_10px_rgba(255,230,0,0.3)]'
                : isReady && def.type === 'active'
                  ? 'border-neon-green/60 bg-neon-green/10 shadow-[0_0_12px_rgba(0,255,136,0.25)] animate-skill-pulse hover:bg-neon-green/20 active:scale-90'
                  : isReady
                    ? 'border-neon-green/30 bg-neon-surface/60'
                    : 'border-gray-700/30 bg-neon-dark/30 opacity-40'
              }`}
          >
            <span className="text-sm">{SKILL_ICONS[skill.id]}</span>
            <span className={`font-rajdhani text-xs font-semibold ${isReady ? 'text-gray-200' : 'text-gray-500'}`}>
              {SKILL_NAMES[skill.id]}
            </span>
            {skill.charge > 1 && (
              <span className="font-orbitron text-[9px] text-neon-green/70">x{skill.charge}</span>
            )}
            {def.type === 'active' && (
              <span className={`font-orbitron text-[9px] ${isReady ? 'text-neon-yellow' : 'text-gray-600'}`}>
                [{SKILL_KEYS[skill.id]}]
              </span>
            )}
            {skill.isActive && skill.duration > 0 && (
              <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-neon-surface rounded overflow-hidden">
                <div className="h-full bg-neon-yellow transition-all duration-100" style={{ width: `${durationPercent}%` }} />
              </div>
            )}
            {skill.remainingCooldown > 0 && (
              <div className="absolute inset-0 bg-black/50 rounded-lg" style={{ clipPath: `inset(${cooldownPercent}% 0 0 0)` }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
