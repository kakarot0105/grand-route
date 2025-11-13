// Weather severity score and color helpers

export function computeSeverity({ precipProb = 0, wind = 0, temp = 22, aqi = 20, uv = 3 }) {
  const p = clamp01(precipProb / 100)
  const w = clamp01(wind / 15) // ~15 m/s as high wind baseline
  const t = Math.max(Math.abs((temp ?? 22) - 22) / 20, 0) // discomfort from 22C
  const a = clamp01(aqi / 150)
  const u = clamp01(uv / 11)
  const score = p * 2.5 + w * 2 + t * 1.5 + a * 1 + u * 1
  return Math.min(5, Math.round(score * 2) / 2) // half-steps up to 5
}

export function severityColor(sev) {
  if (sev >= 4.5) return '#d62828'
  if (sev >= 3.5) return '#f77f00'
  if (sev >= 2.5) return '#fcbf49'
  if (sev >= 1.5) return '#90be6d'
  return '#43aa8b'
}

function clamp01(x) { return Math.max(0, Math.min(1, x)) }

