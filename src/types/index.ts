// Tournament and player types
export interface Player {
  id: string
  name: string
  rating: number
  email?: string
  phone?: string
  club?: string
  profileImage?: string
  dateJoined?: Date
  joinedAt?: Date
  isActive?: boolean
  totalGames?: number
  wins?: number
  losses?: number
  draws?: number
  preferences?: {
    colorPreference?: 'white' | 'black' | 'none'
    availableDays?: string[]
    notifications: boolean
  }
}

export interface Tournament {
  id: string
  name: string
  description?: string
  format?: 'swiss' | 'round-robin' | 'elimination'
  rounds: number
  currentRound: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  startDate: Date
  endDate?: Date
  timeControl?: string
  venue?: string
  director?: string
  maxParticipants?: number
  entryFee?: number
  prizes?: string[]
  rules?: string
  createdAt?: Date
  updatedAt?: Date
  participants?: TournamentParticipant[]
}

export interface Match {
  id: string
  tournamentId: string
  round: number
  board: number
  whitePlayerId: string
  blackPlayerId: string
  result?: 'white' | 'black' | 'draw' | 'bye'
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  startTime?: Date
  endTime?: Date
  moves?: string[] // PGN moves
  timeUsed?: {
    white: number
    black: number
  }
  notes?: string
}

export interface TournamentParticipant {
  id: string
  tournamentId: string
  playerId: string
  player: Player
  score: number
  tieBreaks: {
    buchholz?: number
    sonneborn?: number
    progressive?: number
  }
  colorHistory: ('white' | 'black' | 'bye')[]
  opponents: string[]
  isWithdrawn: boolean
  withdrawnAt?: Date
  seedNumber?: number
}

export interface Pairing {
  id: string
  tournamentId: string
  round: number
  board: number
  whitePlayer: Player
  blackPlayer: Player
  confidence: number // AI confidence score 0-1
  reasoning?: string // AI explanation for pairing decision
}

export interface RatingHistory {
  id: string
  playerId: string
  rating: number
  change: number
  tournamentId: string
  matchId: string
  date: Date
  kFactor: number
  opponentRating: number
  result: number // 0, 0.5, or 1
}

export interface TournamentSettings {
  ratingSystem: 'elo' | 'glicko' | 'custom'
  kFactor: number
  colorBalanceWeight: number
  ratingDifferenceWeight: number
  avoidRepeatWeight: number
  timeControl: string
  incrementSeconds: number
  byePoints: number
  defaultRating: number
  minRatingChange: number
  maxRatingChange: number
}

// UI and visualization types
export interface PairingNode {
  id: string
  playerId: string
  playerName: string
  rating: number
  x: number
  y: number
  color: 'white' | 'black' | 'neutral'
  isSelected: boolean
}

export interface PairingEdge {
  id: string
  source: string
  target: string
  round: number
  result?: 'white' | 'black' | 'draw'
  strength: number // line thickness based on frequency of play
}

export interface StandingsRow {
  rank: number
  player: Player
  score: number
  tieBreaks: {
    buchholz: number
    sonneborn: number
    progressive: number
  }
  performance: number
  colorBalance: number
  lastResult?: 'win' | 'loss' | 'draw' | 'bye'
  trend: 'up' | 'down' | 'stable'
}

export interface ChartDataPoint {
  round: number
  score: number
  rating: number
  rank: number
  date: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// AI and pairing algorithm types
export interface PairingRequest {
  tournamentId: string
  round: number
  participants: TournamentParticipant[]
  settings: TournamentSettings
  constraints?: {
    forcedPairings?: { white: string; black: string }[]
    forbiddenPairings?: { player1: string; player2: string }[]
    byePlayer?: string
  }
}

export interface PairingResponse {
  pairings: Pairing[]
  byePlayer?: Player
  confidence: number
  algorithmUsed: 'ai' | 'swiss' | 'fallback'
  explanation: string
  alternativePairings?: Pairing[][]
  warnings?: string[]
}

export interface SwissSystemConfig {
  avoidRepeatOpponents: boolean
  colorBalancing: boolean
  ratingBasedPairing: boolean
  acceleratedPairing: boolean
  perfectColorHistory: boolean
  minimumGamesBeforeRating: number
}

// Analytics and statistics types
export interface PlayerStatistics {
  playerId: string
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageOpponentRating: number
  performance: number
  currentStreak: number
  longestStreak: number
  favoriteOpenings: string[]
  timeManagement: {
    averageTimePerMove: number
    timeouts: number
    fastestWin: number
  }
  colorStats: {
    asWhite: { games: number; score: number }
    asBlack: { games: number; score: number }
  }
}

export interface TournamentAnalytics {
  tournamentId: string
  totalGames: number
  avgRatingDifference: number
  upsets: number
  perfectColorBalance: number
  repeatPairings: number
  avgGameDuration: number
  withdrawalRate: number
  ratingDistribution: { range: string; count: number }[]
  performanceByRating: { rating: number; performance: number }[]
}
