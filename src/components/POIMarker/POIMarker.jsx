import React from 'react'

export default function POIMarker({ poi }) {
  // Placeholder component – integrate Google Places for details/photos
  return (
    <div>
      <strong>{poi.name}</strong>
      {poi.rating ? <div>⭐ {poi.rating}</div> : null}
      {poi.address ? <div>{poi.address}</div> : null}
    </div>
  )
}

