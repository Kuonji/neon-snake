import { useEffect, useRef, useCallback } from 'react'
import { useGameStore, Direction, CELL_SIZE, GRID_SIZE, CANVAS_SIZE, FOOD_COLORS, SkillId } from '@/store/gameStore'

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

const SKILL_KEYS: Record<string, SkillId> = {
  q: 'fireball',
  Q: 'fireball',
  e: 'ghost',
  E: 'ghost',
  r: 'magnetBurst',
  R: 'magnetBurst',
  f: 'slowField',
  F: 'slowField',
}

export function useGameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastTickRef = useRef<number>(0)
  const animFrameRef = useRef<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const timeAccRef = useRef<number>(0)

  const state = useGameStore(s => s.state)
  const snake = useGameStore(s => s.snake)
  const foods = useGameStore(s => s.foods)
  const score = useGameStore(s => s.score)
  const level = useGameStore(s => s.level)
  const speed = useGameStore(s => s.speed)
  const highScore = useGameStore(s => s.highScore)
  const particles = useGameStore(s => s.particles)
  const shakeIntensity = useGameStore(s => s.shakeIntensity)
  const flashAlpha = useGameStore(s => s.flashAlpha)
  const walls = useGameStore(s => s.walls)
  const dangerZones = useGameStore(s => s.dangerZones)
  const transformation = useGameStore(s => s.transformation)
  const skills = useGameStore(s => s.skills)
  const shrinkingBorder = useGameStore(s => s.shrinkingBorder)
  const fireballs = useGameStore(s => s.fireballs)
  const combo = useGameStore(s => s.combo)
  const levelConfig = useGameStore(s => s.levelConfig)
  const timeRemaining = useGameStore(s => s.timeRemaining)

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
  const activateSkill = useGameStore(s => s.activateSkill)
  const updateDangerZones = useGameStore(s => s.updateDangerZones)
  const updateMovingWalls = useGameStore(s => s.updateMovingWalls)
  const updateSkills = useGameStore(s => s.updateSkills)
  const updateTransformation = useGameStore(s => s.updateTransformation)
  const updateCombo = useGameStore(s => s.updateCombo)
  const updateDDA = useGameStore(s => s.updateDDA)
  const updateShrinkingBorder = useGameStore(s => s.updateShrinkingBorder)
  const updateFireballs = useGameStore(s => s.updateFireballs)
  const updateTimeLimit = useGameStore(s => s.updateTimeLimit)

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

    const borderOffset = Math.floor(shrinkingBorder / 2)
    const effectiveSize = GRID_SIZE - Math.floor(shrinkingBorder)

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

    if (shrinkingBorder > 0) {
      ctx.strokeStyle = '#ff004488'
      ctx.lineWidth = 2
      ctx.shadowColor = '#ff0044'
      ctx.shadowBlur = 10
      const bx = borderOffset * CELL_SIZE
      const by = borderOffset * CELL_SIZE
      const bw = effectiveSize * CELL_SIZE
      const bh = effectiveSize * CELL_SIZE
      ctx.strokeRect(bx, by, bw, bh)
      ctx.shadowBlur = 0

      ctx.fillStyle = 'rgba(255, 0, 68, 0.05)'
      ctx.fillRect(0, 0, CANVAS_SIZE, borderOffset * CELL_SIZE)
      ctx.fillRect(0, (borderOffset + effectiveSize) * CELL_SIZE, CANVAS_SIZE, borderOffset * CELL_SIZE)
      ctx.fillRect(0, borderOffset * CELL_SIZE, borderOffset * CELL_SIZE, effectiveSize * CELL_SIZE)
      ctx.fillRect((borderOffset + effectiveSize) * CELL_SIZE, borderOffset * CELL_SIZE, borderOffset * CELL_SIZE, effectiveSize * CELL_SIZE)
    }

    dangerZones.forEach(dz => {
      const alpha = Math.min(0.4, (dz.remainingTime / dz.maxTime) * 0.4)
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`
      ctx.fillRect(dz.position.x * CELL_SIZE, dz.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      ctx.strokeStyle = `rgba(255, 50, 50, ${alpha * 1.5})`
      ctx.lineWidth = 1
      ctx.strokeRect(dz.position.x * CELL_SIZE + 2, dz.position.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4)
    })

    walls.forEach(wall => {
      const wx = wall.position.x * CELL_SIZE
      const wy = wall.position.y * CELL_SIZE
      if (wall.type === 'static') {
        ctx.fillStyle = '#442244'
        ctx.shadowColor = '#ff0066'
        ctx.shadowBlur = 5
        ctx.fillRect(wx + 1, wy + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        ctx.strokeStyle = '#ff006688'
        ctx.lineWidth = 1
        ctx.strokeRect(wx + 1, wy + 1, CELL_SIZE - 2, CELL_SIZE - 2)
      } else {
        const time = Date.now() * 0.005
        const alpha = 0.6 + Math.sin(time) * 0.3
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha})`
        ctx.shadowColor = '#ff6600'
        ctx.shadowBlur = 8
        ctx.fillRect(wx + 1, wy + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        ctx.strokeStyle = '#ff880088'
        ctx.lineWidth = 1
        ctx.strokeRect(wx + 1, wy + 1, CELL_SIZE - 2, CELL_SIZE - 2)
      }
      ctx.shadowBlur = 0
    })

    const time = Date.now() * 0.003
    foods.forEach(food => {
      const pulseScale = 1 + Math.sin(time + food.spawnTime * 0.001) * 0.15
      const fx = food.position.x * CELL_SIZE + CELL_SIZE / 2
      const fy = food.position.y * CELL_SIZE + CELL_SIZE / 2
      const foodRadius = (CELL_SIZE / 2 - 3) * pulseScale
      const colors = FOOD_COLORS[food.type]

      const foodGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL_SIZE * 1.5)
      foodGlow.addColorStop(0, colors.glow)
      foodGlow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = foodGlow
      ctx.fillRect(fx - CELL_SIZE * 1.5, fy - CELL_SIZE * 1.5, CELL_SIZE * 3, CELL_SIZE * 3)

      ctx.fillStyle = colors.main
      ctx.shadowColor = colors.main
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(fx, fy, Math.max(1, foodRadius), 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = colors.inner
      ctx.beginPath()
      ctx.arc(fx, fy, Math.max(1, foodRadius * 0.5), 0, Math.PI * 2)
      ctx.fill()

      if (food.type === 'epic') {
        ctx.strokeStyle = `rgba(170, 0, 255, ${0.3 + Math.sin(time * 2) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(fx, fy, Math.max(1, foodRadius + 4), 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.shadowBlur = 0
    })

    const ghostSkill = skills.find(s => s.id === 'ghost' && s.isActive)
    const isHidden = transformation.isHidden

    snake.forEach((segment, index) => {
      const sx = segment.x * CELL_SIZE
      const sy = segment.y * CELL_SIZE
      const progress = index / snake.length
      const alpha = isHidden ? 0.2 : (1 - progress * 0.6)
      const sizeMultiplier = transformation.type === 'mini' ? transformation.sizeMultiplier : 1
      const baseSize = CELL_SIZE - 2 - progress * 4
      const size = baseSize * sizeMultiplier
      const offset = (CELL_SIZE - size) / 2

      let mainColor = '#00ff88'
      let glowColor = '#00ff88'
      if (transformation.type === 'rage') {
        mainColor = '#ff4400'
        glowColor = '#ff4400'
      } else if (transformation.type === 'chameleon') {
        mainColor = '#00ccaa'
        glowColor = '#00ccaa'
      } else if (ghostSkill) {
        mainColor = '#8888ff'
        glowColor = '#8888ff'
      }

      if (index === 0) {
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 20
      } else {
        ctx.shadowColor = glowColor
        ctx.shadowBlur = Math.max(0, 10 - progress * 10)
      }

      const r = parseInt(mainColor.slice(1, 3), 16) || 0
      const g = parseInt(mainColor.slice(3, 5), 16) || 0
      const b = parseInt(mainColor.slice(5, 7), 16) || 0
      const r2 = parseInt('#00e5ff'.slice(1, 3), 16) || 0
      const g2 = parseInt('#00e5ff'.slice(3, 5), 16) || 0
      const b2 = parseInt('#00e5ff'.slice(5, 7), 16) || 0

      const grad = ctx.createLinearGradient(sx, sy, sx + CELL_SIZE, sy + CELL_SIZE)
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
      grad.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${alpha * 0.7})`)
      ctx.fillStyle = grad

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
        const eyeOffset = 5 * sizeMultiplier
        const eyeSize = 3 * sizeMultiplier

        switch (dir) {
          case 'RIGHT':
            ex1x = cx + eyeOffset; ex1y = cy - 5 * sizeMultiplier
            ex2x = cx + eyeOffset; ex2y = cy + 5 * sizeMultiplier
            break
          case 'LEFT':
            ex1x = cx - eyeOffset; ex1y = cy - 5 * sizeMultiplier
            ex2x = cx - eyeOffset; ex2y = cy + 5 * sizeMultiplier
            break
          case 'UP':
            ex1x = cx - 5 * sizeMultiplier; ex1y = cy - eyeOffset
            ex2x = cx + 5 * sizeMultiplier; ex2y = cy - eyeOffset
            break
          case 'DOWN':
            ex1x = cx - 5 * sizeMultiplier; ex1y = cy + eyeOffset
            ex2x = cx + 5 * sizeMultiplier; ex2y = cy + eyeOffset
            break
        }

        ctx.fillStyle = transformation.type === 'rage' ? '#ffcc00' : '#ffffff'
        ctx.beginPath()
        ctx.arc(ex1x, ex1y, eyeSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(ex2x, ex2y, eyeSize, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#0a0a0f'
        ctx.beginPath()
        ctx.arc(ex1x, ex1y, 1.5 * sizeMultiplier, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(ex2x, ex2y, 1.5 * sizeMultiplier, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
    })

    if (transformation.type === 'rage') {
      const tail = snake[snake.length - 1]
      if (tail && Math.random() < 0.3) {
        const px = tail.x * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 10
        const py = tail.y * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 10
        ctx.fillStyle = `rgba(255, 68, 0, ${0.3 + Math.random() * 0.5})`
        ctx.beginPath()
        ctx.arc(px, py, 1 + Math.random() * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    fireballs.forEach(fb => {
      ctx.globalAlpha = Math.max(0, fb.life)
      ctx.fillStyle = '#ff4400'
      ctx.shadowColor = '#ff4400'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(fb.x, fb.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffcc00'
      ctx.beginPath()
      ctx.arc(fb.x, fb.y, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    })
    ctx.globalAlpha = 1

    const shieldSkill = skills.find(s => s.id === 'shield' && s.charge > 0)
    if (shieldSkill && snake.length > 0) {
      const head = snake[0]
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.shadowColor = '#00e5ff'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE * 0.8, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

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

    if (combo.count > 1) {
      const head = snake[0]
      if (head) {
        ctx.font = 'bold 14px Orbitron'
        ctx.fillStyle = '#ffe600'
        ctx.shadowColor = '#ffe600'
        ctx.shadowBlur = 10
        ctx.textAlign = 'center'
        ctx.fillText(`x${combo.multiplier.toFixed(1)}`, head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE - 8)
        ctx.shadowBlur = 0
      }
    }

    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 0, 102, ${flashAlpha})`
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }

    ctx.restore()
  }, [snake, foods, particles, shakeIntensity, flashAlpha, walls, dangerZones, transformation, skills, shrinkingBorder, fireballs, combo])

  const gameLoop = useCallback((timestamp: number) => {
    const currentState = useGameStore.getState().state

    if (currentState === 'playing') {
      const currentSpeed = useGameStore.getState().speed
      if (timestamp - lastTickRef.current >= currentSpeed) {
        lastTickRef.current = timestamp
        useGameStore.getState().tick()
      }
      useGameStore.getState().updateParticles()
      useGameStore.getState().updateMovingWalls()
      useGameStore.getState().updateDangerZones()
      useGameStore.getState().updateSkills()
      useGameStore.getState().updateTransformation()
      useGameStore.getState().updateCombo()
      useGameStore.getState().updateDDA()
      useGameStore.getState().updateShrinkingBorder()
      useGameStore.getState().updateFireballs()

      timeAccRef.current += 16
      if (timeAccRef.current >= 1000) {
        timeAccRef.current -= 1000
        useGameStore.getState().updateTimeLimit()
      }
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

      const skillId = SKILL_KEYS[e.key]
      if (skillId) {
        e.preventDefault()
        activateSkill(skillId)
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
  }, [setDirection, startGame, pauseGame, resumeGame, activateSkill])

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
