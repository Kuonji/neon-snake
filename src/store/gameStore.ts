import { create } from 'zustand'

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover' | 'levelTransition' | 'levelSelect'
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type FoodType = 'normal' | 'bonus' | 'super' | 'epic'
export type TransformationType = 'none' | 'mini' | 'rage' | 'chameleon'
export type SkillId = 'magnet' | 'shield' | 'scoreMultiplier' | 'fireball' | 'ghost' | 'magnetBurst' | 'slowField'
export type LevelType = 'classic' | 'timedSurvival' | 'bounty' | 'spaceEscape' | 'challenge'

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

export interface Food {
  position: Point
  type: FoodType
  spawnTime: number
}

export interface Wall {
  position: Point
  type: 'static' | 'moving'
  direction?: Direction
  speed?: number
  rangeStart?: Point
  rangeEnd?: Point
  progress?: number
}

export interface DangerZone {
  position: Point
  remainingTime: number
  maxTime: number
}

export interface Skill {
  id: SkillId
  type: 'passive' | 'active'
  charge: number
  maxCharge: number
  cooldown: number
  remainingCooldown: number
  isActive: boolean
  duration: number
  remainingDuration: number
}

export interface Transformation {
  type: TransformationType
  remainingTime: number
  maxTime: number
  sizeMultiplier: number
  canPassWalls: boolean
  canDestroyObstacles: boolean
  isHidden: boolean
}

export interface ComboState {
  count: number
  lastEatTime: number
  multiplier: number
}

export interface LevelConfig {
  id: number
  type: LevelType
  speed: number
  walls: Wall[]
  foodTypes: FoodType[]
  targetScore: number
  unlockReward: string
  hasDangerZone: boolean
  hasShrinkingBorder: boolean
  timeLimit?: number
}

export interface LevelProgress {
  currentLevel: number
  unlockedLevels: number[]
  completedLevels: number[]
  unlockedSkins: string[]
  unlockedSkills: SkillId[]
}

