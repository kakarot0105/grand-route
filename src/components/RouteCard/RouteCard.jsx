import React from 'react'
import { estimateFuelCost, estimateTollCost, estimateTime } from '../../utils/calculations.js'

export default function RouteCard({ route }) {
  if (!route) return null
  const { distanceKm, durationSec } = route
  const { hours, minutes } = estimateTime(distanceKm)
  const fuel = estimateFuelCost(distanceKm)
  const tolls = estimateTollCost(distanceKm)

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>Route Summary</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        <div><strong>Distance:</strong> {distanceKm.toFixed(1)} km</div>
        <div><strong>ETA:</strong> {hours}h {minutes}m</div>
        <div><strong>Fuel Est.:</strong> ${fuel}</div>
        <div><strong>Tolls Est.:</strong> ${tolls}</div>
      </div>
    </div>
  )
}

