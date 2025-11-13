import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { cumulativeDistances, interpolateAtDistance } from '../../utils/route.js'
import { fetchCurrentWeather } from '../../services/weather.js'

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

// Lazy load Google Maps JS API to use DirectionsService in-browser (avoids CORS)
async function loadGoogle() {
  if (window.google?.maps) return window.google
  if (!GMAPS_KEY) throw new Error('Missing VITE_GOOGLE_MAPS_KEY')
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Google Maps JS'))
    document.head.appendChild(script)
  })
  return window.google
}

function toPointArray(overviewPath) {
  return overviewPath.map((p) => ({ lat: p.lat(), lon: p.lng() }))
}

function sampleEvery(points, stepKm = 50) {
  if (!points?.length) return []
  const cum = cumulativeDistances(points)
  const total = cum[cum.length - 1]
  const samples = []
  for (let d = 0; d <= total; d += stepKm) {
    samples.push(interpolateAtDistance(points, cum, d))
  }
  if (!samples.length || samples[samples.length - 1] !== points[points.length - 1]) {
    samples.push(points[points.length - 1])
  }
  return samples
}

export default function WeatherAlongRoute({ origin, destination, stepKm = 50, height = 520 }) {
  const [route, setRoute] = useState(null) // { geometry: [{lat,lon}], bounds: [[lat,lon], [lat,lon]] }
  const [points, setPoints] = useState([]) // sampled points for weather
  const [weather, setWeather] = useState([]) // [{lat,lon,temp,icon}]
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch route via Google Directions
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!origin || !destination) return
      setLoading(true); setError('')
      try {
        const google = await loadGoogle()
        const service = new google.maps.DirectionsService()
        const req = { origin, destination, travelMode: google.maps.TravelMode.DRIVING, provideRouteAlternatives: false }
        const result = await new Promise((resolve, reject) => {
          service.route(req, (res, status) => {
            if (status === 'OK') resolve(res); else reject(new Error(`Directions failed: ${status}`))
          })
        })
        const first = result.routes?.[0]
        const path = toPointArray(first.overview_path || [])
        const bounds = first.bounds ? [[first.bounds.getSouthWest().lat(), first.bounds.getSouthWest().lng()], [first.bounds.getNorthEast().lat(), first.bounds.getNorthEast().lng()]] : undefined
        if (!cancelled) setRoute({ geometry: path, bounds })
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load route')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [origin, destination])

  // Sample points every stepKm
  useEffect(() => {
    if (!route?.geometry?.length) { setPoints([]); return }
    const samples = sampleEvery(route.geometry, stepKm)
    setPoints(samples)
  }, [route, stepKm])

  // Fetch weather for each sampled point (limit concurrency)
  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!points.length) { setWeather([]); return }
      const out = []
      const batchSize = 5
      for (let i = 0; i < points.length; i += batchSize) {
        const batch = points.slice(i, i + batchSize)
        const res = await Promise.all(batch.map(p => fetchCurrentWeather(p.lat, p.lon).catch(() => null)))
        res.forEach((w, idx) => {
          const p = batch[idx]
          if (w) out.push({ lat: p.lat, lon: p.lon, temp: Math.round(w.temp), icon: w.icon })
        })
      }
      if (!cancelled) setWeather(out)
    }
    run()
    return () => { cancelled = true }
  }, [points])

  const center = useMemo(() => route?.geometry?.[0] ? [route.geometry[0].lat, route.geometry[0].lon] : [40.7128, -74.006], [route])

  return (
    <div className="w-full card" style={{ height }}>
      <div className="relative w-full h-full">
        <MapContainer style={{ height: '100%', width: '100%', borderRadius: 12 }} center={center} zoom={8} bounds={route?.bounds} scrollWheelZoom>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {route?.geometry?.length ? (
            <Polyline positions={route.geometry.map(p => [p.lat, p.lon])} pathOptions={{ color: '#FF6B35', weight: 5 }} />
          ) : null}
          <WeatherOverlay items={weather} />
        </MapContainer>
        {loading ? <div className="absolute inset-0 grid place-items-center"><div className="bg-white/60 text-[#023047] rounded-xl px-3 py-2">Loading route…</div></div> : null}
        {error ? <div role="alert" className="absolute inset-x-4 top-4 bg-pink-200 text-pink-900 rounded-xl px-3 py-2 border border-pink-300">{error}</div> : null}
      </div>
    </div>
  )
}

function WeatherOverlay({ items }) {
  const map = useMap()
  const [, force] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const rerender = () => force((x) => x + 1)
    map.on('move zoom', rerender)
    return () => { map.off('move', rerender); map.off('zoom', rerender) }
  }, [map])

  return (
    <div ref={containerRef} className="pointer-events-none">
      {items.map((it, i) => {
        const p = map.latLngToContainerPoint([it.lat, it.lon])
        const style = { transform: `translate(${p.x}px, ${p.y}px)` }
        const iconUrl = it.icon && typeof it.icon === 'string' && it.icon.length <= 4
          ? `https://openweathermap.org/img/wn/${it.icon}@2x.png`
          : null
        return (
          <motion.div
            key={`${it.lat}-${it.lon}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={style}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.35 }}
          >
            <div className="backdrop-blur-sm rounded-xl px-2 py-1 flex items-center gap-1 text-[#023047] border shadow-[0_6px_16px_rgba(152,255,152,0.35)] bg-[#E6E6FA]/80 border-[#FFC0CB]">
              {iconUrl ? <img src={iconUrl} alt="" className="w-6 h-6" /> : <span className="text-2xl">🌤️</span>}
              <span className="font-bold text-[#FF69B4]">{it.temp}°C</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
