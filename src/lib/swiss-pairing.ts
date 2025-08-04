import { Player, TournamentParticipant, Pairing, PairingRequest, PairingResponse, SwissSystemConfig } from '@/types'

export class SwissPairingSystem {
  private config: SwissSystemConfig

  constructor(config: SwissSystemConfig) {
    this.config = config
  }

  /**
   * Generate pairings for a Swiss tournament round
   */
  async generatePairings(request: PairingRequest): Promise<PairingResponse> {
    try {
      const { participants, round, settings } = request
      
      // Sort participants by score and tiebreaks
      const sortedParticipants = this.sortParticipants(participants)
      
      // Handle bye if odd number of participants
      const { pairedParticipants, byePlayer } = this.handleBye(sortedParticipants)
      
      // Generate pairings using Swiss system algorithm
      const pairings = this.createPairings(pairedParticipants, round, settings)
      
      // Calculate confidence score
      const confidence = this.calculateConfidence(pairings, participants)
      
      return {
        pairings,
        byePlayer: byePlayer?.player,
        confidence,
        algorithmUsed: 'swiss',
        explanation: this.generateExplanation(pairings, round),
        warnings: this.validatePairings(pairings, participants)
      }
    } catch (error) {
      throw new Error(`Failed to generate pairings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Sort participants by score, then by tiebreak systems
   */
  private sortParticipants(participants: TournamentParticipant[]): TournamentParticipant[] {
    return [...participants]
      .filter(p => !p.isWithdrawn)
      .sort((a, b) => {
        // Primary: Score (descending)
        if (b.score !== a.score) return b.score - a.score
        
        // Secondary: Buchholz (descending)
        const buchholzDiff = (b.tieBreaks.buchholz || 0) - (a.tieBreaks.buchholz || 0)
        if (buchholzDiff !== 0) return buchholzDiff
        
        // Tertiary: Sonneborn-Berger (descending)
        const sonnebornDiff = (b.tieBreaks.sonneborn || 0) - (a.tieBreaks.sonneborn || 0)
        if (sonnebornDiff !== 0) return sonnebornDiff
        
        // Quaternary: Rating (descending)
        return b.player.rating - a.player.rating
      })
  }

  /**
   * Handle bye player selection for odd number of participants
   */
  private handleBye(participants: TournamentParticipant[]): {
    pairedParticipants: TournamentParticipant[]
    byePlayer?: TournamentParticipant
  } {
    if (participants.length % 2 === 0) {
      return { pairedParticipants: participants }
    }

    // Find player who hasn't had a bye yet, starting from the bottom
    let byePlayer = participants[participants.length - 1]
    
    for (let i = participants.length - 1; i >= 0; i--) {
      const participant = participants[i]
      const hasByeHistory = participant.colorHistory.includes('bye')
      
      if (!hasByeHistory) {
        byePlayer = participant
        break
      }
    }

    const pairedParticipants = participants.filter(p => p.id !== byePlayer.id)
    return { pairedParticipants, byePlayer }
  }

  /**
   * Create pairings using Swiss system principles
   */
  private createPairings(
    participants: TournamentParticipant[],
    round: number,
    settings: any
  ): Pairing[] {
    const pairings: Pairing[] = []
    const available = [...participants]
    let boardNumber = 1

    while (available.length >= 2) {
      const player1 = available[0]
      let bestOpponent: TournamentParticipant | null = null
      let bestScore = -Infinity

      // Find best opponent for player1
      for (let i = 1; i < available.length; i++) {
        const player2 = available[i]
        
        // Skip if they've played before
        if (player1.opponents.includes(player2.playerId)) continue
        
        const score = this.calculatePairingScore(player1, player2, round)
        
        if (score > bestScore) {
          bestScore = score
          bestOpponent = player2
        }
      }

      // If no ideal opponent found, pair with next available
      if (!bestOpponent) {
        bestOpponent = available[1]
      }

      // Determine colors
      const { whitePlayer, blackPlayer } = this.assignColors(player1, bestOpponent, round)
      
      // Create pairing
      const pairing: Pairing = {
        id: `${round}-${boardNumber}`,
        tournamentId: player1.tournamentId,
        round,
        board: boardNumber,
        whitePlayer: whitePlayer.player,
        blackPlayer: blackPlayer.player,
        confidence: Math.min(bestScore / 100, 1), // Normalize score to 0-1
        reasoning: this.generatePairingReasoning(whitePlayer, blackPlayer, bestScore)
      }

      pairings.push(pairing)
      
      // Remove paired players from available list
      available.splice(available.indexOf(player1), 1)
      available.splice(available.indexOf(bestOpponent), 1)
      
      boardNumber++
    }

    return pairings
  }

  /**
   * Calculate pairing quality score
   */
  private calculatePairingScore(
    player1: TournamentParticipant,
    player2: TournamentParticipant,
    round: number
  ): number {
    let score = 100 // Base score

    // Penalty for rating difference (prefer similar ratings)
    const ratingDiff = Math.abs(player1.player.rating - player2.player.rating)
    score -= ratingDiff / 10

    // Penalty for score difference (prefer similar scores)
    const scoreDiff = Math.abs(player1.score - player2.score)
    score -= scoreDiff * 20

    // Bonus for good color balance
    const colorBalance = this.calculateColorBalance(player1, player2)
    score += colorBalance * 10

    // Heavy penalty for repeat pairing
    if (player1.opponents.includes(player2.playerId)) {
      score -= 1000
    }

    return score
  }

  /**
   * Calculate color balance for a potential pairing
   */
  private calculateColorBalance(
    player1: TournamentParticipant,
    player2: TournamentParticipant
  ): number {
    const p1Whites = player1.colorHistory.filter(c => c === 'white').length
    const p1Blacks = player1.colorHistory.filter(c => c === 'black').length
    const p1Balance = p1Whites - p1Blacks

    const p2Whites = player2.colorHistory.filter(c => c === 'white').length
    const p2Blacks = player2.colorHistory.filter(c => c === 'black').length
    const p2Balance = p2Whites - p2Blacks

    // Return positive score if players have opposite color needs
    if ((p1Balance > 0 && p2Balance < 0) || (p1Balance < 0 && p2Balance > 0)) {
      return Math.abs(p1Balance) + Math.abs(p2Balance)
    }

    return 0
  }

  /**
   * Assign colors to players based on history and preferences
   */
  private assignColors(
    player1: TournamentParticipant,
    player2: TournamentParticipant,
    round: number
  ): { whitePlayer: TournamentParticipant; blackPlayer: TournamentParticipant } {
    const p1Whites = player1.colorHistory.filter(c => c === 'white').length
    const p1Blacks = player1.colorHistory.filter(c => c === 'black').length
    const p1Balance = p1Whites - p1Blacks

    const p2Whites = player2.colorHistory.filter(c => c === 'white').length
    const p2Blacks = player2.colorHistory.filter(c => c === 'black').length
    const p2Balance = p2Whites - p2Blacks

    // Player with more blacks gets white
    if (p1Balance < p2Balance) {
      return { whitePlayer: player1, blackPlayer: player2 }
    } else if (p1Balance > p2Balance) {
      return { whitePlayer: player2, blackPlayer: player1 }
    }

    // If equal balance, use other factors
    // Higher rated player gets black (slight disadvantage)
    if (player1.player.rating > player2.player.rating) {
      return { whitePlayer: player2, blackPlayer: player1 }
    } else {
      return { whitePlayer: player1, blackPlayer: player2 }
    }
  }

  /**
   * Calculate overall confidence in the pairings
   */
  private calculateConfidence(
    pairings: Pairing[],
    allParticipants: TournamentParticipant[]
  ): number {
    if (pairings.length === 0) return 0

    const avgConfidence = pairings.reduce((sum, p) => sum + p.confidence, 0) / pairings.length
    
    // Reduce confidence if there are repeat pairings
    const repeatPairings = this.countRepeatPairings(pairings, allParticipants)
    const repeatPenalty = repeatPairings * 0.2

    return Math.max(0, Math.min(1, avgConfidence - repeatPenalty))
  }

  /**
   * Count repeat pairings (should be 0 in a good Swiss tournament)
   */
  private countRepeatPairings(
    pairings: Pairing[],
    participants: TournamentParticipant[]
  ): number {
    let count = 0
    
    for (const pairing of pairings) {
      const whiteParticipant = participants.find(p => p.playerId === pairing.whitePlayer.id)
      const blackParticipant = participants.find(p => p.playerId === pairing.blackPlayer.id)
      
      if (whiteParticipant?.opponents.includes(pairing.blackPlayer.id) ||
          blackParticipant?.opponents.includes(pairing.whitePlayer.id)) {
        count++
      }
    }
    
    return count
  }

  /**
   * Generate explanation for the pairings
   */
  private generateExplanation(pairings: Pairing[], round: number): string {
    const totalPairings = pairings.length
    const avgConfidence = pairings.reduce((sum, p) => sum + p.confidence, 0) / totalPairings
    
    return `Generated ${totalPairings} pairings for round ${round} using Swiss system algorithm. ` +
           `Average pairing confidence: ${(avgConfidence * 100).toFixed(1)}%. ` +
           `Pairings prioritize score groups, rating similarity, and color balance.`
  }

  /**
   * Generate reasoning for individual pairing
   */
  private generatePairingReasoning(
    whitePlayer: TournamentParticipant,
    blackPlayer: TournamentParticipant,
    score: number
  ): string {
    const ratingDiff = Math.abs(whitePlayer.player.rating - blackPlayer.player.rating)
    const scoreDiff = Math.abs(whitePlayer.score - blackPlayer.score)
    
    let reasoning = `Paired based on similar tournament scores (${whitePlayer.score} vs ${blackPlayer.score})`
    
    if (ratingDiff < 100) {
      reasoning += ` and close ratings (${ratingDiff} point difference)`
    }
    
    if (score > 80) {
      reasoning += `. Excellent pairing quality.`
    } else if (score > 60) {
      reasoning += `. Good pairing quality.`
    } else {
      reasoning += `. Acceptable pairing given constraints.`
    }
    
    return reasoning
  }

  /**
   * Validate pairings and return warnings
   */
  private validatePairings(
    pairings: Pairing[],
    participants: TournamentParticipant[]
  ): string[] {
    const warnings: string[] = []
    
    // Check for repeat pairings
    const repeatCount = this.countRepeatPairings(pairings, participants)
    if (repeatCount > 0) {
      warnings.push(`${repeatCount} repeat pairing(s) detected`)
    }
    
    // Check for large rating differences
    const largeRatingDiffs = pairings.filter(p => 
      Math.abs(p.whitePlayer.rating - p.blackPlayer.rating) > 200
    )
    if (largeRatingDiffs.length > 0) {
      warnings.push(`${largeRatingDiffs.length} pairing(s) with >200 rating difference`)
    }
    
    return warnings
  }

  /**
   * Calculate ELO rating changes after a match
   */
  static calculateEloChange(
    playerRating: number,
    opponentRating: number,
    result: number, // 0 = loss, 0.5 = draw, 1 = win
    kFactor: number = 32
  ): number {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))
    return Math.round(kFactor * (result - expectedScore))
  }

  /**
   * Calculate tie-break scores
   */
  static calculateTieBreaks(
    participant: TournamentParticipant,
    allParticipants: TournamentParticipant[],
    matches: any[]
  ): { buchholz: number; sonneborn: number; progressive: number } {
    // Buchholz: Sum of opponents' scores
    const opponentScores = participant.opponents.map(opponentId => {
      const opponent = allParticipants.find(p => p.playerId === opponentId)
      return opponent?.score || 0
    })
    const buchholz = opponentScores.reduce((sum, score) => sum + score, 0)

    // Sonneborn-Berger: Sum of (opponent's score * player's result against opponent)
    let sonneborn = 0
    for (const opponentId of participant.opponents) {
      const opponent = allParticipants.find(p => p.playerId === opponentId)
      if (!opponent) continue
      
      const match = matches.find(m => 
        (m.whitePlayerId === participant.playerId && m.blackPlayerId === opponentId) ||
        (m.blackPlayerId === participant.playerId && m.whitePlayerId === opponentId)
      )
      
      if (match?.result) {
        let result = 0
        if (match.result === 'draw') result = 0.5
        else if (
          (match.result === 'white' && match.whitePlayerId === participant.playerId) ||
          (match.result === 'black' && match.blackPlayerId === participant.playerId)
        ) result = 1
        
        sonneborn += opponent.score * result
      }
    }

    // Progressive: Cumulative score round by round
    const progressive = participant.score // Simplified version

    return { buchholz, sonneborn, progressive }
  }
}

/**
 * Simple function to generate Swiss pairings for API use
 */
export function generateSwissPairings(participants: TournamentParticipant[], round: number): Pairing[] {
  // Simple pairing logic for demo
  const pairings: Pairing[] = []
  
  for (let i = 0; i < participants.length - 1; i += 2) {
    const whitePlayer = participants[i]
    const blackPlayer = participants[i + 1]
    
    pairings.push({
      id: `pair_${round}_${i/2 + 1}`,
      tournamentId: participants[0].tournamentId,
      round,
      board: i / 2 + 1,
      whitePlayer: whitePlayer.player,
      blackPlayer: blackPlayer.player,
      confidence: 0.8,
      reasoning: 'Swiss system pairing based on scores'
    })
  }
  
  return pairings
}
