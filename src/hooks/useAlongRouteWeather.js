import { useEffect, useMemo, useState } from 'react'
import { samplePolyline } from '../utils/route.js'
import { fetchCurrentWeather } from '../services/weather.js'
import { computeSeverity } from '../utils/severity.js'

export function useAlongRouteWeather(route, stepKm = 25) {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const points = useMemo(() => {
    if (!route?.geometry?.length) return []
    // geometry is [{lat,lon}], sample every stepKm
    return samplePolyline(route.geometry, stepKm)
  }, [route, stepKm])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!points.length) { setSamples([]); return }
      setLoading(true)
      setError('')
      try {
        // Limit concurrency to 5
        const results = []
        const batchSize = 5
        for (let i = 0; i < points.length; i += batchSize) {
          const batch = points.slice(i, i + batchSize)
          const fetched = await Promise.all(batch.map(p => fetchCurrentWeather(p.lat, p.lon).catch(() => null)))
          for (let j = 0; j < fetched.length; j++) {
            const w = fetched[j]
            const p = batch[j]
            const sev = w ? computeSeverity({
              precipProb: w.precipProb ?? 0,
              wind: w.wind ?? 0,
              temp: w.temp ?? 22,
              aqi: w.aqi ?? 20,
              uv: w.uv ?? 3,
            }) : 0
            results.push({ ...p, weather: w, severity: sev })
          }
        }
        if (!cancelled) setSamples(results)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load along-route weather')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [points])

  return { samples, loading, error }
}

