import polyline from "./polyline-light.js"

export const US_STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia'
}

export function resolveUSState(query) {
  if (!query) return null
  const q = String(query).trim()
  const upper = q.toUpperCase()
  if (US_STATES[upper]) return { code: upper, name: US_STATES[upper] }
  // Try by full name
  const code = Object.keys(US_STATES).find(k => US_STATES[k].toUpperCase() === upper)
  if (code) return { code, name: US_STATES[code] }
  return null
}

const MB = {
  token: import.meta.env.VITE_MAPBOX_TOKEN,
  geo: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  dir: 'https://api.mapbox.com/directions/v5/mapbox'
}

export async function geocode(place) {
  // Try Mapbox, fallback to Nominatim (OSM)
  if (MB.token) {
    const url = `${MB.geo}/${encodeURIComponent(place)}.json?access_token=${MB.token}&limit=1&country=us`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()
    const feat = data.features?.[0]
    if (!feat) throw new Error('No results')
    return { lat: feat.center[1], lon: feat.center[0], name: feat.place_name }
  }
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&countrycodes=us&format=json&limit=1`
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

export async function getStateFeature(query) {
  const state = resolveUSState(query)
  if (MB.token) {
    const q = state ? state.name : query
    const url = `${MB.geo}/${encodeURIComponent(q)}.json?access_token=${MB.token}&types=region&country=us&limit=1`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data.features?.[0] || null
  }
  // Nominatim
  const q = state ? state.name : query
  const url = `https://nominatim.openstreetmap.org/search?state=${encodeURIComponent(q)}&country=United%20States&format=jsonv2&addressdetails=1&limit=1`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const first = data?.[0]
  if (!first) return null
  return {
    place_name: `${q}, United States`,
    center: [ +first.lon, +first.lat ],
    bbox: first.boundingbox ? [ +first.boundingbox[2], +first.boundingbox[0], +first.boundingbox[3], +first.boundingbox[1] ] : undefined
  }
}

export async function searchSuggestions(query, { limit = 8, withinState = null } = {}) {
  const state = withinState || resolveUSState(query)
  // If query is only state code/name, we still want to include that region and then refine as user types more
  if (MB.token) {
    const paramsBase = new URLSearchParams({ access_token: MB.token, country: 'us', limit: String(limit), autocomplete: 'true' })
    const types = 'region,place,locality,poi'
    let bbox = null
    if (state) {
      const feat = await getStateFeature(state.name || state.code)
      if (feat?.bbox) bbox = feat.bbox
    }
    const searchText = query && !resolveUSState(query) ? query : ''
    const url = `${MB.geo}/${encodeURIComponent(searchText || 'a')}.json?${paramsBase.toString()}&types=${types}${bbox ? `&bbox=${bbox.join(',')}` : ''}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Suggestion search failed')
    const data = await res.json()
    const arr = []
    if (state) {
      // Put the state itself on top
      arr.push({ id: `state-${state.code}`, name: `${state.name}, United States`, lat: bbox ? (bbox[1] + bbox[3]) / 2 : undefined, lon: bbox ? (bbox[0] + bbox[2]) / 2 : undefined, type: 'region', bbox })
    }
    for (const f of data.features || []) {
      arr.push({ id: f.id, name: f.place_name, lat: f.center[1], lon: f.center[0], type: f.place_type?.[0], bbox: f.bbox })
    }
    return arr
  }
  // Fallback Nominatim
  let view = null
  if (state) {
    const feat = await getStateFeature(state.name || state.code)
    if (feat?.bbox) view = feat.bbox // [minX,minY,maxX,maxY]
  }
  const q = resolveUSState(query) ? '' : query
  const params = new URLSearchParams({ q: q || 'city', format: 'jsonv2', addressdetails: '1', countrycodes: 'us', limit: String(limit) })
  if (view) {
    params.set('viewbox', `${view[0]},${view[3]},${view[2]},${view[1]}`)
    params.set('bounded', '1')
  }
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) throw new Error('Suggestion search failed')
  const data = await res.json()
  const arr = []
  if (state) arr.push({ id: `state-${state.code}`, name: `${state.name}, United States`, lat: view ? (view[1] + view[3]) / 2 : undefined, lon: view ? (view[0] + view[2]) / 2 : undefined, type: 'region', bbox: view })
  for (const r of data) arr.push({ id: r.place_id, name: r.display_name, lat: +r.lat, lon: +r.lon, type: r.type })
  return arr
}
