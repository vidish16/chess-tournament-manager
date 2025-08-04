'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Target, Play } from 'lucide-react'
import Image from 'next/image'
import { PlayerRegistration } from '@/components/player/player-registration'
import { TournamentSetup } from '@/components/tournament/tournament-setup'
import { TournamentDetail } from '@/components/tournament/tournament-detail'

interface Player {
  id: string
  name: string
  rating: number
  score: number
  winRate: number
}

interface Tournament {
  id: string
  name: string
  status: 'setup' | 'active' | 'completed'
  players: Player[]
  rounds: number
  currentRound: number
  format: 'swiss' | 'round-robin'
  pairings: Pairing[]
  results: any[]
  startDate: string
  endDate?: string
  timeControl: string
  venue: string
}

interface Pairing {
  id: string
  round: number
  player1: Player
  player2: Player | null // null for bye
  result?: 'white' | 'black' | 'draw' | 'bye' | null
  boardNumber: number
}

// Swiss pairing algorithm (simplified)
const generateSwissPairings = (players: Player[], round: number): Pairing[] => {
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
  const pairings: Pairing[] = []
  const paired = new Set<string>()
  let boardNumber = 1

  // Handle BYE first if odd number of players
  if (sortedPlayers.length % 2 === 1) {
    // Give BYE to the lowest-ranked player (last in sorted array)
    const byePlayer = sortedPlayers[sortedPlayers.length - 1]
    paired.add(byePlayer.id)
    
    pairings.push({
      id: `${round}-${boardNumber}`,
      round,
      player1: byePlayer,
      player2: null, // No opponent
      result: 'bye', // Automatic bye result
      boardNumber: boardNumber++
    })
  }

  // Pair remaining players
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (paired.has(sortedPlayers[i].id)) continue

    const player1 = sortedPlayers[i]
    let player2: Player | null = null

    // Find the best opponent
    for (let j = i + 1; j < sortedPlayers.length; j++) {
      if (!paired.has(sortedPlayers[j].id)) {
        player2 = sortedPlayers[j]
        paired.add(sortedPlayers[j].id)
        break
      }
    }

    if (player2) {
      paired.add(player1.id)

      pairings.push({
        id: `${round}-${boardNumber}`,
        round,
        player1,
        player2,
        result: null,
        boardNumber: boardNumber++
      })
    }
  }

  return pairings
}

export function SimpleDashboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null)
  const [activeTab, setActiveTab] = useState<'players' | 'tournament' | 'active'>('players')

  // Auto-switch to active tab when tournament is completed
  useEffect(() => {
    if (currentTournament && currentTournament.currentRound > currentTournament.rounds) {
      // Tournament is complete, ensure we're on the active tab to show results
      setActiveTab('active')
    }
  }, [currentTournament?.currentRound, currentTournament?.rounds])

  // Player management
  const handleAddPlayer = (playerData: { name: string; rating: number }) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      ...playerData,
      score: 0,
      winRate: 0
    }
    setPlayers(prev => [...prev, newPlayer])
  }

  const handleEditPlayer = (id: string, playerData: { name: string; rating: number }) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...playerData } : p))
  }

  const handleDeletePlayer = (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(prev => prev.filter(p => p.id !== id))
    }
  }

  // Tournament management
  const handleCreateTournament = (setup: { name: string; rounds: number; format: 'swiss' | 'round-robin'; timeControl: string }) => {
    const tournamentPlayers = players.map(p => ({ 
      ...p, 
      score: 0, 
      winRate: 0 
    }))
    const initialPairings = setup.format === 'swiss' 
      ? generateSwissPairings(tournamentPlayers, 1)
      : [] // Round robin pairings would be generated differently

    // Give BYE players their automatic point
    const playersWithByePoints = tournamentPlayers.map(player => {
      const byePairing = initialPairings.find(p => p.player1.id === player.id && !p.player2)
      return byePairing ? { ...player, score: 1 } : player
    })

    const tournament: Tournament = {
      id: Date.now().toString(),
      name: setup.name,
      status: 'active',
      players: playersWithByePoints,
      rounds: setup.rounds,
      currentRound: 1,
      format: setup.format,
      pairings: initialPairings,
      results: [],
      startDate: new Date().toISOString().split('T')[0],
      timeControl: setup.timeControl,
      venue: 'Local Chess Club'
    }
    setCurrentTournament(tournament)
    setActiveTab('active')
  }

  const handleUpdateTournament = (updatedTournament: Tournament) => {
    setCurrentTournament(updatedTournament)
  }

  const handleBackToSetup = () => {
    setCurrentTournament(null)
    setActiveTab('players')
  }

  const tabs = [
    { id: 'players', label: 'Players', icon: Users, count: players.length },
    { id: 'tournament', label: 'Setup', icon: Trophy, disabled: players.length < 4 },
    { id: 'active', label: 'Active', icon: Play, disabled: !currentTournament }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image 
              src="/logo.png" 
              alt="Chess Tournament Manager Logo" 
              width={192} 
              height={192}
              className="rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chess Tournament Manager</h1>
              <p className="text-gray-600 mt-1">Simple, automated chess pairing system</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registered Players</p>
                <p className="text-2xl font-semibold text-gray-900">{players.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tournament Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currentTournament ? 
                    (currentTournament.currentRound > currentTournament.rounds ? 'Complete' : 'Active') : 
                    'None'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Round</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currentTournament ? 
                    (currentTournament.currentRound > currentTournament.rounds ? 
                      'Complete' : 
                      `${currentTournament.currentRound}/${currentTournament.rounds}`
                    ) : '-'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                  disabled={tab.disabled}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'players' && (
            <PlayerRegistration
              players={players}
              onAddPlayer={handleAddPlayer}
              onEditPlayer={handleEditPlayer}
              onDeletePlayer={handleDeletePlayer}
            />
          )}

          {activeTab === 'tournament' && (
            <TournamentSetup
              playerCount={players.length}
              onCreateTournament={handleCreateTournament}
              disabled={players.length < 4}
            />
          )}

          {activeTab === 'active' && currentTournament && (
            <TournamentDetail
              tournament={currentTournament}
              onBack={handleBackToSetup}
              onUpdateTournament={handleUpdateTournament}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