export interface DDAState {
  recentEatTimes: number[]
  adaptiveSpeedOffset: number
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
export const MAX_LEVEL = 5
export const MIN_SPEED = 60
export const COMBO_TIMEOUT = 3000
export const COMBO_MULTIPLIER_BASE = 1.5
export const DANGER_ZONE_LIFETIME = 5000
export const DANGER_ZONE_SPAWN_DELAY = 300
export const TRANSFORMATION_DURATION = 8000
export const SKILL_COOLDOWN_DEFAULT = 15000
export const GHOST_DURATION = 5000
export const SLOW_FIELD_DURATION = 3000
export const MAGNET_RANGE = 3
export const FIREBALL_COUNT = 3
export const DDA_WINDOW = 30000
export const DDA_SPEED_ADJUST_RANGE = 0.1
export const SKILL_SPAWN_CHANCE = 0.5
export const LEVEL_TRANSITION_DELAY = 2000

export const FOOD_SPAWN_WEIGHTS: Record<FoodType, number> = {
  normal: 70,
  bonus: 20,
  super: 8,
  epic: 2,
}

export const FOOD_SCORES: Record<FoodType, number> = {
  normal: 10,
  bonus: 20,
  super: 50,
  epic: 100,
}

export const FOOD_COLORS: Record<FoodType, { main: string; glow: string; inner: string }> = {
  normal: { main: '#00ff88', glow: 'rgba(0, 255, 136, 0.3)', inner: '#33ffaa' },
  bonus: { main: '#ff8800', glow: 'rgba(255, 136, 0, 0.3)', inner: '#ffaa33' },
  super: { main: '#ff0088', glow: 'rgba(255, 0, 136, 0.3)', inner: '#ff33aa' },
  epic: { main: '#aa00ff', glow: 'rgba(170, 0, 255, 0.3)', inner: '#cc44ff' },
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    type: 'classic',
    speed: 0.3,
    walls: [],
    foodTypes: ['normal', 'bonus'],
    targetScore: 80,
    unlockReward: 'skin_1',
    hasDangerZone: false,
    hasShrinkingBorder: false,
  },
  {
    id: 2,
    type: 'classic',
    speed: 0.35,
    walls: [
      { position: { x: 5, y: 5 }, type: 'static' },
      { position: { x: 5, y: 6 }, type: 'static' },
      { position: { x: 14, y: 14 }, type: 'static' },
      { position: { x: 14, y: 15 }, type: 'static' },
    ],
    foodTypes: ['normal', 'bonus', 'super'],
    targetScore: 150,
    unlockReward: 'endless_mode',
    hasDangerZone: false,
    hasShrinkingBorder: false,
  },
  {
    id: 3,
    type: 'timedSurvival',
    speed: 0.4,
    walls: [
      { position: { x: 3, y: 3 }, type: 'static' },
      { position: { x: 3, y: 4 }, type: 'static' },
      { position: { x: 16, y: 16 }, type: 'static' },
      { position: { x: 16, y: 15 }, type: 'static' },
      { position: { x: 10, y: 3 }, type: 'moving', direction: 'RIGHT', speed: 0.5, rangeStart: { x: 5, y: 3 }, rangeEnd: { x: 15, y: 3 }, progress: 0 },
    ],
    foodTypes: ['normal', 'bonus', 'super', 'epic'],
    targetScore: 300,
    unlockReward: 'skill_system',
    hasDangerZone: false,
    hasShrinkingBorder: false,
    timeLimit: 300,
  },
  {
    id: 4,
    type: 'bounty',
    speed: 0.5,
    walls: [
      { position: { x: 2, y: 2 }, type: 'static' },
      { position: { x: 17, y: 17 }, type: 'static' },
      { position: { x: 10, y: 10 }, type: 'moving', direction: 'DOWN', speed: 0.3, rangeStart: { x: 10, y: 5 }, rangeEnd: { x: 10, y: 15 }, progress: 0 },
    ],
    foodTypes: ['normal', 'bonus', 'super', 'epic'],
    targetScore: 400,
    unlockReward: 'transformation_system',
    hasDangerZone: true,
    hasShrinkingBorder: false,
  },
  {
    id: 5,
    type: 'spaceEscape',
    speed: 0.6,
    walls: [
      { position: { x: 4, y: 4 }, type: 'static' },
      { position: { x: 15, y: 4 }, type: 'static' },
      { position: { x: 4, y: 15 }, type: 'static' },
      { position: { x: 15, y: 15 }, type: 'static' },
      { position: { x: 10, y: 8 }, type: 'moving', direction: 'RIGHT', speed: 0.4, rangeStart: { x: 6, y: 8 }, rangeEnd: { x: 14, y: 8 }, progress: 0 },
    ],
    foodTypes: ['normal', 'bonus', 'super', 'epic'],
    targetScore: 600,
    unlockReward: 'epic_skin',
    hasDangerZone: true,
    hasShrinkingBorder: true,
  },
]

export const SKILL_DEFINITIONS: Record<SkillId, { type: 'passive' | 'active'; maxCharge: number; cooldown: number; duration: number }> = {
  magnet: { type: 'passive', maxCharge: 1, cooldown: 0, duration: 0 },
  shield: { type: 'passive', maxCharge: 1, cooldown: 0, duration: 0 },
  scoreMultiplier: { type: 'passive', maxCharge: 1, cooldown: 0, duration: 15000 },
  fireball: { type: 'active', maxCharge: 3, cooldown: SKILL_COOLDOWN_DEFAULT, duration: 0 },
  ghost: { type: 'active', maxCharge: 1, cooldown: SKILL_COOLDOWN_DEFAULT, duration: GHOST_DURATION },
  magnetBurst: { type: 'active', maxCharge: 1, cooldown: SKILL_COOLDOWN_DEFAULT, duration: 0 },
  slowField: { type: 'active', maxCharge: 1, cooldown: SKILL_COOLDOWN_DEFAULT, duration: SLOW_FIELD_DURATION },
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

function randomFoodType(allowedTypes: FoodType[]): FoodType {
  const totalWeight = allowedTypes.reduce((sum, t) => sum + FOOD_SPAWN_WEIGHTS[t], 0)
  let r = Math.random() * totalWeight
  for (const t of allowedTypes) {
    r -= FOOD_SPAWN_WEIGHTS[t]
    if (r <= 0) return t
  }
  return allowedTypes[0]
}

function randomFood(snake: Point[], walls: Wall[], allowedTypes: FoodType[]): Food {
  const occupied = new Set([
    ...snake.map(p => `${p.x},${p.y}`),
    ...walls.map(w => `${w.position.x},${w.position.y}`),
  ])
  const available: Point[] = []
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y })
      }
    }
  }
  const pos = available[Math.floor(Math.random() * available.length)] || { x: 0, y: 0 }
  return { position: pos, type: randomFoodType(allowedTypes), spawnTime: Date.now() }
}

