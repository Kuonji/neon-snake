import { useGameStore, TransformationType } from '@/store/gameStore'

const TRANSFORM_NAMES: Record<TransformationType, string> = {
  none: '',
  mini: '迷你',
  rage: '狂暴',
  chameleon: '变色龙',
}

const TRANSFORM_ICONS: Record<TransformationType, string> = {
  none: '',
  mini: '🔹',
  rage: '🔥',
  chameleon: '🦎',
}

const TRANSFORM_COLORS: Record<TransformationType, string> = {
  none: '',
  mini: '#4488ff',
  rage: '#ff4400',
  chameleon: '#00ccaa',
}

export default function TransformationIndicator() {
  const transformation = useGameStore(s => s.transformation)
  const state = useGameStore(s => s.state)

  if (state !== 'playing' && state !== 'paused') return null
  if (transformation.type === 'none') return null

  const percent = (transformation.remainingTime / transformation.maxTime) * 100
  const color = TRANSFORM_COLORS[transformation.type]

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-neon-surface/80"
      style={{ borderColor: `${color}40` }}>
      <span className="text-sm">{TRANSFORM_ICONS[transformation.type]}</span>
      <span className="font-rajdhani text-xs font-semibold" style={{ color }}>
        {TRANSFORM_NAMES[transformation.type]}
      </span>
      <div className="w-12 h-1 bg-neon-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
