'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, UserPlus, Edit, Trash2, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Player {
  id: string
  name: string
  rating: number
}

interface PlayerRegistrationProps {
  players: Player[]
  onAddPlayer: (player: { name: string; rating: number }) => void
  onEditPlayer: (id: string, player: { name: string; rating: number }) => void
  onDeletePlayer: (id: string) => void
}

export function PlayerRegistration({ players, onAddPlayer, onEditPlayer, onDeletePlayer }: PlayerRegistrationProps) {
  const [isAdding, setIsAdding] = useState(true) // Start with form open
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', rating: '' })
  const [errors, setErrors] = useState({ name: '', rating: '' })
  const nameInputRef = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    const newErrors = { name: '', rating: '' }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    const rating = parseInt(formData.rating)
    if (!formData.rating || isNaN(rating) || rating < 100 || rating > 3000) {
      newErrors.rating = 'Rating must be between 100-3000'
    }
    
    setErrors(newErrors)
    return !newErrors.name && !newErrors.rating
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const playerData = {
      name: formData.name.trim(),
      rating: parseInt(formData.rating)
    }

    if (editingId) {
      onEditPlayer(editingId, playerData)
      setEditingId(null)
    } else {
      onAddPlayer(playerData)
    }

    setFormData({ name: '', rating: '' })
    // Keep form open for continuous adding
    setErrors({ name: '', rating: '' })
    
    // Return focus to name field
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 0)
  }

  const handleEdit = (player: Player) => {
    setFormData({ name: player.name, rating: player.rating.toString() })
    setEditingId(player.id)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setFormData({ name: '', rating: '' })
    setIsAdding(false)
    setEditingId(null)
    setErrors({ name: '', rating: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Player Registration
              </CardTitle>
              <CardDescription className="text-gray-600">
                Register players for the tournament ({players.length} registered)
              </CardDescription>
            </div>
            {!isAdding && (
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Add/Edit Player Form */}
        {isAdding && (
          <CardContent className="border-t border-gray-200">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Player Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter player name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Rating *
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                      errors.rating ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1500"
                    min="100"
                    max="3000"
                  />
                  {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating}</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  {editingId ? 'Update Player' : 'Add Player'}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Registered Players</CardTitle>
          <CardDescription className="text-gray-600">
            {players.length === 0 ? 'No players registered yet' : `${players.length} players ready to compete`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No players registered yet</p>
              <p className="text-sm text-gray-500">Add players to start organizing tournaments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {players
                .sort((a, b) => b.rating - a.rating) // Sort by rating descending
                .map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                        <p className="text-sm text-gray-600">Rating: {player.rating}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(player)}
                        disabled={editingId === player.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Delete button clicked for player:', player.name, player.id)
                          onDeletePlayer(player.id)
                        }}
                        disabled={editingId === player.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