function createDefaultSkills(): Skill[] {
  return Object.entries(SKILL_DEFINITIONS).map(([id, def]) => ({
    id: id as SkillId,
    type: def.type,
    charge: 0,
    maxCharge: def.maxCharge,
    cooldown: def.cooldown,
    remainingCooldown: 0,
    isActive: false,
    duration: def.duration,
    remainingDuration: 0,
  }))
}

function createDefaultTransformation(): Transformation {
  return {
    type: 'none',
    remainingTime: 0,
    maxTime: 0,
    sizeMultiplier: 1,
    canPassWalls: false,
    canDestroyObstacles: false,
    isHidden: false,
  }
}

function createDefaultCombo(): ComboState {
  return { count: 0, lastEatTime: 0, multiplier: 1 }
}

function createDefaultDDA(): DDAState {
  return { recentEatTimes: [], adaptiveSpeedOffset: 0 }
}

function saveHighScore(score: number) {
  try { localStorage.setItem('neon_snake_high_score', String(score)) } catch { /* */ }
}

function saveLeaderboard(records: ScoreRecord[]) {
  try { localStorage.setItem('neon_snake_leaderboard', JSON.stringify(records)) } catch { /* */ }
}

function loadHighScoreFromStorage(): number {
  try { const val = localStorage.getItem('neon_snake_high_score'); return val ? parseInt(val, 10) : 0 } catch { return 0 }
}

function loadLeaderboardFromStorage(): ScoreRecord[] {
  try { const val = localStorage.getItem('neon_snake_leaderboard'); return val ? JSON.parse(val) : [] } catch { return [] }
}

function saveLevelProgress(progress: LevelProgress) {
  try { localStorage.setItem('neon_snake_level_progress', JSON.stringify(progress)) } catch { /* */ }
}

function loadLevelProgressFromStorage(): LevelProgress {
  try {
    const val = localStorage.getItem('neon_snake_level_progress')
    if (val) return JSON.parse(val)
  } catch { /* */ }
  return {
    currentLevel: 1,
    unlockedLevels: [1],
    completedLevels: [],
    unlockedSkins: [],
    unlockedSkills: [],
  }
}

interface GameStore {
  state: GameState
  snake: Point[]
  direction: Direction
  nextDirection: Direction
  foods: Food[]
  score: number
  highScore: number
  level: number
  speed: number
  particles: Particle[]
  walls: Wall[]
  dangerZones: DangerZone[]
  skills: Skill[]
  transformation: Transformation
  combo: ComboState
  levelConfig: LevelConfig
  levelProgress: LevelProgress
  dda: DDAState
  leaderboard: ScoreRecord[]
  shakeIntensity: number
  flashAlpha: number
  shrinkingBorder: number
  timeRemaining: number | null
  fireballs: { x: number; y: number; dx: number; dy: number; life: number }[]

  startGame: (levelId?: number) => void
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
  loadLevelProgress: () => void
  activateSkill: (skillId: SkillId) => void
  activateTransformation: (type: TransformationType) => void
  showLevelSelect: () => void
  hideLevelSelect: () => void
  updateDangerZones: () => void
  updateMovingWalls: () => void
  updateSkills: () => void
  updateTransformation: () => void
  updateCombo: () => void
  updateDDA: () => void
  updateShrinkingBorder: () => void
  updateFireballs: () => void
  updateTimeLimit: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: 'idle',
  snake: createInitialSnake(),
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  foods: [],
  score: 0,
  highScore: 0,
  level: 1,
  speed: BASE_SPEED,
  particles: [],
  walls: [],
  dangerZones: [],
  skills: createDefaultSkills(),
  transformation: createDefaultTransformation(),
  combo: createDefaultCombo(),
  levelConfig: LEVEL_CONFIGS[0],
  levelProgress: loadLevelProgressFromStorage(),
  dda: createDefaultDDA(),
  leaderboard: [],
  shakeIntensity: 0,
  flashAlpha: 0,
  shrinkingBorder: 0,
  timeRemaining: null,
  fireballs: [],

