import { useEffect, useRef, useCallback } from 'react'
import { useGameStore, Direction, CELL_SIZE, GRID_SIZE, CANVAS_SIZE } from '@/store/gameStore'

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP', W: 'UP',
  s: 'DOWN', S: 'DOWN',
  a: 'LEFT', A: 'LEFT',
  d: 'RIGHT', D: 'RIGHT',
}

export function useGameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastTickRef = useRef<number>(0)
  const animFrameRef = useRef<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const state = useGameStore(s => s.state)
  const snake = useGameStore(s => s.snake)
  const food = useGameStore(s => s.food)
  const score = useGameStore(s => s.score)
  const level = useGameStore(s => s.level)
  const speed = useGameStore(s => s.speed)
  const highScore = useGameStore(s => s.highScore)
  const particles = useGameStore(s => s.particles)
  const shakeIntensity = useGameStore(s => s.shakeIntensity)
  const flashAlpha = useGameStore(s => s.flashAlpha)

  const startGame = useGameStore(s => s.startGame)
  const pauseGame = useGameStore(s => s.pauseGame)
  const resumeGame = useGameStore(s => s.resumeGame)
  const setDirection = useGameStore(s => s.setDirection)
  const tick = useGameStore(s => s.tick)
  const updateParticles = useGameStore(s => s.updateParticles)
  const setShakeIntensity = useGameStore(s => s.setShakeIntensity)
  const setFlashAlpha = useGameStore(s => s.setFlashAlpha)
  const loadHighScore = useGameStore(s => s.loadHighScore)
  const loadLeaderboard = useGameStore(s => s.loadLeaderboard)

  useEffect(() => {
    loadHighScore()
    loadLeaderboard()
  }, [loadHighScore, loadLeaderboard])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const shakeX = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0
    const shakeY = shakeIntensity > 0 ? (Math.random() - 0.5) * shakeIntensity : 0

    ctx.save()
    ctx.translate(shakeX, shakeY)

    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(-10, -10, CANVAS_SIZE + 20, CANVAS_SIZE + 20)

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    const time = Date.now() * 0.003
    const pulseScale = 1 + Math.sin(time) * 0.15
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2
    const foodRadius = (CELL_SIZE / 2 - 3) * pulseScale

    const foodGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL_SIZE * 1.5)
    foodGlow.addColorStop(0, 'rgba(255, 0, 102, 0.3)')
    foodGlow.addColorStop(1, 'rgba(255, 0, 102, 0)')
    ctx.fillStyle = foodGlow
    ctx.fillRect(fx - CELL_SIZE * 1.5, fy - CELL_SIZE * 1.5, CELL_SIZE * 3, CELL_SIZE * 3)

    ctx.fillStyle = '#ff0066'
    ctx.shadowColor = '#ff0066'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(fx, fy, Math.max(1, foodRadius), 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ff3388'
    ctx.beginPath()
    ctx.arc(fx, fy, Math.max(1, foodRadius * 0.5), 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    snake.forEach((segment, index) => {
      const sx = segment.x * CELL_SIZE
      const sy = segment.y * CELL_SIZE
      const progress = index / snake.length
      const alpha = 1 - progress * 0.6
      const size = CELL_SIZE - 2 - progress * 4
      const offset = (CELL_SIZE - size) / 2

      if (index === 0) {
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = 20
      } else {
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = Math.max(0, 10 - progress * 10)
      }

      const gradient = ctx.createLinearGradient(sx, sy, sx + CELL_SIZE, sy + CELL_SIZE)
      gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`)
      gradient.addColorStop(1, `rgba(0, 229, 255, ${alpha * 0.7})`)
      ctx.fillStyle = gradient

      const radius = index === 0 ? 6 : Math.max(2, 4 - progress * 3)
      const x = sx + offset
      const y = sy + offset
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + size - radius, y)
      ctx.quadraticCurveTo(x + size, y, x + size, y + radius)
      ctx.lineTo(x + size, y + size - radius)
      ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size)
      ctx.lineTo(x + radius, y + size)
      ctx.quadraticCurveTo(x, y + size, x, y + size - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.fill()

      if (index === 0) {
        ctx.shadowBlur = 0
        const dir = useGameStore.getState().direction
        let ex1x: number, ex1y: number, ex2x: number, ex2y: number
        const cx = sx + CELL_SIZE / 2
        const cy = sy + CELL_SIZE / 2
        const eyeOffset = 5
        const eyeSize = 3

        switch (dir) {
          case 'RIGHT':
            ex1x = cx + eyeOffset; ex1y = cy - 5
            ex2x = cx + eyeOffset; ex2y = cy + 5
            break
          case 'LEFT':
            ex1x = cx - eyeOffset; ex1y = cy - 5
            ex2x = cx - eyeOffset; ex2y = cy + 5
            break
          case 'UP':
            ex1x = cx - 5; ex1y = cy - eyeOffset
            ex2x = cx + 5; ex2y = cy - eyeOffset
            break
          case 'DOWN':
            ex1x = cx - 5; ex1y = cy + eyeOffset
            ex2x = cx + 5; ex2y = cy + eyeOffset
            break
        }

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(ex1x, ex1y, eyeSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(ex2x, ex2y, eyeSize, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#0a0a0f'
        ctx.beginPath()
        ctx.arc(ex1x, ex1y, 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(ex2x, ex2y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
    })

    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0

    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 0, 102, ${flashAlpha})`
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }

    ctx.restore()
  }, [snake, food, particles, shakeIntensity, flashAlpha])

  const gameLoop = useCallback((timestamp: number) => {
    const currentState = useGameStore.getState().state

    if (currentState === 'playing') {
      const currentSpeed = useGameStore.getState().speed
      if (timestamp - lastTickRef.current >= currentSpeed) {
        lastTickRef.current = timestamp
        useGameStore.getState().tick()
      }
      useGameStore.getState().updateParticles()
    }

    const currentShake = useGameStore.getState().shakeIntensity
    if (currentShake > 0) {
      useGameStore.getState().setShakeIntensity(currentShake * 0.9)
      if (currentShake < 0.5) useGameStore.getState().setShakeIntensity(0)
    }

    const currentFlash = useGameStore.getState().flashAlpha
    if (currentFlash > 0) {
      useGameStore.getState().setFlashAlpha(currentFlash * 0.92)
      if (currentFlash < 0.01) useGameStore.getState().setFlashAlpha(0)
    }

    render()
    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [render])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [gameLoop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key]
      if (dir) {
        e.preventDefault()
        setDirection(dir)
        return
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        const cs = useGameStore.getState().state
        if (cs === 'idle' || cs === 'gameover') startGame()
        return
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        const cs = useGameStore.getState().state
        if (cs === 'playing') pauseGame()
        else if (cs === 'paused') resumeGame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setDirection, startGame, pauseGame, resumeGame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchStartRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStartRef.current.x
      const dy = touch.clientY - touchStartRef.current.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < 20) return

      if (absDx > absDy) {
        setDirection(dx > 0 ? 'RIGHT' : 'LEFT')
      } else {
        setDirection(dy > 0 ? 'DOWN' : 'UP')
      }
      touchStartRef.current = null
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [setDirection])

  return {
    canvasRef,
    state,
    score,
    level,
    speed,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    setDirection,
  }
}
