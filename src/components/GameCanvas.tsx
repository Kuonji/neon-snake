import { CANVAS_SIZE } from '@/store/gameStore'

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export default function GameCanvas({ canvasRef }: GameCanvasProps) {
  return (
    <div className="relative w-full" style={{ maxWidth: `${CANVAS_SIZE}px` }}>
      <div className="border-2 border-neon-green/20 rounded-lg border-glow-green overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block w-full h-auto"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  )
}