  loadHighScore: () => { set({ highScore: loadHighScoreFromStorage() }) },
  loadLeaderboard: () => { set({ leaderboard: loadLeaderboardFromStorage() }) },
  loadLevelProgress: () => { set({ levelProgress: loadLevelProgressFromStorage() }) },

  showLevelSelect: () => { set({ state: 'levelSelect' }) },
  hideLevelSelect: () => { set({ state: 'idle' }) },

  startGame: (levelId?: number) => {
    const lid = levelId ?? 1
    const config = LEVEL_CONFIGS.find(l => l.id === lid) || LEVEL_CONFIGS[0]
    const snake = createInitialSnake()
    const walls = config.walls.map(w => ({ ...w, progress: w.progress ?? 0 }))
    const food = randomFood(snake, walls, config.foodTypes)
    const gameSpeed = Math.max(MIN_SPEED, BASE_SPEED - (config.speed - 0.3) * 200)

    const initialSkills = createDefaultSkills()
    const shieldSkill = initialSkills.find(s => s.id === 'shield')
    if (shieldSkill) shieldSkill.charge = 1
    const fireballSkill = initialSkills.find(s => s.id === 'fireball')
    if (fireballSkill) fireballSkill.charge = 1

    set({
      state: 'playing',
      snake,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      foods: [food],
      score: 0,
      level: 1,
      speed: gameSpeed,
      particles: [],
      walls,
      dangerZones: [],
      skills: initialSkills,
      transformation: createDefaultTransformation(),
      combo: createDefaultCombo(),
      levelConfig: config,
      dda: createDefaultDDA(),
      shakeIntensity: 0,
      flashAlpha: 0,
      shrinkingBorder: 0,
      timeRemaining: config.timeLimit ?? null,
      fireballs: [],
    })
  },

  pauseGame: () => { if (get().state === 'playing') set({ state: 'paused' }) },
  resumeGame: () => { if (get().state === 'paused') set({ state: 'playing' }) },

