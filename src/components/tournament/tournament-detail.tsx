'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Player {
  id: string
  name: string
  rating: number
  score: number
  gamesPlayed: number
  winRate: number
}

interface Pairing {
  id: string
  player1: Player
  player2?: Player
  result?: '1-0' | '0-1' | '1/2-1/2'
  round: number
}

interface Tournament {
  id: string
  name: string
  rounds: number
  currentRound: number
  timeControl: string
  players: Player[]
  pairings: Pairing[]
}

interface TournamentDetailProps {
  tournament: Tournament
  onBack: () => void
  onUpdateTournament: (tournament: Tournament) => void
}

export function TournamentDetail({ tournament, onBack, onUpdateTournament }: TournamentDetailProps) {
  const isTournamentComplete = tournament.currentRound > tournament.rounds
  const [activeTab, setActiveTab] = useState<'pairings' | 'results' | 'table'>(
    isTournamentComplete ? 'results' : 'pairings'
  )
  const [selectedRound, setSelectedRound] = useState<number>(tournament.currentRound)

  // Auto-switch to results tab when tournament completes
  useEffect(() => {
    if (tournament.currentRound > tournament.rounds) {
      setActiveTab('results')
    }
  }, [tournament.currentRound, tournament.rounds])

  const getResultText = (result: '1-0' | '0-1' | '1/2-1/2') => {
    switch (result) {
      case '1-0': return 'White wins'
      case '0-1': return 'Black wins'
      case '1/2-1/2': return 'Draw'
      default: return result
    }
  }

  const getResultColor = (result: '1-0' | '0-1' | '1/2-1/2') => {
    switch (result) {
      case '1-0': return 'bg-green-100 text-green-800 border-green-300'
      case '0-1': return 'bg-blue-100 text-blue-800 border-blue-300'
      case '1/2-1/2': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const generateSwissPairings = (players: Player[], round: number): Pairing[] => {
    const sortedPlayers = [...players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.rating - a.rating
    })

    const pairings: Pairing[] = []
    const paired = new Set<string>()

    // Handle BYE first if odd number of players
    if (sortedPlayers.length % 2 === 1) {
      // Give BYE to the lowest-ranked player (last in sorted array)
      const byePlayer = sortedPlayers[sortedPlayers.length - 1]
      paired.add(byePlayer.id)
      
      pairings.push({
        id: `${round}-${byePlayer.id}-bye`,
        player1: byePlayer, // BYE player
        player2: undefined, // No opponent
        round,
        result: '1-0' // Auto-win for BYE
      })
    }

    // Pair remaining players
    for (let i = 0; i < sortedPlayers.length; i++) {
      if (paired.has(sortedPlayers[i].id)) continue

      const player1 = sortedPlayers[i]
      let player2: Player | undefined

      for (let j = i + 1; j < sortedPlayers.length; j++) {
        if (!paired.has(sortedPlayers[j].id)) {
          player2 = sortedPlayers[j]
          paired.add(sortedPlayers[j].id)
          break
        }
      }

      if (player2) {
        paired.add(player1.id)

        // Randomly assign colors (who plays white/black)
        const randomColor = Math.random() < 0.5
        const whitePlayer = randomColor ? player1 : player2
        const blackPlayer = randomColor ? player2 : player1

        pairings.push({
          id: `${round}-${player1.id}-${player2.id}`,
          player1: whitePlayer,
          player2: blackPlayer,
          round,
          result: undefined
        })
      }
    }

    return pairings
  }

  const handleResultSubmit = (pairingId: string, result: '1-0' | '0-1' | '1/2-1/2') => {
    // Get current round pairings (including dynamically generated ones)
    const currentRoundPairings = tournament.pairings.filter(p => p.round === selectedRound)
    const allCurrentPairings = currentRoundPairings.length > 0 
      ? currentRoundPairings 
      : generateSwissPairings(tournament.players, selectedRound)
    
    // Find the specific pairing we're updating
    const targetPairing = allCurrentPairings.find(p => p.id === pairingId)
    if (!targetPairing) return
    
    // Update the pairing with the result
    const updatedPairing = { ...targetPairing, result }
    
    // Remove old pairings for this round and add the updated one
    const otherPairings = tournament.pairings.filter(p => p.round !== selectedRound)
    const updatedCurrentPairings = allCurrentPairings.map(p => 
      p.id === pairingId ? updatedPairing : p
    )
    const updatedPairings = [...otherPairings, ...updatedCurrentPairings]
    
    // Update player scores based on all their pairings
    const updatedPlayers = tournament.players.map(player => {
      let newScore = 0
      let newGamesPlayed = 0
      
      // Calculate total score from all pairings
      updatedPairings.forEach(pairing => {
        if (!pairing.result) return
        
        if (pairing.player1.id === player.id) {
          newGamesPlayed += 1
          if (pairing.result === '1-0') newScore += 1
          else if (pairing.result === '1/2-1/2') newScore += 0.5
        } else if (pairing.player2?.id === player.id) {
          newGamesPlayed += 1
          if (pairing.result === '0-1') newScore += 1
          else if (pairing.result === '1/2-1/2') newScore += 0.5
        }
        
        // Handle BYE for player1 (automatic win)
        if (!pairing.player2 && pairing.player1.id === player.id) {
          // Already counted above with 1-0 result
        }
      })
      
      const newWinRate = newGamesPlayed > 0 ? newScore / newGamesPlayed : 0
      
      return {
        ...player,
        score: newScore,
        gamesPlayed: newGamesPlayed,
        winRate: newWinRate
      }
    })
    
    // Check if current round is complete after this result
    const updatedCurrentRoundPairings = updatedPairings.filter(p => p.round === selectedRound)
    const isCurrentRoundComplete = updatedCurrentRoundPairings.length > 0 && 
      updatedCurrentRoundPairings.every(p => p.result || !p.player2)
    
    // Auto-advance to next round if current round is complete
    let nextRound = tournament.currentRound
    if (isCurrentRoundComplete && selectedRound === tournament.currentRound) {
      // If this is the final round, mark tournament as complete
      if (tournament.currentRound >= tournament.rounds) {
        nextRound = tournament.rounds + 1 // Mark as complete
      } else {
        nextRound = tournament.currentRound + 1
      }
    }
    
    // Update the tournament
    const updatedTournament = {
      ...tournament,
      pairings: updatedPairings,
      players: updatedPlayers,
      currentRound: nextRound
    }
    
    onUpdateTournament(updatedTournament)
    
    // Auto-switch to next round view if we advanced
    if (nextRound > tournament.currentRound) {
      setSelectedRound(nextRound)
    }
  }

  const handleAdvanceRound = () => {
    if (tournament.currentRound < tournament.rounds) {
      const updatedTournament = {
        ...tournament,
        currentRound: tournament.currentRound + 1
      }
      onUpdateTournament(updatedTournament)
    }
  }

  const currentRoundPairings = tournament.pairings.filter(p => p.round === selectedRound)
  const displayPairings = currentRoundPairings.length > 0 
    ? currentRoundPairings 
    : generateSwissPairings(tournament.players, selectedRound)

  const canEnterResults = selectedRound === tournament.currentRound
  const isRoundComplete = displayPairings.length > 0 && 
    displayPairings.every(p => p.result || !p.player2)

  const getRoundStatus = (round: number) => {
    if (round < tournament.currentRound) return 'Complete'
    if (round === tournament.currentRound) return 'Current'
    return 'Future'
  }

  const renderTable = () => {
    // Get all completed rounds (cap at tournament.rounds)
    const maxRounds = Math.min(tournament.currentRound, tournament.rounds)
    const completedRounds = Array.from({ length: maxRounds }, (_, i) => i + 1)
    
    // Get all pairings for completed rounds
    const allPairings = completedRounds.flatMap(round => {
      const roundPairings = tournament.pairings.filter(p => p.round === round)
      return roundPairings.length > 0 ? roundPairings : generateSwissPairings(tournament.players, round)
    })

    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Results Table</h3>
          <p className="text-sm text-gray-600">Round-wise results for all players</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  {completedRounds.map(round => (
                    <th key={round} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      R{round}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tournament.players
                  .sort((a, b) => b.score - a.score || b.rating - a.rating)
                  .map((player, index) => {
                    return (
                      <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-3">
                              {index + 1}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {player.rating}
                        </td>
                        {completedRounds.map(round => {
                          // Find this player's pairing for this round
                          const pairing = allPairings.find(p => 
                            p.round === round && (p.player1.id === player.id || p.player2?.id === player.id)
                          )
                          
                          if (!pairing) {
                            return (
                              <td key={round} className="px-4 py-3 text-center">
                                <span className="text-gray-400">-</span>
                              </td>
                            )
                          }

                          // Determine result from player's perspective
                          let resultText = '-'
                          let resultClass = 'text-gray-400'
                          
                          if (pairing.result) {
                            const isPlayer1 = pairing.player1.id === player.id
                            const isPlayer2 = pairing.player2?.id === player.id
                            
                            if (!pairing.player2) {
                              // BYE round
                              resultText = 'BYE'
                              resultClass = 'text-blue-600 font-medium'
                            } else if (pairing.result === '1-0') {
                              resultText = isPlayer1 ? 'W' : 'L'
                              resultClass = isPlayer1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                            } else if (pairing.result === '0-1') {
                              resultText = isPlayer2 ? 'W' : 'L'
                              resultClass = isPlayer2 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                            } else if (pairing.result === '1/2-1/2') {
                              resultText = 'D'
                              resultClass = 'text-yellow-600 font-medium'
                            }
                          }

                          return (
                            <td key={round} className="px-4 py-3 text-center">
                              <span className={`text-sm ${resultClass}`}>
                                {resultText}
                              </span>
                            </td>
                          )
                        })}
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {player.score}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Legend:</span> W = Win, L = Loss, D = Draw, BYE = Bye round (automatic win)
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPairings = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Round {selectedRound} Pairings</h3>
          <div className="text-sm text-gray-700 font-medium">
            Status: <Badge variant={getRoundStatus(selectedRound) === 'Current' ? 'default' : 'secondary'}
              className={getRoundStatus(selectedRound) === 'Current' 
                ? 'bg-blue-600 text-white font-medium' 
                : 'bg-gray-200 text-gray-800 font-medium'
              }>
              {getRoundStatus(selectedRound)}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <Select value={selectedRound.toString()} onValueChange={(value: string) => setSelectedRound(parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: tournament.rounds}, (_, i) => i + 1).map(round => (
                <SelectItem key={round} value={round.toString()}>
                  Round {round} {getRoundStatus(round) === 'Current' && '(Current)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {canEnterResults && isRoundComplete && selectedRound < tournament.rounds && (
            <Button onClick={handleAdvanceRound} className="bg-green-600 hover:bg-green-700">
              Advance to Round {tournament.currentRound + 1}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {displayPairings.map((pairing, index) => (
          <Card key={pairing.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">Board {index + 1}</div>
                    {pairing.result && (
                      <Badge variant="outline" className={`text-xs font-medium ${getResultColor(pairing.result)}`}>
                        {getResultText(pairing.result)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded-sm mr-2" title="White pieces"></div>
                        <span className="font-medium text-gray-900">{pairing.player1.name}</span>
                        <span className="text-sm text-gray-700 ml-2">({pairing.player1.rating})</span>
                      </div>
                      <div className="text-right text-sm text-gray-800 font-medium">
                        Score: {pairing.player1.score} | Win Rate: {(pairing.player1.winRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    {pairing.player2 ? (
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-800 border-2 border-gray-400 rounded-sm mr-2" title="Black pieces"></div>
                          <span className="font-medium text-gray-900">{pairing.player2.name}</span>
                          <span className="text-sm text-gray-700 ml-2">({pairing.player2.rating})</span>
                        </div>
                        <div className="text-right text-sm text-gray-800 font-medium">
                          Score: {pairing.player2.score} | Win Rate: {(pairing.player2.winRate * 100).toFixed(1)}%
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <span className="text-blue-700 font-medium">BYE (Automatic Win)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Result Entry - Only for current round */}
                {canEnterResults && !pairing.result && pairing.player2 && (
                  <div className="lg:w-56">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 text-center">Enter Result:</div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs hover:bg-green-100 hover:border-green-400 hover:text-green-800 font-medium px-1"
                          onClick={() => handleResultSubmit(pairing.id, '1-0')}
                        >
                          White
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs hover:bg-yellow-100 hover:border-yellow-400 hover:text-yellow-800 font-medium px-1"
                          onClick={() => handleResultSubmit(pairing.id, '1/2-1/2')}
                        >
                          Draw
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 font-medium px-1"
                          onClick={() => handleResultSubmit(pairing.id, '0-1')}
                        >
                          Black
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show result for historical rounds */}
                {pairing.result && (
                  <div className="lg:w-56 text-center">
                    <Badge variant="secondary" className={`text-sm font-medium ${getResultColor(pairing.result)}`}>
                      {getResultText(pairing.result)}
                    </Badge>
                  </div>
                )}

                {/* Handle BYE */}
                {!pairing.player2 && (
                  <div className="lg:w-56 text-center">
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      ✓ +1 Point (BYE)
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderResults = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Current Standings</CardTitle>
        <CardDescription className="text-gray-600">
          After {tournament.currentRound} rounds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tournament.players
            .sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score
              return b.rating - a.rating
            })
            .map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-800">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-700 font-medium">Rating: {player.rating}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg text-gray-900">{player.score} pts</div>
                  <div className="text-sm text-gray-700 font-medium">
                    Win Rate: {(player.winRate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderFinalLeaderboard = () => {
    const sortedPlayers = [...tournament.players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.rating - a.rating
    })

    const getTrophyIcon = (position: number) => {
      switch (position) {
        case 0: return '🏆'
        case 1: return '🥈'
        case 2: return '🥉'
        default: return '🏅'
      }
    }

    const getPositionColor = (position: number) => {
      switch (position) {
        case 0: return 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg'
        case 1: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg'
        case 2: return 'bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg'
        default: return 'bg-gray-50 text-gray-900 border-gray-200'
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Tournament Complete! 🎉</h2>
          <p className="text-gray-600">Final results for {tournament.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 text-center">Final Leaderboard</CardTitle>
            <CardDescription className="text-gray-600 text-center">
              After {tournament.rounds} rounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  index < 3 ? 'border-white border-opacity-30' : 'border-gray-200'
                } ${getPositionColor(index)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getTrophyIcon(index)}</div>
                  <div className="text-2xl font-bold min-w-[3rem]">#{index + 1}</div>
                  <div>
                    <div className={`font-bold text-lg ${index < 3 ? 'text-white drop-shadow-sm' : 'text-gray-900'}`}>
                      {player.name}
                    </div>
                    <div className={`text-sm ${index < 3 ? 'text-white text-opacity-95 drop-shadow-sm' : 'text-gray-600'}`}>
                      Rating: {player.rating} • Games: {player.gamesPlayed}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-2xl ${index < 3 ? 'text-white drop-shadow-sm' : 'text-gray-900'}`}>
                    {player.score} pts
                  </div>
                  <div className={`text-sm ${index < 3 ? 'text-white text-opacity-95 drop-shadow-sm' : 'text-gray-600'}`}>
                    Win Rate: {(player.winRate * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="px-3 py-2">
            ← Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{tournament.name}</h2>
            <p className="text-gray-600">
              {tournament.timeControl} • {tournament.rounds} rounds
              {isTournamentComplete && (
                <span className="ml-2 text-green-600 font-semibold">• COMPLETE</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isTournamentComplete ? (
            <>
              <Button
                variant={activeTab === 'pairings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pairings')}
                className={activeTab === 'pairings' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                Pairings
              </Button>
              <Button
                variant={activeTab === 'results' ? 'default' : 'outline'}
                onClick={() => setActiveTab('results')}
                className={activeTab === 'results' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                Results
              </Button>
              <Button
                variant={activeTab === 'table' ? 'default' : 'outline'}
                onClick={() => setActiveTab('table')}
                className={activeTab === 'table' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                Table View
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={activeTab === 'results' ? 'default' : 'outline'}
                onClick={() => setActiveTab('results')}
                className={activeTab === 'results' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                Leaderboard
              </Button>
              <Button
                variant={activeTab === 'table' ? 'default' : 'outline'}
                onClick={() => setActiveTab('table')}
                className={activeTab === 'table' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                Table View
              </Button>
            </>
          )}
        </div>
      </div>

      {isTournamentComplete ? (
        <>
          {activeTab === 'results' && renderFinalLeaderboard()}
          {activeTab === 'table' && renderTable()}
        </>
      ) : (
        <>
          {activeTab === 'pairings' && renderPairings()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'table' && renderTable()}
        </>
      )}
    </motion.div>
  )
}