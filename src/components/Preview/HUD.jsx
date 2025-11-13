import React, { useMemo } from 'react'
import { useQuest } from '../../context/QuestContext.js'
import { cumulativeDistances } from '../../utils/route.js'
import { computeSeverity } from '../../utils/severity.js'

export default function HUD({ progressT = 0 }) {
  const { route } = useQuest()
  const stats = useMemo(() => {
    if (!route?.geometry?.length) return null
    const cum = cumulativeDistances(route.geometry)
    const total = cum[cum.length - 1]
    const traveled = total * progressT
    const remaining = Math.max(0, total - traveled)
    const etaHours = (route.durationSec || (total / 80) * 3600) / 3600 * (1 - progressT) // rough ETA
    return { total, traveled, remaining, etaHours }
  }, [route, progressT])

  if (!stats) return null
  const { total, traveled, remaining, etaHours } = stats
  const severity = computeSeverity({ precipProb: 15, wind: 4, temp: 24 }) // placeholder summary

  return (
    <div className="card" role="status" aria-live="polite" style={{ position: 'sticky', bottom: 16 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>Distance:</strong> {traveled.toFixed(1)} / {total.toFixed(1)} km</div>
        <div><strong>Remaining:</strong> {remaining.toFixed(1)} km</div>
        <div><strong>ETA:</strong> {Math.floor(etaHours)}h {Math.round((etaHours % 1) * 60)}m</div>
        <div><strong>Severity:</strong> {severity} / 5</div>
      </div>
      <div style={{ height: 8, borderRadius: 6, marginTop: 8, background: 'rgba(255,255,255,0.15)' }}>
        <div style={{ width: `${Math.round(progressT * 100)}%`, height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, var(--gold), var(--orange))' }} />
      </div>
    </div>
  )
}

