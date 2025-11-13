import React from 'react'
import { estimateFuelCost, estimateTollCost, estimateTime } from '../../utils/calculations.js'
import SkeletonCard from '../Feedback/SkeletonCard.jsx'
import { FEATURE_FLAGS } from '../../utils/constants.js'

export default function RouteCard({ route }) {
  if (!route) return FEATURE_FLAGS.skeletons ? <SkeletonCard height={120} /> : null
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
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn" onClick={() => shareRoute(route)}>Share</button>
        <button className="btn" onClick={() => exportGPX(route)}>Export GPX</button>
      </div>
    </div>
  )
}

function shareRoute(route) {
  const url = `${location.origin}${location.pathname}#share=${encodeURIComponent(JSON.stringify({ from: route.from, to: route.to }))}`
  if (navigator.share) {
    navigator.share({ title: 'Grand Route', text: 'Check my quest!', url }).catch(() => copy(url))
  } else {
    copy(url)
  }
}

function copy(text) { navigator.clipboard?.writeText(text) }

function exportGPX(route) {
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="GrandRoute">\n<trk><name>GrandRoute</name><trkseg>`
  const body = route.geometry.map(p => `<trkpt lat="${p.lat}" lon="${p.lon}"></trkpt>`).join('')
  const footer = `</trkseg></trk></gpx>`
  const blob = new Blob([header + body + footer], { type: 'application/gpx+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'grand-route.gpx'
  a.click()
  URL.revokeObjectURL(a.href)
}
