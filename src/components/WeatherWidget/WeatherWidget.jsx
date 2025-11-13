import React, { useMemo } from 'react'
import { useQuest } from '../../context/QuestContext.js'
import { useWeather } from '../../hooks/useWeather.js'
import SkeletonCard from '../Feedback/SkeletonCard.jsx'
import { FEATURE_FLAGS } from '../../utils/constants.js'

function formatTime(iso) {
  if (!iso) return '-'
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } catch { return '-' }
}

export default function WeatherWidget() {
  const { route } = useQuest()
  const point = useMemo(() => route?.to || route?.from, [route])
  const { current, forecast } = useWeather(point?.lat, point?.lon)

  return (
    <section className="grid grid-3">
      <div className="card" aria-live="polite">
        <h3 style={title}>Current Weather</h3>
        {current.isLoading ? (FEATURE_FLAGS.skeletons ? <SkeletonCard height={140} /> : <div>Loading weather…</div>) : current.isError ? <div role="alert">Failed to load</div> : (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ fontSize: 36 }}>🌤️</div>
            <div style={{ fontSize: 24, color: 'var(--gold)', fontWeight: 700 }}>{Math.round(current.data?.temp || 0)}°C</div>
            <div>Humidity: {current.data?.humidity ?? '-'}%</div>
            <div>Wind: {current.data?.wind ?? '-'} m/s</div>
            <div>Sunrise: {formatTime(current.data?.sunrise)}</div>
            <div>Sunset: {formatTime(current.data?.sunset)}</div>
          </div>
        )}
      </div>
      <div className="card">
        <h3 style={title}>Hourly Preview</h3>
        {forecast.isLoading ? (FEATURE_FLAGS.skeletons ? <SkeletonCard height={120} /> : <div>Loading forecast…</div>) : forecast.isError ? <div role="alert">Failed to load</div> : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
            {renderHourly(forecast.data).slice(0, 12)}
          </div>
        )}
      </div>
      <div className="card">
        <h3 style={title}>Travel Tips</h3>
        <ul>
          <li>Check visibility and precipitation for scenic quests.</li>
          <li>Beware strong winds for cycling routes.</li>
          <li>Consider night mode for low-traffic hours.</li>
        </ul>
      </div>
    </section>
  )
}

const title = { marginTop: 0, marginBottom: 8, fontFamily: 'Bangers, cursive', letterSpacing: 1 }

function renderHourly(data) {
  // Normalize both providers to a simple array {time, temp}
  if (!data) return []
  if (data.list) {
    return data.list.map((x, i) => (
      <div key={i} className="card" style={{ minWidth: 96, textAlign: 'center' }}>
        <div>{new Date(x.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}</div>
        <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{Math.round(x.main.temp)}°</div>
      </div>
    ))
  }
  if (data.hourly?.time) {
    return data.hourly.time.map((t, i) => (
      <div key={i} className="card" style={{ minWidth: 96, textAlign: 'center' }}>
        <div>{new Date(t).toLocaleTimeString([], { hour: '2-digit' })}</div>
        <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{Math.round(data.hourly.temperature_2m?.[i] ?? 0)}°</div>
      </div>
    ))
  }
  return []
}
