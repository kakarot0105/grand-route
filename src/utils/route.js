// Geographic utilities for routing, sampling, and animation

export function haversine(a, b) {
  const R = 6371 // km
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function toRad(deg) { return (deg * Math.PI) / 180 }

export function cumulativeDistances(points) {
  const cum = [0]
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + haversine(points[i - 1], points[i]))
  }
  return cum
}

export function samplePolyline(points, stepKm = 10) {
  if (!points || points.length < 2) return []
  const cum = cumulativeDistances(points)
  const total = cum[cum.length - 1]
  const samples = []
  for (let d = 0; d <= total; d += stepKm) {
    samples.push(interpolateAtDistance(points, cum, d))
  }
  // Ensure last point included
  if (samples.length === 0 || samples[samples.length - 1] !== points[points.length - 1]) {
    samples.push(points[points.length - 1])
  }
  return samples
}

export function interpolateAtDistance(points, cumDistances, targetKm) {
  let i = 1
  while (i < points.length && cumDistances[i] < targetKm) i++
  if (i === points.length) return points[points.length - 1]
  const a = points[i - 1]
  const b = points[i]
  const segLen = cumDistances[i] - cumDistances[i - 1]
  const t = segLen === 0 ? 0 : (targetKm - cumDistances[i - 1]) / segLen
  return { lat: a.lat + (b.lat - a.lat) * t, lon: a.lon + (b.lon - a.lon) * t }
}

export function interpolateByT(points, t) {
  // t in [0,1] along total length
  const cum = cumulativeDistances(points)
  const total = cum[cum.length - 1]
  return interpolateAtDistance(points, cum, total * Math.min(Math.max(t, 0), 1))
}

