import React, { useMemo } from 'react'
import { Polyline } from 'react-leaflet'
import { useAlongRouteWeather } from '../../hooks/useAlongRouteWeather.js'
import { severityColor } from '../../utils/severity.js'

export default function SeverityOverlay({ route }) {
  const { samples, loading } = useAlongRouteWeather(route, 25)

  const segments = useMemo(() => {
    if (!route?.geometry?.length) return []
    if (!samples?.length) return []
    // Map each adjacent pair in geometry to a severity (nearest sample)
    const mapSeg = []
    function nearestSev(p) {
      if (!samples.length) return 0
      let best = samples[0]; let bestD = dist(p, best)
      for (let i = 1; i < samples.length; i++) {
        const d = dist(p, samples[i])
        if (d < bestD) { bestD = d; best = samples[i] }
      }
      return best.severity || 0
    }
    for (let i = 1; i < route.geometry.length; i++) {
      const a = route.geometry[i - 1]
      const b = route.geometry[i]
      const sev = (nearestSev(a) + nearestSev(b)) / 2
      mapSeg.push({ a, b, sev })
    }
    return mapSeg
  }, [route, samples])

  if (!segments.length) return null
  return (
    <>
      {segments.map((s, idx) => (
        <Polyline key={idx} positions={[[s.a.lat, s.a.lon], [s.b.lat, s.b.lon]]} pathOptions={{ color: severityColor(s.sev), weight: 6, opacity: loading ? 0.6 : 0.9 }} />
      ))}
    </>
  )
}

function dist(a, b) {
  const dx = a.lat - b.lat
  const dy = a.lon - b.lon
  return Math.sqrt(dx * dx + dy * dy)
}

