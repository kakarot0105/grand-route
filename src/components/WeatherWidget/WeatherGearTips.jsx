import React, { useMemo } from 'react'
import { useQuest } from '../../context/QuestContext.js'
import { useAlongRouteWeather } from '../../hooks/useAlongRouteWeather.js'
import { FEATURE_FLAGS } from '../../utils/constants.js'

export default function WeatherGearTips() {
  const { route } = useQuest()
  const { samples } = useAlongRouteWeather(route, 50)
  if (!FEATURE_FLAGS.severityLegend) return null

  const tips = useMemo(() => {
    const arr = []
    const maxSev = samples.reduce((m, s) => Math.max(m, s.severity || 0), 0)
    const windy = samples.some((s) => (s.weather?.wind || 0) > 10)
    const hot = samples.some((s) => (s.weather?.temp || 0) > 30)
    const cold = samples.some((s) => (s.weather?.temp || 0) < 5)
    const precip = samples.some((s) => (s.weather?.precipProb || 0) > 50)
    if (precip) arr.push('Rain gear / waterproof layers')
    if (windy) arr.push('Windbreaker; secure loose items')
    if (hot) arr.push('Sunscreen, extra water, UV protection')
    if (cold) arr.push('Insulated gloves, thermal layers')
    if (maxSev >= 3.5) arr.push('Consider alternative route or later departure')
    if (!arr.length) arr.push('All clear — standard gear')
    return arr
  }, [samples])

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>Gear Tips</h3>
      <ul>
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

