'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, Trophy, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TournamentFormData {
  name: string
  startDate: string
  endDate: string
  rounds: number
  maxParticipants: number
  format: 'swiss' | 'round-robin' | 'elimination'
  timeControl: string
  venue: string
  entryFee: number
}

interface TournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TournamentFormData) => Promise<void>
}

export function TournamentModal({ isOpen, onClose, onSubmit }: TournamentModalProps) {
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    startDate: '',
    endDate: '',
    rounds: 7,
    maxParticipants: 32,
    format: 'swiss',
    timeControl: '5+3',
    venue: '',
    entryFee: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.startDate) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        rounds: 7,
        maxParticipants: 32,
        format: 'swiss',
        timeControl: '90+30',
        venue: '',
        entryFee: 0
      })
      onClose()
    } catch (error) {
      console.error('Error creating tournament:', error)
      alert('Failed to create tournament. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof TournamentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNumberChange = (field: keyof TournamentFormData, value: string) => {
    const numValue = field === 'entryFee' ? parseFloat(value) : parseInt(value)
    setFormData(prev => ({ 
      ...prev, 
      [field]: isNaN(numValue) ? (field === 'entryFee' ? 0 : 1) : numValue 
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center text-gray-900">
                      <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                      Create New Tournament
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={onClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tournament Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Tournament Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Enter tournament name"
                        required
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Tournament Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Format
                        </label>
                        <select
                          value={formData.format}
                          onChange={(e) => handleChange('format', e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="swiss">Swiss System</option>
                          <option value="round-robin">Round Robin</option>
                          <option value="elimination">Elimination</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Rounds
                        </label>
                        <input
                          type="number"
                          value={formData.rounds}
                          onChange={(e) => handleNumberChange('rounds', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          min="3"
                          max="15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Max Players
                        </label>
                        <input
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => handleNumberChange('maxParticipants', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          min="4"
                          max="128"
                        />
                      </div>
                    </div>

                    {/* Additional Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Time Control
                        </label>
                        <input
                          type="text"
                          value={formData.timeControl}
                          onChange={(e) => handleChange('timeControl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder="e.g., 90+30, 15+10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Entry Fee ($)
                        </label>
                        <input
                          type="number"
                          value={formData.entryFee}
                          onChange={(e) => handleNumberChange('entryFee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Venue */}
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => handleChange('venue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="Tournament venue/location"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Tournament'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
