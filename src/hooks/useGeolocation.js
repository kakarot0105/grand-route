import { useEffect, useState } from 'react'

export function useGeolocation(options) {
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('Geolocation not supported'))
      return
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => setError(err),
      options
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [options])

  return { coords, error }
}

