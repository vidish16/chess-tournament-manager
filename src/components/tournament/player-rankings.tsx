'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlayerRanking {
  rank: number
  player: {
    id: string
    name: string
    rating: number
    club?: string
  }
  score: number
  gamesPlayed: number
  winRate: number
  trend: 'up' | 'down' | 'stable'
  ratingChange: number
  performance: number
}

const mockRankings: PlayerRanking[] = [
  {
    rank: 1,
    player: { id: '1', name: 'Alexandra Chen', rating: 2180, club: 'Metro Chess Club' },
    score: 8.5,
    gamesPlayed: 10,
    winRate: 85,
    trend: 'up',
    ratingChange: +42,
    performance: 2250
  },
  {
    rank: 2,
    player: { id: '2', name: 'Marcus Johnson', rating: 2156, club: 'Central Chess Academy' },
    score: 8.0,
    gamesPlayed: 10,
    winRate: 80,
    trend: 'stable',
    ratingChange: +8,
    performance: 2180
  },
  {
    rank: 3,
    player: { id: '3', name: 'Sofia Rodriguez', rating: 2134, club: 'Knights & Pawns' },
    score: 7.5,
    gamesPlayed: 10,
    winRate: 75,
    trend: 'up',
    ratingChange: +28,
    performance: 2165
  },
  {
    rank: 4,
    player: { id: '4', name: 'David Kim', rating: 2089, club: 'Royal Chess Society' },
    score: 7.0,
    gamesPlayed: 10,
    winRate: 70,
    trend: 'down',
    ratingChange: -15,
    performance: 2120
  },
  {
    rank: 5,
    player: { id: '5', name: 'Emma Thompson', rating: 2067, club: 'Metro Chess Club' },
    score: 6.5,
    gamesPlayed: 10,
    winRate: 65,
    trend: 'up',
    ratingChange: +22,
    performance: 2090
  }
]

export function PlayerRankings() {
  const getTrendIcon = (trend: PlayerRanking['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getRatingChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {mockRankings.slice(0, 3).map((ranking, index) => (
          <motion.div
            key={ranking.player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${
              index === 0 ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' :
              index === 1 ? 'ring-2 ring-gray-400 bg-gradient-to-br from-gray-50 to-gray-100' :
              'ring-2 ring-orange-400 bg-gradient-to-br from-orange-50 to-orange-100'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-500' :
                    'bg-orange-500'
                  }`}>
                    {ranking.rank}
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(ranking.trend)}
                    <span className={`text-sm font-medium ${getRatingChangeColor(ranking.ratingChange)}`}>
                      {ranking.ratingChange > 0 ? '+' : ''}{ranking.ratingChange}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">{ranking.player.name}</h3>
                  <p className="text-sm text-gray-600">{ranking.player.club}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">{ranking.player.rating}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{ranking.score} pts</p>
                      <p className="text-xs text-gray-600">{ranking.winRate}% WR</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Complete Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Player</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Rating</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Games</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Win Rate</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Performance</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {mockRankings.map((ranking, index) => (
                  <motion.tr
                    key={ranking.player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">{ranking.rank}</span>
                        {ranking.rank <= 3 && (
                          <Trophy className={`h-4 w-4 ${
                            ranking.rank === 1 ? 'text-yellow-500' :
                            ranking.rank === 2 ? 'text-gray-500' :
                            'text-orange-500'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{ranking.player.name}</p>
                        <p className="text-sm text-gray-500">{ranking.player.club}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{ranking.player.rating}</span>
                        <span className={`text-xs ${getRatingChangeColor(ranking.ratingChange)}`}>
                          {ranking.ratingChange > 0 ? '+' : ''}{ranking.ratingChange}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">{ranking.score}</td>
                    <td className="py-3 px-4 text-center">{ranking.gamesPlayed}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Target className="h-3 w-3 text-gray-400" />
                        <span>{ranking.winRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Zap className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">{ranking.performance}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {getTrendIcon(ranking.trend)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
