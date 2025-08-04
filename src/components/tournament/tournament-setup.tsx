'use client'

import React, { useState } from 'react'
import { Trophy, Settings, Play } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TournamentSetup {
  name: string
  rounds: number
  format: 'swiss' | 'round-robin'
  timeControl: string
}

interface TournamentSetupProps {
  playerCount: number
  onCreateTournament: (setup: TournamentSetup) => void
  disabled?: boolean
}

export function TournamentSetup({ playerCount, onCreateTournament, disabled }: TournamentSetupProps) {
  const [formData, setFormData] = useState<TournamentSetup>({
    name: '',
    rounds: Math.ceil(Math.log2(playerCount)) || 5,
    format: 'swiss',
    timeControl: '5+3'
  })
  const [errors, setErrors] = useState({ name: '' })

  const maxRounds = formData.format === 'round-robin' 
    ? playerCount - 1 
    : Math.min(Math.ceil(Math.log2(playerCount)) + 2, 9)

  const validateForm = () => {
    const newErrors = { name: '' }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required'
    }
    
    setErrors(newErrors)
    return !newErrors.name
  }

  const handleSubmit = () => {
    if (!validateForm() || disabled) return
    
    onCreateTournament({
      ...formData,
      name: formData.name.trim()
    })
  }

  const getSuggestedRounds = () => {
    if (formData.format === 'round-robin') {
      return playerCount - 1
    }
    return Math.min(Math.ceil(Math.log2(playerCount)), 7)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 flex items-center">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={32} 
            height={32}
            className="rounded mr-3"
          />
          <Trophy className="h-5 w-5 mr-2 text-blue-600" />
          Tournament Setup
        </CardTitle>
        <CardDescription className="text-gray-600">
          {playerCount < 4 
            ? 'Need at least 4 players to create a tournament'
            : `Ready to create tournament with ${playerCount} players`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tournament Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Spring Championship 2025"
            disabled={disabled}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Tournament Format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.format === 'swiss' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => !disabled && setFormData(prev => ({ 
                ...prev, 
                format: 'swiss',
                rounds: getSuggestedRounds()
              }))}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Swiss System</h4>
                  <p className="text-sm text-gray-600">Recommended for most tournaments</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.format === 'swiss' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}></div>
              </div>
            </div>
            
            <div 
              className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.format === 'round-robin' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${playerCount > 12 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && playerCount <= 12 && setFormData(prev => ({ 
                ...prev, 
                format: 'round-robin',
                rounds: playerCount - 1
              }))}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Round Robin</h4>
                  <p className="text-sm text-gray-600">
                    {playerCount > 12 ? 'Too many players' : 'Everyone plays everyone'}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.format === 'round-robin' 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Number of Rounds */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Number of Rounds
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={formData.rounds}
              onChange={(e) => {
                const value = Math.max(1, Math.min(maxRounds, parseInt(e.target.value) || 1))
                setFormData(prev => ({ ...prev, rounds: value }))
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              min="1"
              max={maxRounds}
              disabled={disabled || formData.format === 'round-robin'}
            />
            <div className="text-sm text-gray-600">
              {formData.format === 'round-robin' ? (
                <span>Fixed at {playerCount - 1} rounds (everyone plays everyone)</span>
              ) : (
                <span>Suggested: {getSuggestedRounds()} rounds (max {maxRounds})</span>
              )}
            </div>
          </div>
        </div>

        {/* Time Control */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Time Control
          </label>
          <select
            value={formData.timeControl}
            onChange={(e) => setFormData(prev => ({ ...prev, timeControl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={disabled}
          >
            <option value="1+1">1 min + 1 sec/move (Bullet)</option>
            <option value="3+2">3 min + 2 sec/move (Blitz)</option>
            <option value="5+3">5 min + 3 sec/move (Blitz)</option>
            <option value="15+10">15 min + 10 sec/move (Rapid)</option>
            <option value="25+10">25 min + 10 sec/move (Rapid)</option>
            <option value="90+30">90 min + 30 sec/move (Classical)</option>
            <option value="custom">Custom</option>
          </select>
          {formData.timeControl === 'custom' && (
            <input
              type="text"
              placeholder="Enter custom time control (e.g., 60+15)"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              onChange={(e) => setFormData(prev => ({ ...prev, timeControl: e.target.value }))}
            />
          )}
        </div>

        {/* Tournament Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Tournament Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• {playerCount} players</p>
            <p>• {formData.rounds} rounds</p>
            <p>• {formData.format === 'swiss' ? 'Swiss System' : 'Round Robin'} format</p>
            <p>• Time Control: {formData.timeControl}</p>
            <p>• Approximately {formData.rounds * Math.floor(playerCount / 2)} games total</p>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={disabled || playerCount < 4}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          <Play className="h-4 w-4 mr-2" />
          {playerCount < 4 ? 'Need More Players' : 'Create Tournament'}
        </Button>
      </CardContent>
    </Card>
  )
}
