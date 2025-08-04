'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Play, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  Bell,
  User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TournamentList } from '@/components/tournament/tournament-list'
import { PlayerRankings } from '@/components/tournament/player-rankings'
import { PairingVisualization } from '@/components/visualization/pairing-visualization'
import { PlayerAnalytics } from '@/components/analytics/player-analytics'
import { TournamentModal } from '@/components/tournament/tournament-modal'

interface DashboardStats {
  activeTournaments: number
  totalPlayers: number
  completedMatches: number
  avgRating: number
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('tournaments')
  const [stats, setStats] = useState<DashboardStats>({
    activeTournaments: 3,
    totalPlayers: 42,
    completedMatches: 127,
    avgRating: 1650
  })
  const [isCreatingTournament, setIsCreatingTournament] = useState(false)
  const [isGeneratingPairings, setIsGeneratingPairings] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)

  const handleCreateTournament = async (tournamentData?: any) => {
    setIsCreatingTournament(true)
    try {
      const newTournament = tournamentData || {
        name: `Chess Tournament ${new Date().toLocaleDateString()}`,
        startDate: new Date().toISOString(),
        rounds: 7,
        format: 'swiss'
      }
      
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTournament)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Tournament created:', result)
        alert(`Tournament "${newTournament.name}" created successfully!`)
        // Refresh stats
        setStats(prev => ({ ...prev, activeTournaments: prev.activeTournaments + 1 }))
      } else {
        throw new Error('Failed to create tournament')
      }
    } catch (error) {
      console.error('Error creating tournament:', error)
      alert('Failed to create tournament. Please try again.')
    } finally {
      setIsCreatingTournament(false)
    }
  }

  const handleOpenTournamentModal = () => {
    setShowTournamentModal(true)
  }

  const handleGeneratePairings = async () => {
    setIsGeneratingPairings(true)
    try {
      const response = await fetch('/api/pairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tournamentId: '1',
          round: 6
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Pairings generated:', result)
        alert(`Generated ${result.data.totalPairings} pairings for round ${result.data.round}`)
      } else {
        throw new Error('Failed to generate pairings')
      }
    } catch (error) {
      console.error('Error generating pairings:', error)
      alert('Failed to generate pairings. Please try again.')
    } finally {
      setIsGeneratingPairings(false)
    }
  }

  const handleExportData = () => {
    // Create a simple CSV export
    const csvData = `Player Name,Rating,Games Played,Win Rate
Alexandra Chen,2186,145,67.6%
Marcus Johnson,2145,132,64.4%
Sofia Rodriguez,2098,128,61.7%
David Kim,2205,198,71.7%
Emma Thompson,1987,89,62.9%`
    
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'chess-tournament-data.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFilterData = () => {
    alert('Filter options:\n- By rating range\n- By tournament status\n- By date range\n- By player activity\n\nFull filter implementation coming soon!')
  }

  const handleConfigure = () => {
    alert('Configuration options:\n- Tournament settings\n- Pairing preferences\n- Notification settings\n- Export formats\n\nConfiguration panel coming soon!')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 chess-app">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ChessPair AI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Active Tournaments</p>
                    <p className="text-3xl font-bold">{stats.activeTournaments}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Players</p>
                    <p className="text-3xl font-bold">{stats.totalPlayers}</p>
                  </div>
                  <Users className="h-8 w-8 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Completed Matches</p>
                    <p className="text-3xl font-bold">{stats.completedMatches}</p>
                  </div>
                  <Play className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Rating</p>
                    <p className="text-3xl font-bold">{stats.avgRating}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8"
        >
          <div className="flex space-x-1 p-1">
            {[
              { id: 'tournaments', label: 'Tournaments', icon: Trophy },
              { id: 'rankings', label: 'Rankings', icon: BarChart3 },
              { id: 'pairings', label: 'Pairings', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tournament Management</h2>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleOpenTournamentModal}
                  disabled={isCreatingTournament}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreatingTournament ? 'Creating...' : 'New Tournament'}
                </Button>
              </div>
              <TournamentList />
            </div>
          )}

          {activeTab === 'rankings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Player Rankings</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleFilterData}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    Export
                  </Button>
                </div>
              </div>
              <PlayerRankings />
            </div>
          )}

          {activeTab === 'pairings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Pairing Visualization</h2>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleGeneratePairings}
                  disabled={isGeneratingPairings}
                >
                  {isGeneratingPairings ? 'Generating...' : 'Generate Pairings'}
                </Button>
              </div>
              <PairingVisualization />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Player Analytics</h2>
                <Button variant="outline" size="sm" onClick={handleConfigure}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              <PlayerAnalytics />
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Tournament Creation Modal */}
      <TournamentModal
        isOpen={showTournamentModal}
        onClose={() => setShowTournamentModal(false)}
        onSubmit={handleCreateTournament}
      />
    </div>
  )
}
