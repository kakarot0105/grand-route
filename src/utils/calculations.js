export function estimateFuelCost(distanceKm, fuelEfficiencyLPer100Km = 8, fuelPricePerL = 1.2) {
  const liters = (distanceKm * fuelEfficiencyLPer100Km) / 100
  return +(liters * fuelPricePerL).toFixed(2)
}

export function estimateTollCost(distanceKm, avoidTolls = false) {
  if (avoidTolls) return 0
  const ratePerKm = 0.06
  return +(distanceKm * ratePerKm).toFixed(2)
}

export function estimateTime(distanceKm, avgSpeedKmh = 80) {
  const hours = distanceKm / avgSpeedKmh
  return { hours: Math.floor(hours), minutes: Math.round((hours % 1) * 60) }
}

