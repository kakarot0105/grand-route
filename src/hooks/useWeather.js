import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather, fetchForecast } from '../services/weather.js'

export function useWeather(lat, lon) {
  const enabled = typeof lat === 'number' && typeof lon === 'number'
  const current = useQuery({
    queryKey: ['weather-current', lat, lon],
    queryFn: () => fetchCurrentWeather(lat, lon),
    enabled
  })
  const forecast = useQuery({
    queryKey: ['weather-forecast', lat, lon],
    queryFn: () => fetchForecast(lat, lon),
    enabled
  })
  return { current, forecast }
}

