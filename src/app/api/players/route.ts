import { NextRequest, NextResponse } from 'next/server'
import { Player } from '@/types'

// Mock data for demonstration
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
    draws: 15,
    isActive: true
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
    draws: 9,
    isActive: true
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
    draws: 8,
    isActive: true
  },
  {
    id: 'player4',
    name: 'David Kim',
    rating: 2205,
    email: 'david.kim@email.com',
    phone: '+1-555-0126',
    dateJoined: new Date('2022-11-05'),
    totalGames: 198,
    wins: 142,
    losses: 45,
    draws: 11,
    isActive: true
  },
  {
    id: 'player5',
    name: 'Emma Thompson',
    rating: 1987,
    email: 'emma.t@email.com',
    phone: '+1-555-0127',
    dateJoined: new Date('2023-05-12'),
    totalGames: 89,
    wins: 56,
    losses: 28,
    draws: 5,
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'rating'
    const order = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Sort players
    let sortedPlayers = [...mockPlayers]
    
    sortedPlayers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Player]
      let bValue: any = b[sortBy as keyof Player]
      
      if (sortBy === 'name') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    // Paginate
    const paginatedPlayers = sortedPlayers.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: paginatedPlayers,
      total: mockPlayers.length,
      pagination: {
        limit,
        offset,
        totalPages: Math.ceil(mockPlayers.length / limit),
        currentPage: Math.floor(offset / limit) + 1
      }
    })
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Check if email already exists
    const existingPlayer = mockPlayers.find(p => p.email === body.email)
    if (existingPlayer) {
      return NextResponse.json(
        { success: false, error: 'Player with this email already exists' },
        { status: 400 }
      )
    }
    
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      rating: body.rating || 1200, // Default starting rating
      dateJoined: new Date(),
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      isActive: true,
      preferences: {
        colorPreference: body.colorPreference || 'none',
        notifications: body.notifications ?? true
      }
    }
    
    // In a real app, save to database
    mockPlayers.push(newPlayer)
    
    return NextResponse.json({
      success: true,
      data: newPlayer
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create player' },
      { status: 500 }
    )
  }
}