  gameOver: () => {
    const { score, level, highScore, leaderboard, levelConfig, levelProgress } = get()
    const newHighScore = Math.max(score, highScore)
    if (newHighScore > highScore) saveHighScore(newHighScore)

    const newRecord: ScoreRecord = { score, level, date: new Date().toLocaleDateString('zh-CN') }
    const newLeaderboard = [...leaderboard, newRecord].sort((a, b) => b.score - a.score).slice(0, 10)
    saveLeaderboard(newLeaderboard)

    const newCompleted = score >= levelConfig.targetScore
      ? [...new Set([...levelProgress.completedLevels, levelConfig.id])]
      : levelProgress.completedLevels
    const newUnlocked = [...levelProgress.unlockedLevels]
    const nextLevel = LEVEL_CONFIGS.find(l => l.id === levelConfig.id + 1)
    if (newCompleted.length > levelProgress.completedLevels.length && nextLevel && !newUnlocked.includes(nextLevel.id)) {
      newUnlocked.push(nextLevel.id)
    }
    const newSkins = [...levelProgress.unlockedSkins]
    if (newCompleted.length > levelProgress.completedLevels.length && levelConfig.unlockReward.startsWith('skin_') && !newSkins.includes(levelConfig.unlockReward)) {
      newSkins.push(levelConfig.unlockReward)
    }
    const newProgress = { ...levelProgress, completedLevels: newCompleted, unlockedLevels: newUnlocked, unlockedSkins: newSkins }
    saveLevelProgress(newProgress)

    set({
      state: 'gameover',
      highScore: newHighScore,
      leaderboard: newLeaderboard,
      levelProgress: newProgress,
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
    const { snake, nextDirection, foods, score, level, state, walls, levelConfig, transformation, skills, combo } = get()
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

    const effectiveGridSize = GRID_SIZE - Math.floor(get().shrinkingBorder)
    const borderOffset = Math.floor(get().shrinkingBorder / 2)

    const ghostActive = skills.find(s => s.id === 'ghost' && s.isActive)
    if (!ghostActive && !transformation.canPassWalls) {
      if (
        newHead.x < borderOffset || newHead.x >= effectiveGridSize + borderOffset ||
        newHead.y < borderOffset || newHead.y >= effectiveGridSize + borderOffset
      ) {
        const shieldSkill = get().skills.find(s => s.id === 'shield' && s.charge > 0)
        if (shieldSkill) {
          set(s => ({
            skills: s.skills.map(sk => sk.id === 'shield' ? { ...sk, charge: sk.charge - 1 } : sk),
          }))
          switch (direction) {
            case 'UP': newHead = { x: head.x, y: borderOffset }; break
            case 'DOWN': newHead = { x: head.x, y: effectiveGridSize + borderOffset - 1 }; break
            case 'LEFT': newHead = { x: borderOffset, y: head.y }; break
            case 'RIGHT': newHead = { x: effectiveGridSize + borderOffset - 1, y: head.y }; break
          }
          get().addParticles(newHead.x * CELL_SIZE + CELL_SIZE / 2, newHead.y * CELL_SIZE + CELL_SIZE / 2, '#00e5ff', 15)
        } else {
          get().gameOver()
          return
        }
      }
    }

    if (!ghostActive && !transformation.canPassWalls) {
      if (snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        const shieldSkill = get().skills.find(s => s.id === 'shield' && s.charge > 0)
        if (shieldSkill) {
          set(s => ({ skills: s.skills.map(sk => sk.id === 'shield' ? { ...sk, charge: sk.charge - 1 } : sk) }))
          get().addParticles(newHead.x * CELL_SIZE + CELL_SIZE / 2, newHead.y * CELL_SIZE + CELL_SIZE / 2, '#00e5ff', 15)
        } else {
          get().gameOver()
          return
        }
      }
    }

    const wallAtHead = walls.find(w => w.position.x === newHead.x && w.position.y === newHead.y)
    if (wallAtHead) {
      if (transformation.canDestroyObstacles) {
        set(s => ({ walls: s.walls.filter(w => w !== wallAtHead) }))
        get().addParticles(newHead.x * CELL_SIZE + CELL_SIZE / 2, newHead.y * CELL_SIZE + CELL_SIZE / 2, '#ff4400', 20)
      } else if (!ghostActive) {
        const shieldSkill = get().skills.find(s => s.id === 'shield' && s.charge > 0)
        if (shieldSkill) {
          set(s => ({ skills: s.skills.map(sk => sk.id === 'shield' ? { ...sk, charge: sk.charge - 1 } : sk) }))
          get().addParticles(newHead.x * CELL_SIZE + CELL_SIZE / 2, newHead.y * CELL_SIZE + CELL_SIZE / 2, '#00e5ff', 15)
        } else {
          get().gameOver()
          return
        }
      }
    }

    const dangerAtHead = get().dangerZones.find(d => d.position.x === newHead.x && d.position.y === newHead.y)
    if (dangerAtHead && !ghostActive) {
      get().gameOver()
      return
    }

    const newSnake = [newHead, ...snake]
    let newScore = score
    let newLevel = level
    let newFoods = [...foods]
    let newSpeed = get().speed
    let newCombo = { ...combo }
    let newSkills = [...get().skills.map(s => ({ ...s }))]
    let newTransformation = { ...transformation }

    const magnetSkill = newSkills.find(s => s.id === 'magnet' && s.charge > 0)
    if (magnetSkill) {
      for (const food of newFoods) {
        const dx = food.position.x - newHead.x
        const dy = food.position.y - newHead.y
        const dist = Math.abs(dx) + Math.abs(dy)
        if (dist <= MAGNET_RANGE && dist > 0) {
          const moveX = dx === 0 ? 0 : dx > 0 ? -1 : 1
          const moveY = dy === 0 ? 0 : dy > 0 ? -1 : 1
          food.position = { x: food.position.x + moveX, y: food.position.y + moveY }
        }
      }
    }

    const eatenFood = newFoods.find(f => f.position.x === newHead.x && f.position.y === newHead.y)
    if (eatenFood) {
      const baseScore = FOOD_SCORES[eatenFood.type]
      const now = Date.now()

      if (now - newCombo.lastEatTime < COMBO_TIMEOUT) {
        newCombo.count++
        newCombo.multiplier = 1 + (newCombo.count - 1) * 0.5
      } else {
        newCombo.count = 1
        newCombo.multiplier = 1
      }
      newCombo.lastEatTime = now

      const scoreMultiplierSkill = newSkills.find(s => s.id === 'scoreMultiplier' && s.isActive)
      const totalMultiplier = newCombo.multiplier * (scoreMultiplierSkill ? 2 : 1)
      const randomBonus = Math.floor(Math.random() * 10) + 1
      newScore = score + Math.round(baseScore * totalMultiplier) + randomBonus

      if (eatenFood.type === 'bonus') {
        newSnake.pop()
      } else if (eatenFood.type === 'super') {
        newSpeed = Math.max(MIN_SPEED, newSpeed - 20)
      } else if (eatenFood.type === 'epic') {
        const transforms: TransformationType[] = ['mini', 'rage', 'chameleon']
        const tType = transforms[Math.floor(Math.random() * transforms.length)]
        newTransformation = {
          type: tType,
          remainingTime: TRANSFORMATION_DURATION,
          maxTime: TRANSFORMATION_DURATION,
          sizeMultiplier: tType === 'mini' ? 0.5 : 1,
          canPassWalls: false,
          canDestroyObstacles: tType === 'rage',
          isHidden: tType === 'chameleon',
        }
        get().addParticles(
          newHead.x * CELL_SIZE + CELL_SIZE / 2,
          newHead.y * CELL_SIZE + CELL_SIZE / 2,
          '#aa00ff', 25
        )
      }

      if (newScore >= levelConfig.targetScore) {
        const nextLevelId = levelConfig.id + 1
        if (nextLevelId <= LEVEL_CONFIGS.length) {
          set({ state: 'levelTransition', score: newScore })
          setTimeout(() => {
            const nextConfig = LEVEL_CONFIGS[nextLevelId - 1]
            get().startGame(nextLevelId)
          }, LEVEL_TRANSITION_DELAY)
          return
        } else {
          set({ state: 'gameover', score: newScore })
          for (let i = 0; i < 30; i++) {
            setTimeout(() => {
              const x = Math.random() * CANVAS_SIZE
              const y = Math.random() * CANVAS_SIZE
              const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#aa00ff', '#ff00ff']
              const color = colors[Math.floor(Math.random() * colors.length)]
              get().addParticles(x, y, color, 20)
            }, i * 100)
          }
          return
        }
      }

      newFoods = newFoods.filter(f => f !== eatenFood)
      const newFood = randomFood(newSnake, get().walls, levelConfig.foodTypes)
      newFoods.push(newFood)

      get().addParticles(
        eatenFood.position.x * CELL_SIZE + CELL_SIZE / 2,
        eatenFood.position.y * CELL_SIZE + CELL_SIZE / 2,
        FOOD_COLORS[eatenFood.type].main,
        12
      )

      if (levelConfig.id >= 1 && Math.random() < SKILL_SPAWN_CHANCE) {
        const skillIds: SkillId[] = ['magnet', 'shield', 'scoreMultiplier', 'fireball', 'ghost', 'magnetBurst', 'slowField']
        const randomSkillId = skillIds[Math.floor(Math.random() * skillIds.length)]
        const skill = newSkills.find(s => s.id === randomSkillId)
        if (skill && skill.charge < skill.maxCharge) {
          skill.charge++
        }
      }
    } else {
      newSnake.pop()
    }

    if (levelConfig.hasDangerZone) {
      const tail = newSnake[newSnake.length - 1]
      const existingDanger = get().dangerZones.find(d => d.position.x === tail.x && d.position.y === tail.y)
      if (!existingDanger) {
        set(s => ({
          dangerZones: [...s.dangerZones, {
            position: { x: tail.x, y: tail.y },
            remainingTime: DANGER_ZONE_LIFETIME,
            maxTime: DANGER_ZONE_LIFETIME,
          }]
        }))
      }
    }

    set({
      snake: newSnake,
      direction,
      foods: newFoods,
      score: newScore,
      level: newLevel,
      speed: newSpeed,
      combo: newCombo,
      skills: newSkills,
      transformation: newTransformation,
    })
  },

  addParticles: (x: number, y: number, color: string, count: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 1 + Math.random() * 3
      particles.push({
        x, y,
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

  setShakeIntensity: (intensity: number) => { set({ shakeIntensity: intensity }) },
  setFlashAlpha: (alpha: number) => { set({ flashAlpha: alpha }) },

  activateSkill: (skillId: SkillId) => {
    const { skills, state } = get()
    if (state !== 'playing') return
    const skill = skills.find(s => s.id === skillId)
    if (!skill || skill.charge <= 0 || skill.remainingCooldown > 0) return

    const newSkills = skills.map(s => {
      if (s.id !== skillId) return s
      if (s.type === 'passive') {
        return { ...s, isActive: true, charge: s.charge - 1, remainingDuration: s.duration }
      }
      return { ...s, charge: s.charge - 1, remainingCooldown: s.cooldown, isActive: s.duration > 0 }
    })

    if (skillId === 'fireball') {
      const dir = get().direction
      const head = get().snake[0]
      const dx = dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0
      const dy = dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0
      const newFireballs: { x: number; y: number; dx: number; dy: number; life: number }[] = []
      for (let i = 0; i < FIREBALL_COUNT; i++) {
        newFireballs.push({ x: head.x * CELL_SIZE + CELL_SIZE / 2, y: head.y * CELL_SIZE + CELL_SIZE / 2, dx: dx * 6, dy: dy * 6, life: 1 })
      }
      set(s => ({ fireballs: [...s.fireballs, ...newFireballs] }))
      get().addParticles(head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE + CELL_SIZE / 2, '#ff4400', 20)
    }

    if (skillId === 'magnetBurst') {
      const head = get().snake[0]
      const newFoods = get().foods.map(f => ({ ...f, position: { x: head.x, y: head.y } }))
      set({ foods: newFoods })
      get().addParticles(head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE + CELL_SIZE / 2, '#ffcc00', 30)
    }

    if (skillId === 'slowField') {
      set(s => ({ speed: s.speed * 2 }))
      get().addParticles(get().snake[0].x * CELL_SIZE + CELL_SIZE / 2, get().snake[0].y * CELL_SIZE + CELL_SIZE / 2, '#00ccff', 20)
    }

    set({ skills: newSkills })
  },

  activateTransformation: (type: TransformationType) => {
    const t: Transformation = {
      type,
      remainingTime: TRANSFORMATION_DURATION,
      maxTime: TRANSFORMATION_DURATION,
      sizeMultiplier: type === 'mini' ? 0.5 : 1,
      canPassWalls: false,
      canDestroyObstacles: type === 'rage',
      isHidden: type === 'chameleon',
    }
    set({ transformation: t })
    const head = get().snake[0]
    get().addParticles(head.x * CELL_SIZE + CELL_SIZE / 2, head.y * CELL_SIZE + CELL_SIZE / 2, '#aa00ff', 25)
  },

  updateDangerZones: () => {
    set(s => ({
      dangerZones: s.dangerZones
        .map(d => ({ ...d, remainingTime: d.remainingTime - 16 }))
        .filter(d => d.remainingTime > 0),
    }))
  },

  updateMovingWalls: () => {
    set(s => ({
      walls: s.walls.map(w => {
        if (w.type !== 'moving' || !w.rangeStart || !w.rangeEnd) return w
        const progress = ((w.progress ?? 0) + (w.speed ?? 0.5) * 0.01) % 2
        const t = progress < 1 ? progress : 2 - progress
        return {
          ...w,
          progress,
          position: {
            x: Math.round(w.rangeStart.x + (w.rangeEnd.x - w.rangeStart.x) * t),
            y: Math.round(w.rangeStart.y + (w.rangeEnd.y - w.rangeStart.y) * t),
          },
        }
      }),
    }))
  },

  updateSkills: () => {
    set(s => ({
      skills: s.skills.map(sk => {
        let updated = { ...sk }
        if (updated.remainingCooldown > 0) {
          updated.remainingCooldown = Math.max(0, updated.remainingCooldown - 16)
        }
        if (updated.isActive && updated.duration > 0) {
          updated.remainingDuration -= 16
          if (updated.remainingDuration <= 0) {
            updated.isActive = false
            updated.remainingDuration = 0
          }
        }
        return updated
      }),
    }))

    const slowField = get().skills.find(s => s.id === 'slowField' && s.isActive)
    if (slowField && slowField.remainingDuration <= 0) {
      const config = get().levelConfig
      const baseSpeed = Math.max(MIN_SPEED, BASE_SPEED - (config.speed - 0.3) * 200)
      const levelSpeed = Math.max(MIN_SPEED, baseSpeed - (get().level - 1) * SPEED_INCREMENT)
      set({ speed: levelSpeed })
    }
  },

  updateTransformation: () => {
    const t = get().transformation
    if (t.type === 'none') return
    const remaining = t.remainingTime - 16
    if (remaining <= 0) {
      set({ transformation: createDefaultTransformation() })
    } else {
      set({ transformation: { ...t, remainingTime: remaining } })
    }
  },

  updateCombo: () => {
    const { combo } = get()
    if (combo.count > 0 && Date.now() - combo.lastEatTime > COMBO_TIMEOUT) {
      set({ combo: createDefaultCombo() })
    }
  },

  updateDDA: () => {
    const { dda, score } = get()
    const now = Date.now()
    const recent = dda.recentEatTimes.filter(t => now - t < DDA_WINDOW)
    const eatRate = recent.length / (DDA_WINDOW / 1000)

    let offset = dda.adaptiveSpeedOffset
    if (eatRate > 2) {
      offset = Math.min(DDA_SPEED_ADJUST_RANGE, offset + 0.001)
    } else if (eatRate < 0.5 && score > 0) {
      offset = Math.max(-DDA_SPEED_ADJUST_RANGE, offset - 0.001)
    }

    set({ dda: { recentEatTimes: recent, adaptiveSpeedOffset: offset } })
  },

  updateShrinkingBorder: () => {
    const { levelConfig, score } = get()
    if (!levelConfig.hasShrinkingBorder) return
    const maxShrink = 6
    const progress = Math.min(score / levelConfig.targetScore, 1)
    set({ shrinkingBorder: progress * maxShrink })
  },

  updateFireballs: () => {
    set(s => ({
      fireballs: s.fireballs
        .map(f => ({ ...f, x: f.x + f.dx, y: f.y + f.dy, life: f.life - 0.03 }))
        .filter(f => f.life > 0 && f.x >= 0 && f.x <= CANVAS_SIZE && f.y >= 0 && f.y <= CANVAS_SIZE),
    }))

    const { fireballs, walls } = get()
    const hitWalls: Wall[] = []
    for (const fb of fireballs) {
      const gx = Math.floor(fb.x / CELL_SIZE)
      const gy = Math.floor(fb.y / CELL_SIZE)
      const hitWall = walls.find(w => w.position.x === gx && w.position.y === gy && !hitWalls.includes(w))
      if (hitWall) hitWalls.push(hitWall)
    }
    if (hitWalls.length > 0) {
      set(s => ({ walls: s.walls.filter(w => !hitWalls.includes(w)) }))
      for (const w of hitWalls) {
        get().addParticles(w.position.x * CELL_SIZE + CELL_SIZE / 2, w.position.y * CELL_SIZE + CELL_SIZE / 2, '#ff4400', 15)
      }
    }
  },

  updateTimeLimit: () => {
    const { timeRemaining, state } = get()
    if (timeRemaining === null || state !== 'playing') return
    const newTime = timeRemaining - 1
    if (newTime <= 0) {
      get().gameOver()
    } else {
      set({ timeRemaining: newTime })
    }
  },
}))
