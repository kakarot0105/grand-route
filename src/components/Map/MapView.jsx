import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useQuest } from '../../context/QuestContext.js'
import SeverityOverlay from './SeverityOverlay.jsx'
import WeatherOverlay from './WeatherOverlay.jsx'
import { FEATURE_FLAGS } from '../../utils/constants.js'
import QuestPins from './QuestPins.jsx'

// Adjust default marker path fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView() {
  const { route } = useQuest()

  const bounds = useMemo(() => {
    if (!route?.geometry?.length) return [[40.7128, -74.006]]
    return route.geometry.map((p) => [p.lat, p.lon])
  }, [route])

  useEffect(() => {
    // future: side-effects on route change (traffic layer, etc.)
  }, [route])

  return (
    <div className="card" style={{ height: 520, position: 'relative' }}>
      <MapContainer style={{ height: '100%', width: '100%', borderRadius: 12 }} bounds={bounds} scrollWheelZoom>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer attribution='&copy; OpenTopoMap' url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {route?.geometry?.length ? (
          <>
            <Polyline positions={route.geometry.map((p) => [p.lat, p.lon])} pathOptions={{ color: '#FF6B35', weight: 5 }} />
            <SeverityOverlay route={route} />
            <WeatherOverlay route={route} />
            {route.from && (
              <Marker position={[route.from.lat, route.from.lon]}>
                <Popup>Start: {route.from.name}</Popup>
              </Marker>
            )}
            {route.to && (
              <Marker position={[route.to.lat, route.to.lon]}>
                <Popup>Destination: {route.to.name}</Popup>
              </Marker>
            )}
          </>
        ) : null}
        <QuestPins />
      </MapContainer>
      {route?.geometry?.length ? (
        <div className="glass-overlay" style={{ position: 'absolute', top: 12, left: 12, padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 12 }}>ルート情報</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>距離: {route.distanceKm?.toFixed?.(1)} km</div>
        </div>
      ) : null}
      {!route?.geometry?.length && FEATURE_FLAGS.skeletons ? (
        <div className="skeleton" aria-hidden style={{ position: 'absolute', inset: 12, borderRadius: 12 }} />
      ) : null}
    </div>
  )
}
