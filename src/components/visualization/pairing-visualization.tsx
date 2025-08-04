'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shuffle, Zap, Eye, Download } from 'lucide-react'

interface PairingNode {
  id: string
  name: string
  rating: number
  score: number
  x: number
  y: number
  fx?: number
  fy?: number
}

interface PairingLink {
  source: string
  target: string
  round: number
  result?: 'white-win' | 'black-win' | 'draw'
}

const mockNodes: PairingNode[] = [
  { id: '1', name: 'Alexandra Chen', rating: 2180, score: 4.5, x: 0, y: 0 },
  { id: '2', name: 'Marcus Johnson', rating: 2156, score: 4.0, x: 0, y: 0 },
  { id: '3', name: 'Sofia Rodriguez', rating: 2134, score: 4.0, x: 0, y: 0 },
  { id: '4', name: 'David Kim', rating: 2089, score: 3.5, x: 0, y: 0 },
  { id: '5', name: 'Emma Thompson', rating: 2067, score: 3.5, x: 0, y: 0 },
  { id: '6', name: 'James Wilson', rating: 2045, score: 3.0, x: 0, y: 0 },
  { id: '7', name: 'Lisa Zhang', rating: 2023, score: 3.0, x: 0, y: 0 },
  { id: '8', name: 'Robert Brown', rating: 2001, score: 2.5, x: 0, y: 0 }
]

const mockLinks: PairingLink[] = [
  { source: '1', target: '4', round: 1, result: 'white-win' },
  { source: '2', target: '3', round: 1, result: 'draw' },
  { source: '5', target: '8', round: 1, result: 'white-win' },
  { source: '6', target: '7', round: 1, result: 'black-win' },
  { source: '1', target: '2', round: 2, result: 'draw' },
  { source: '3', target: '5', round: 2, result: 'white-win' },
  { source: '4', target: '6', round: 2, result: 'white-win' },
  { source: '7', target: '8', round: 2, result: 'black-win' }
]

export function PairingVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedRound, setSelectedRound] = useState<number>(0) // 0 = all rounds
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [pairingMode, setPairingMode] = useState<'historical' | 'preview'>('historical')

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 800
    const height = 500
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    // Filter links based on selected round
    const filteredLinks = selectedRound === 0 
      ? mockLinks 
      : mockLinks.filter(link => link.round === selectedRound)

    // Create simulation
    const simulation = d3.forceSimulation(mockNodes)
      .force('link', d3.forceLink(filteredLinks)
        .id((d: any) => d.id)
        .distance(120)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Create container
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'w-full h-auto')

    // Add background
    container.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', (d) => {
        if (d.result === 'white-win') return '#10b981'
        if (d.result === 'black-win') return '#ef4444'
        if (d.result === 'draw') return '#6366f1'
        return '#94a3b8'
      })
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.8)
      .attr('stroke-dasharray', (d) => d.result ? '0' : '5,5')

    // Create node groups
    const node = container.append('g')
      .selectAll('g')
      .data(mockNodes)
      .enter().append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // Add circles to nodes
    node.append('circle')
      .attr('r', (d) => 15 + (d.score * 2))
      .attr('fill', (d) => {
        if (selectedNode === d.id) return '#3b82f6'
        const scoreRatio = d.score / 5 // Assuming max score is 5
        return d3.interpolateBlues(0.3 + scoreRatio * 0.7)
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        setSelectedNode(selectedNode === d.id ? null : d.id)
      })

    // Add rating labels
    node.append('text')
      .text((d) => d.rating.toString())
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')

    // Add name labels below nodes
    node.append('text')
      .text((d) => d.name.split(' ')[0]) // First name only
      .attr('text-anchor', 'middle')
      .attr('dy', '30px')
      .attr('font-size', '12px')
      .attr('font-weight', 'medium')
      .attr('fill', '#374151')

    // Add score labels
    node.append('text')
      .text((d) => `${d.score} pts`)
      .attr('text-anchor', 'middle')
      .attr('dy', '45px')
      .attr('font-size', '10px')
      .attr('fill', '#6b7280')

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [selectedRound, selectedNode])

  const rounds = [0, 1, 2, 3] // 0 = all rounds

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Round:</span>
            <div className="flex space-x-1">
              {rounds.map(round => (
                <Button
                  key={round}
                  variant={selectedRound === round ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRound(round)}
                >
                  {round === 0 ? 'All' : round}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Mode:</span>
            <div className="flex space-x-1">
              <Button
                variant={pairingMode === 'historical' ? "default" : "outline"}
                size="sm"
                onClick={() => setPairingMode('historical')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Historical
              </Button>
              <Button
                variant={pairingMode === 'preview' ? "default" : "outline"}
                size="sm"
                onClick={() => setPairingMode('preview')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Shuffle className="h-4 w-4 mr-2" />
            Generate Next Round
          </Button>
        </div>
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shuffle className="h-5 w-5" />
                <span>Tournament Pairing Network</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <svg ref={svgRef} className="w-full border rounded" />
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span>White wins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span>Black wins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-indigo-500"></div>
                  <span>Draw</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-gray-400 border-dashed border-t"></div>
                  <span>Scheduled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Details Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Player Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-3">
                  {(() => {
                    const player = mockNodes.find(n => n.id === selectedNode)
                    if (!player) return <p>Player not found</p>
                    
                    const playerLinks = mockLinks.filter(l => 
                      l.source === selectedNode || l.target === selectedNode
                    )
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold">{player.name}</h3>
                          <p className="text-sm text-gray-600">Rating: {player.rating}</p>
                          <p className="text-sm text-gray-600">Score: {player.score} points</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Match History</h4>
                          <div className="space-y-2">
                            {playerLinks.map((link, index) => {
                              const opponent = mockNodes.find(n => 
                                n.id === (link.source === selectedNode ? link.target : link.source)
                              )
                              return (
                                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                                  <p className="font-medium">Round {link.round}</p>
                                  <p>vs {opponent?.name}</p>
                                  <p className="text-gray-600">
                                    {link.result === 'white-win' ? 'Won' :
                                     link.result === 'black-win' ? 'Lost' :
                                     link.result === 'draw' ? 'Draw' : 'Scheduled'}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Click on a player node to view details</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Round Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Pairings:</span>
                  <span className="font-semibold">{mockLinks.filter(l => selectedRound === 0 || l.round === selectedRound).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-semibold text-green-600">
                    {mockLinks.filter(l => (selectedRound === 0 || l.round === selectedRound) && l.result).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Rating Diff:</span>
                  <span className="font-semibold">87 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Balance:</span>
                  <span className="font-semibold text-blue-600">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
