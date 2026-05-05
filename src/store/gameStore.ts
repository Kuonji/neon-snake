import { create } from 'zustand'

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover'
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface Point {
  x: number
  y: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface ScoreRecord {
  score: number
  level: number
  date: string
}

export const GRID_SIZE = 20
export const CELL_SIZE = 30
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
export const BASE_SPEED = 150
export const SPEED_INCREMENT = 10
export const LEVEL_THRESHOLD = 5
export const MAX_LEVEL = 10
export const MIN_SPEED = 60

interface GameStore {
  state: GameState
  snake: Point[]
  direction: Direction
  nextDirection: Direction
  food: Point
  score: number
  highScore: number
  level: number
  speed: number
  particles: Particle[]
  leaderboard: ScoreRecord[]
  shakeIntensity: number
  flashAlpha: number

  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  gameOver: () => void
  setDirection: (dir: Direction) => void
  tick: () => void
  addParticles: (x: number, y: number, color: string, count: number) => void
  updateParticles: () => void
  setShakeIntensity: (intensity: number) => void
  setFlashAlpha: (alpha: number) => void
  loadHighScore: () => void
  loadLeaderboard: () => void
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

function createInitialSnake(): Point[] {
  const cx = Math.floor(GRID_SIZE / 2)
  const cy = Math.floor(GRID_SIZE / 2)
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ]
}

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`))
  const available: Point[] = []
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y })
      }
    }
  }
  return available[Math.floor(Math.random() * available.length)] || { x: 0, y: 0 }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem('neon_snake_high_score', String(score))
  } catch { /* ignore */ }
}

function saveLeaderboard(records: ScoreRecord[]) {
  try {
    localStorage.setItem('neon_snake_leaderboard', JSON.stringify(records))
  } catch { /* ignore */ }
}

function loadHighScoreFromStorage(): number {
  try {
    const val = localStorage.getItem('neon_snake_high_score')
    return val ? parseInt(val, 10) : 0
  } catch { return 0 }
}

function loadLeaderboardFromStorage(): ScoreRecord[] {
  try {
    const val = localStorage.getItem('neon_snake_leaderboard')
    return val ? JSON.parse(val) : []
  } catch { return [] }
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: 'idle',
  snake: createInitialSnake(),
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  food: { x: 0, y: 0 },
  score: 0,
  highScore: 0,
  level: 1,
  speed: BASE_SPEED,
  particles: [],
  leaderboard: [],
  shakeIntensity: 0,
  flashAlpha: 0,

  loadHighScore: () => {
    set({ highScore: loadHighScoreFromStorage() })
  },

  loadLeaderboard: () => {
    set({ leaderboard: loadLeaderboardFromStorage() })
  },

  startGame: () => {
    const snake = createInitialSnake()
    const food = randomFood(snake)
    set({
      state: 'playing',
      snake,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      food,
      score: 0,
      level: 1,
      speed: BASE_SPEED,
      particles: [],
      shakeIntensity: 0,
      flashAlpha: 0,
    })
  },

  pauseGame: () => {
    if (get().state === 'playing') {
      set({ state: 'paused' })
    }
  },

  resumeGame: () => {
    if (get().state === 'paused') {
      set({ state: 'playing' })
    }
  },

  gameOver: () => {
    const { score, level, highScore, leaderboard } = get()
    const newHighScore = Math.max(score, highScore)
    if (newHighScore > highScore) {
      saveHighScore(newHighScore)
    }

    const newRecord: ScoreRecord = {
      score,
      level,
      date: new Date().toLocaleDateString('zh-CN'),
    }
    const newLeaderboard = [...leaderboard, newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    saveLeaderboard(newLeaderboard)

    set({
      state: 'gameover',
      highScore: newHighScore,
      leaderboard: newLeaderboard,
      shakeIntensity: 10,
      flashAlpha: 0.5,
    })
  },

  setDirection: (dir: Direction) => {
    const { direction, state } = get()
    if (state !== 'playing') return
    if (dir === OPPOSITE[direction]) return
    set({ nextDirection: dir })
  },

  tick: () => {
    const { snake, nextDirection, food, score, level, state } = get()
    if (state !== 'playing') return

    const direction = nextDirection
    const head = snake[0]
    let newHead: Point

    switch (direction) {
      case 'UP': newHead = { x: head.x, y: head.y - 1 }; break
      case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break
      case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break
      case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break
    }

    if (
      newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE
    ) {
      get().gameOver()
      return
    }

    if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
      get().gameOver()
      return
    }

    const newSnake = [newHead, ...snake]
    let newScore = score
    let newLevel = level
    let newFood = food
    let newSpeed = get().speed

    if (newHead.x === food.x && newHead.y === food.y) {
      newScore = score + 1
      const nextLevel = Math.floor(newScore / LEVEL_THRESHOLD) + 1
      if (nextLevel !== level && nextLevel <= MAX_LEVEL) {
        newLevel = nextLevel
        newSpeed = Math.max(MIN_SPEED, BASE_SPEED - (newLevel - 1) * SPEED_INCREMENT)
      }
      newFood = randomFood(newSnake)
      get().addParticles(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        '#ff0066',
        12,
      )
    } else {
      newSnake.pop()
    }

    set({
      snake: newSnake,
      direction,
      food: newFood,
      score: newScore,
      level: newLevel,
      speed: newSpeed,
    })
  },

  addParticles: (x: number, y: number, color: string, count: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 1 + Math.random() * 3
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        color,
        size: 2 + Math.random() * 3,
      })
    }
    set(s => ({ particles: [...s.particles, ...particles] }))
  },

  updateParticles: () => {
    set(s => ({
      particles: s.particles
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vx: p.vx * 0.96,
          vy: p.vy * 0.96,
          life: p.life - 0.02 / p.maxLife,
        }))
        .filter(p => p.life > 0),
    }))
  },

  setShakeIntensity: (intensity: number) => {
    set({ shakeIntensity: intensity })
  },

  setFlashAlpha: (alpha: number) => {
    set({ flashAlpha: alpha })
  },
}))
