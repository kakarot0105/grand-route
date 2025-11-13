const OWM = {
  base: 'https://api.openweathermap.org/data/2.5',
  key: import.meta.env.VITE_OPENWEATHER_KEY
}

export async function fetchCurrentWeather(lat, lon) {
  if (!OWM.key) {
    // Fallback to Open-Meteo if no key present
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Weather fetch failed')
    const data = await res.json()
    return {
      temp: data?.current?.temperature_2m,
      humidity: data?.current?.relative_humidity_2m,
      wind: data?.current?.wind_speed_10m,
      sunrise: data?.daily?.sunrise?.[0],
      sunset: data?.daily?.sunset?.[0],
      icon: '🌤️',
      provider: 'open-meteo'
    }
  }

  const url = `${OWM.base}/weather?lat=${lat}&lon=${lon}&appid=${OWM.key}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()
  return {
    temp: data.main?.temp,
    humidity: data.main?.humidity,
    wind: data.wind?.speed,
    sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toISOString() : undefined,
    sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toISOString() : undefined,
    icon: data.weather?.[0]?.icon || '01d',
    description: data.weather?.[0]?.description,
    provider: 'openweathermap'
  }
}

export async function fetchForecast(lat, lon) {
  if (!OWM.key) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Forecast fetch failed')
    const data = await res.json()
    return { hourly: data.hourly, daily: data.daily, provider: 'open-meteo' }
  }
  const url = `${OWM.base}/forecast?lat=${lat}&lon=${lon}&appid=${OWM.key}&units=metric`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Forecast fetch failed')
  const data = await res.json()
  return { list: data.list, provider: 'openweathermap' }
}

