'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Trophy, Play, Settings, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TournamentDetail } from './tournament-detail'

interface Tournament {
  id: string
  name: string
  status: 'upcoming' | 'active' | 'completed'
  participants: number
  maxParticipants: number
  rounds: number
  currentRound: number
  startDate: string
  format: string
}

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Spring Championship 2024',
    status: 'active',
    participants: 24,
    maxParticipants: 32,
    rounds: 5,
    currentRound: 3,
    startDate: '2024-03-15',
    format: 'Swiss'
  },
  {
    id: '2',
    name: 'Weekly Blitz Tournament',
    status: 'upcoming',
    participants: 16,
    maxParticipants: 20,
    rounds: 4,
    currentRound: 0,
    startDate: '2024-03-22',
    format: 'Swiss'
  },
  {
    id: '3',
    name: 'Winter Classic 2024',
    status: 'completed',
    participants: 28,
    maxParticipants: 30,
    rounds: 6,
    currentRound: 6,
    startDate: '2024-02-10',
    format: 'Swiss'
  }
]

export function TournamentList() {
  const [tournaments, setTournaments] = useState(mockTournaments)
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null)

  const handleUpdateTournament = (updatedTournament: any) => {
    // This would typically update the tournament in your backend/state management
    console.log('Tournament updated:', updatedTournament)
  }

  if (selectedTournamentId) {
    const selectedTournament = tournaments.find(t => t.id === selectedTournamentId)
    if (selectedTournament) {
      // Convert the tournament list format to TournamentDetail format
      const tournamentDetailData = {
        id: selectedTournament.id,
        name: selectedTournament.name,
        rounds: selectedTournament.rounds,
        currentRound: selectedTournament.currentRound,
        timeControl: "5+3", // Default time control
        players: [
          // Mock players - in a real app, this would come from your data source
          { id: '1', name: 'Player 1', rating: 1800, score: 0, gamesPlayed: 0, winRate: 0 },
          { id: '2', name: 'Player 2', rating: 1750, score: 0, gamesPlayed: 0, winRate: 0 },
          { id: '3', name: 'Player 3', rating: 1900, score: 0, gamesPlayed: 0, winRate: 0 },
          { id: '4', name: 'Player 4', rating: 1650, score: 0, gamesPlayed: 0, winRate: 0 },
        ],
        pairings: []
      }
      
      return (
        <TournamentDetail 
          tournament={tournamentDetailData}
          onBack={() => setSelectedTournamentId(null)}
          onUpdateTournament={handleUpdateTournament}
        />
      )
    }
  }

  const handleViewTournament = (tournamentId: string) => {
    setSelectedTournamentId(tournamentId)
  }

  const handleEditTournament = (tournamentId: string) => {
    alert(`Editing tournament ${tournamentId}. Tournament editor coming soon!`)
  }

  const handleDeleteTournament = (tournamentId: string) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      setTournaments(prev => prev.filter(t => t.id !== tournamentId))
      alert('Tournament deleted successfully!')
    }
  }

  const handleStartTournament = (tournamentId: string) => {
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId 
        ? { ...t, status: 'active' as const, currentRound: 1 }
        : t
    ))
    alert('Tournament started! First round pairings generated.')
  }

  const handleNextRound = (tournamentId: string) => {
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId 
        ? { ...t, currentRound: Math.min(t.currentRound + 1, t.rounds) }
        : t
    ))
    alert('Advanced to next round! New pairings generated.')
  }

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Tournament['status']) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />
      case 'upcoming': return <Clock className="h-4 w-4" />
      case 'completed': return <Trophy className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament, index) => (
        <motion.div
          key={tournament.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900 font-semibold">{tournament.name}</CardTitle>
                  <CardDescription className="flex items-center mt-2 text-gray-700">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(tournament.status)}`}>
                  {getStatusIcon(tournament.status)}
                  <span className="capitalize">{tournament.status}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{tournament.format}</span>
                  </div>
                </div>
                
                {tournament.status === 'active' && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Progress</span>
                      <span className="font-medium text-gray-900">Round {tournament.currentRound}/{tournament.rounds}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(tournament.currentRound / tournament.rounds) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewTournament(tournament.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {tournament.status === 'active' && (
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleNextRound(tournament.id)}
                      disabled={tournament.currentRound >= tournament.rounds}
                    >
                      Next Round
                    </Button>
                  )}
                  
                  {tournament.status === 'upcoming' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStartTournament(tournament.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTournament(tournament.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTournament(tournament.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
