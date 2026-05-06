import { useGameStore, TransformationType, SkillId } from '@/store/gameStore'

const TRANSFORM_INFO: Record<TransformationType, { icon: string; text: string; color: string }> = {
  none: { icon: '', text: '', color: '' },
  mini: { icon: '🔹', text: '迷你形态', color: '#4488ff' },
  rage: { icon: '🔥', text: '狂暴形态', color: '#ff4400' },
  chameleon: { icon: '🦎', text: '变色龙', color: '#00ccaa' },
}

export default function StatusPanel() {
  const state = useGameStore(s => s.state)
  const transformation = useGameStore(s => s.transformation)
  const skills = useGameStore(s => s.skills)
  const combo = useGameStore(s => s.combo)

  if (state !== 'playing' && state !== 'paused') return null

  const items: { icon: string; text: string; color: string; timePct?: number }[] = []

  if (transformation.type !== 'none') {
    const info = TRANSFORM_INFO[transformation.type]
    items.push({
      icon: info.icon, text: info.text, color: info.color,
      timePct: transformation.remainingTime / transformation.maxTime,
    })
  }

  const ghostSkill = skills.find(s => s.id === 'ghost' && s.isActive)
  if (ghostSkill) {
    items.push({ icon: '👻', text: '幽灵', color: '#8888ff', timePct: ghostSkill.remainingDuration / ghostSkill.duration })
  }

  const shieldSkill = skills.find(s => s.id === 'shield' && s.charge > 0)
  if (shieldSkill) {
    items.push({ icon: '🛡', text: `护盾x${shieldSkill.charge}`, color: '#00e5ff' })
  }

  const magnetSkill = skills.find(s => s.id === 'magnet' && s.charge > 0)
  if (magnetSkill) {
    items.push({ icon: '🧲', text: '磁铁', color: '#44aaff' })
  }

  const scoreMultSkill = skills.find(s => s.id === 'scoreMultiplier' && s.isActive)
  if (scoreMultSkill) {
    items.push({ icon: '✨', text: '双倍得分', color: '#ffe600', timePct: scoreMultSkill.remainingDuration / scoreMultSkill.duration })
  }

  if (combo.count > 1) {
    items.push({ icon: '⚡', text: `连击x${combo.multiplier.toFixed(1)}`, color: '#ffe600' })
  }

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded border bg-neon-surface/60"
          style={{ borderColor: `${item.color}30` }}>
          <span className="text-xs">{item.icon}</span>
          <span className="font-rajdhani text-[11px] font-semibold" style={{ color: item.color }}>
            {item.text}
          </span>
          {item.timePct !== undefined && (
            <div className="w-8 h-1 bg-neon-dark rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${item.timePct * 100}%`, backgroundColor: item.color }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
