import { NextRequest, NextResponse } from 'next/server'
import { generateSwissPairings } from '@/lib/swiss-pairing'
import { TournamentParticipant, Pairing } from '@/types'

// Mock tournament data
const mockTournamentData: Record<string, TournamentParticipant[]> = {
  '1': [
    {
      id: 'tp1',
      playerId: 'player1',
      tournamentId: '1',
      player: { id: 'player1', name: 'Alexandra Chen', rating: 2186 },
      score: 4.5,
      tieBreaks: {},
      colorHistory: ['white', 'black', 'white', 'black', 'white'],
      opponents: ['player2', 'player3', 'player4', 'player5'],
      isWithdrawn: false
    },
    {
      id: 'tp2',
      playerId: 'player2',
      tournamentId: '1',
      player: { id: 'player2', name: 'Marcus Johnson', rating: 2145 },
      score: 4.0,
      tieBreaks: {},
      colorHistory: ['black', 'white', 'black', 'white', 'black'],
      opponents: ['player1', 'player3', 'player4', 'player5'],
      isWithdrawn: false
    },
    {
      id: 'tp3',
      playerId: 'player3',
      tournamentId: '1',
      player: { id: 'player3', name: 'Sofia Rodriguez', rating: 2098 },
      score: 3.5,
      tieBreaks: {},
      colorHistory: ['white', 'black', 'white', 'black', 'white'],
      opponents: ['player1', 'player2', 'player4', 'player5'],
      isWithdrawn: false
    },
    {
      id: 'tp4',
      playerId: 'player4',
      tournamentId: '1',
      player: { id: 'player4', name: 'David Kim', rating: 2205 },
      score: 3.5,
      tieBreaks: {},
      colorHistory: ['black', 'white', 'black', 'white', 'black'],
      opponents: ['player1', 'player2', 'player3', 'player5'],
      isWithdrawn: false
    },
    {
      id: 'tp5',
      playerId: 'player5',
      tournamentId: '1',
      player: { id: 'player5', name: 'Emma Thompson', rating: 1987 },
      score: 3.0,
      tieBreaks: {},
      colorHistory: ['white', 'black', 'white', 'black', 'white'],
      opponents: ['player1', 'player2', 'player3', 'player4'],
      isWithdrawn: false
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tournamentId, round } = body
    
    if (!tournamentId || !round) {
      return NextResponse.json(
        { success: false, error: 'Tournament ID and round are required' },
        { status: 400 }
      )
    }
    
    // Get tournament participants
    const participants = mockTournamentData[tournamentId]
    if (!participants) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found' },
        { status: 404 }
      )
    }
    
    // Generate pairings using Swiss system
    const pairings = generateSwissPairings(participants, round)
    
    // In a real app, save pairings to database
    console.log(`Generated ${pairings.length} pairings for tournament ${tournamentId}, round ${round}`)
    
    return NextResponse.json({
      success: true,
      data: {
        tournamentId,
        round,
        pairings,
        totalPairings: pairings.length
      }
    })
    
  } catch (error) {
    console.error('Error generating pairings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate pairings' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')
    const round = searchParams.get('round')
    
    if (!tournamentId) {
      return NextResponse.json(
        { success: false, error: 'Tournament ID is required' },
        { status: 400 }
      )
    }
    
    // Mock existing pairings for demonstration
    const mockPairings: Pairing[] = [
      {
        id: 'pair1',
        tournamentId,
        round: parseInt(round || '1'),
        board: 1,
        whitePlayer: { id: 'player1', name: 'Alexandra Chen', rating: 2186 },
        blackPlayer: { id: 'player2', name: 'Marcus Johnson', rating: 2145 },
        confidence: 0.9,
        reasoning: 'Top board pairing'
      },
      {
        id: 'pair2',
        tournamentId,
        round: parseInt(round || '1'),
        board: 2,
        whitePlayer: { id: 'player4', name: 'David Kim', rating: 2205 },
        blackPlayer: { id: 'player3', name: 'Sofia Rodriguez', rating: 2098 },
        confidence: 0.85,
        reasoning: 'Score group pairing'
      }
    ]
    
    let filteredPairings = mockPairings
    if (round) {
      filteredPairings = mockPairings.filter(p => p.round === parseInt(round))
    }
    
    return NextResponse.json({
      success: true,
      data: filteredPairings,
      total: filteredPairings.length
    })
    
  } catch (error) {
    console.error('Error fetching pairings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pairings' },
      { status: 500 }
    )
  }
}
