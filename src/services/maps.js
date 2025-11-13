import polyline from "./polyline-light.js"

const MB = {
  token: import.meta.env.VITE_MAPBOX_TOKEN,
  geo: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  dir: 'https://api.mapbox.com/directions/v5/mapbox'
}

export async function geocode(place) {
  // Try Mapbox, fallback to Nominatim (OSM)
  if (MB.token) {
    const url = `${MB.geo}/${encodeURIComponent(place)}.json?access_token=${MB.token}&limit=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()
    const feat = data.features?.[0]
    if (!feat) throw new Error('No results')
    return { lat: feat.center[1], lon: feat.center[0], name: feat.place_name }
  }
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) throw new Error('Geocoding failed')
  const [first] = await res.json()
  if (!first) throw new Error('No results')
  return { lat: +first.lat, lon: +first.lon, name: first.display_name }
}

export async function getRoute(coords, profile = 'driving', avoid = {}) {
  // coords: [{lat, lon}, ...]
  if (coords.length < 2) throw new Error('At least two points required')
  const waypoints = coords.map((c) => `${c.lon},${c.lat}`).join(';')

  if (MB.token) {
    const annotations = 'distance,duration'
    const alt = false
    const params = new URLSearchParams({ alternatives: String(alt), geometries: 'polyline6', overview: 'full', steps: 'false', access_token: MB.token, annotations })
    const profilePath = profile === 'cycling' ? 'cycling' : profile === 'walking' ? 'walking' : 'driving'
    const url = `${MB.dir}/${profilePath}/${waypoints}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Directions failed')
    const data = await res.json()
    const route = data.routes?.[0]
    const points = polyline.decode(route.geometry).map(([lat, lon]) => ({ lat, lon }))
    return { distanceKm: route.distance / 1000, durationSec: route.duration, geometry: points }
  }
  // Fallback OSRM public
  const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Directions failed')
  const data = await res.json()
  const r = data.routes?.[0]
  const points = r.geometry.coordinates.map(([lon, lat]) => ({ lat, lon }))
  return { distanceKm: r.distance / 1000, durationSec: r.duration, geometry: points }
}

