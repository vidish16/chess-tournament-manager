import { NextRequest, NextResponse } from 'next/server'
import { Tournament, Player, TournamentParticipant } from '@/types'

// Mock data for demonstration - in production, this would come from a database
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Spring Championship 2024',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    rounds: 7,
    currentRound: 5,
    status: 'active',
    participants: [
      {
        playerId: 'player1',
        tournamentId: '1',
        currentScore: 4.5,
        currentRating: 2186,
        colorBalance: { white: 3, black: 2 },
        pairings: []
      },
      {
        playerId: 'player2',
        tournamentId: '1',
        currentScore: 4.0,
        currentRating: 2145,
        colorBalance: { white: 2, black: 3 },
        pairings: []
      },
      {
        playerId: 'player3',
        tournamentId: '1',
        currentScore: 3.5,
        currentRating: 2098,
        colorBalance: { white: 3, black: 2 },
        pairings: []
      }
    ]
  },
  {
    id: '2',
    name: 'Weekly Blitz Tournament',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-03-20'),
    rounds: 5,
    currentRound: 5,
    status: 'completed',
    participants: []
  },
  {
    id: '3',
    name: 'Summer Open 2024',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-03'),
    rounds: 9,
    currentRound: 1,
    status: 'upcoming',
    participants: []
  }
]

const mockPlayers: Player[] = [
  {
    id: 'player1',
    name: 'Alexandra Chen',
    rating: 2186,
    email: 'alex.chen@email.com',
    phone: '+1-555-0123',
    dateJoined: new Date('2023-01-15'),
    totalGames: 145,
    wins: 98,
    losses: 32,
    draws: 15
  },
  {
    id: 'player2',
    name: 'Marcus Johnson',
    rating: 2145,
    email: 'marcus.j@email.com',
    phone: '+1-555-0124',
    dateJoined: new Date('2023-02-20'),
    totalGames: 132,
    wins: 85,
    losses: 38,
    draws: 9
  },
  {
    id: 'player3',
    name: 'Sofia Rodriguez',
    rating: 2098,
    email: 'sofia.r@email.com',
    phone: '+1-555-0125',
    dateJoined: new Date('2023-03-10'),
    totalGames: 128,
    wins: 79,
    losses: 41,
    draws: 8
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let filteredTournaments = mockTournaments
    
    if (status) {
      filteredTournaments = mockTournaments.filter(t => t.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredTournaments,
      total: filteredTournaments.length
    })
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.startDate || !body.rounds) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const newTournament: Tournament = {
      id: `tournament_${Date.now()}`,
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : new Date(body.startDate),
      rounds: body.rounds,
      currentRound: 1,
      status: 'upcoming',
      participants: []
    }
    
    // In a real app, save to database
    mockTournaments.push(newTournament)
    
    return NextResponse.json({
      success: true,
      data: newTournament
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}
