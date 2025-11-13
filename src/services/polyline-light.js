// Lightweight polyline decoder (precision 6)
export default {
  decode(str, precision = 6) {
    let index = 0, lat = 0, lon = 0, coordinates = []
    const factor = Math.pow(10, precision)
    while (index < str.length) {
      let result = 0, shift = 0, b
      do {
        b = str.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1)
      lat += dlat

      result = 0
      shift = 0
      do {
        b = str.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlon = (result & 1) ? ~(result >> 1) : (result >> 1)
      lon += dlon

      coordinates.push([lat / factor, lon / factor])
    }
    return coordinates
  }
}

