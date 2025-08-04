'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Target, Clock, Zap, Filter, Download } from 'lucide-react'

const ratingHistoryData = [
  { round: 1, rating: 2120, score: 0.5, date: '2024-01-15' },
  { round: 2, rating: 2135, score: 1.5, date: '2024-01-22' },
  { round: 3, rating: 2142, score: 2.0, date: '2024-01-29' },
  { round: 4, rating: 2158, score: 3.0, date: '2024-02-05' },
  { round: 5, rating: 2165, score: 3.5, date: '2024-02-12' },
  { round: 6, rating: 2180, score: 4.5, date: '2024-02-19' },
  { round: 7, rating: 2186, score: 5.0, date: '2024-02-26' },
  { round: 8, rating: 2175, score: 5.5, date: '2024-03-05' }
]

const performanceByOpponentData = [
  { ratingRange: '1900-2000', games: 8, score: 7, percentage: 87.5 },
  { ratingRange: '2000-2100', games: 12, score: 8, percentage: 66.7 },
  { ratingRange: '2100-2200', games: 10, score: 5, percentage: 50.0 },
  { ratingRange: '2200-2300', games: 6, score: 2, percentage: 33.3 },
  { ratingRange: '2300+', games: 4, score: 1, percentage: 25.0 }
]

const colorDistributionData = [
  { name: 'White', value: 18, color: '#f3f4f6' },
  { name: 'Black', value: 22, color: '#374151' }
]

const timeManagementData = [
  { round: 1, avgTimePerMove: 45, timeLeft: 120 },
  { round: 2, avgTimePerMove: 38, timeLeft: 180 },
  { round: 3, avgTimePerMove: 42, timeLeft: 95 },
  { round: 4, avgTimePerMove: 35, timeLeft: 210 },
  { round: 5, avgTimePerMove: 40, timeLeft: 140 },
  { round: 6, avgTimePerMove: 33, timeLeft: 165 },
  { round: 7, avgTimePerMove: 37, timeLeft: 110 },
  { round: 8, avgTimePerMove: 41, timeLeft: 85 }
]

export function PlayerAnalytics() {
  const [selectedPlayer, setSelectedPlayer] = useState('Alexandra Chen')
  const [timeRange, setTimeRange] = useState<'1month' | '3months' | '1year'>('3months')

  const players = [
    'Alexandra Chen',
    'Marcus Johnson', 
    'Sofia Rodriguez',
    'David Kim',
    'Emma Thompson'
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Player:</span>
            <select 
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {players.map(player => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Period:</span>
            <div className="flex space-x-1">
              {[
                { key: '1month', label: '1M' },
                { key: '3months', label: '3M' },
                { key: '1year', label: '1Y' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={timeRange === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(key as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Current Rating</p>
                  <p className="text-2xl font-bold">2186</p>
                  <p className="text-blue-200 text-xs">+66 this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Win Rate</p>
                  <p className="text-2xl font-bold">73%</p>
                  <p className="text-green-200 text-xs">29W-11L-0D</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Time/Move</p>
                  <p className="text-2xl font-bold">38s</p>
                  <p className="text-purple-200 text-xs">Improving</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Performance</p>
                  <p className="text-2xl font-bold">2245</p>
                  <p className="text-orange-200 text-xs">Above rating</p>
                </div>
                <Zap className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratingHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="round" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  domain={['dataMin - 20', 'dataMax + 20']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'rating' ? `${value} ELO` : `${value} pts`,
                    name === 'rating' ? 'Rating' : 'Score'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Opponent Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Performance vs Opponent Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByOpponentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="ratingRange" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Score %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'percentage' ? `${value}%` : value,
                    name === 'percentage' ? 'Score %' : name
                  ]}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Color Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Color Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={colorDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {colorDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value} games`, 'Games']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {colorDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">
                    {entry.name}: {entry.value} games
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Management */}
        <Card>
          <CardHeader>
            <CardTitle>Time Management Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeManagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="round" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => [
                    `${value}s`,
                    name === 'avgTimePerMove' ? 'Avg Time/Move' : 'Time Left'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="avgTimePerMove"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Opening Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sicilian Defense:</span>
                  <span className="font-medium text-green-600">75% (6/8)</span>
                </div>
                <div className="flex justify-between">
                  <span>Queen's Gambit:</span>
                  <span className="font-medium text-blue-600">67% (4/6)</span>
                </div>
                <div className="flex justify-between">
                  <span>King's Indian:</span>
                  <span className="font-medium text-red-600">40% (2/5)</span>
                </div>
                <div className="flex justify-between">
                  <span>French Defense:</span>
                  <span className="font-medium text-green-600">80% (4/5)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recent Form</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Last 5 games:</span>
                  <span className="font-medium">W-W-D-W-L</span>
                </div>
                <div className="flex justify-between">
                  <span>Current streak:</span>
                  <span className="font-medium text-red-600">1 loss</span>
                </div>
                <div className="flex justify-between">
                  <span>Best streak:</span>
                  <span className="font-medium text-green-600">7 wins</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating peak:</span>
                  <span className="font-medium">2195</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Tournament Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tournaments played:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Top 3 finishes:</span>
                  <span className="font-medium text-green-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Championships:</span>
                  <span className="font-medium text-yellow-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg placement:</span>
                  <span className="font-medium">4.2</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
