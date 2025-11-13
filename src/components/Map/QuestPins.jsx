import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import PinModal from './PinModal.jsx'
import { addPin, deletePin, ensureFirebase, setLiveLocation, subscribeLive, subscribePins } from '../../services/firebase.js'
import { useAuth } from '../../hooks/useAuth.js'
import { haversine } from '../../utils/route.js'
import { useToast } from '../../context/ToastContext.js'
import { notify, requestNotifyPermission } from '../../utils/notifications.js'
import Confetti from '../Feedback/Confetti.jsx'

export default function QuestPins() {
  ensureFirebase()
  const { user } = useAuth()
  const userId = user?.id || user?.uid || 'guest'
  const toast = useToast()
  const [pins, setPins] = useState([])
  const [modal, setModal] = useState(null) // { lat, lon }
  const [fireConfetti, setFireConfetti] = useState(false)
  const liveRef = useRef({})
  const reachedRef = useRef(new Set())

  // Map click to open modal
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setModal({ lat, lon: lng })
    }
  })

  // Load and subscribe pins
  useEffect(() => {
    if (!userId) return
    const unsub = subscribePins(userId, (list) => setPins(list || []))
    return () => unsub()
  }, [userId])

  // Share live location
  useEffect(() => {
    if (!userId || !('geolocation' in navigator)) return
    const id = navigator.geolocation.watchPosition((pos) => {
      setLiveLocation(userId, { lat: pos.coords.latitude, lon: pos.coords.longitude, name: user?.name || 'Friend' }).catch(() => {})
    })
    return () => navigator.geolocation.clearWatch(id)
  }, [userId, user])

  // Watch friends live location and detect proximity to my pins
  useEffect(() => {
    const off = subscribeLive((all) => {
      liveRef.current = all
      checkProximity()
    })
    return () => off()
  }, [pins])

  function checkProximity() {
    const lives = liveRef.current || {}
    const myPins = pins || []
    const me = userId
    Object.entries(lives).forEach(([friendId, loc]) => {
      if (!loc || friendId === me) return
      myPins.forEach((pin) => {
        const key = `${friendId}-${pin.id}`
        if (reachedRef.current.has(key)) return
        const d = haversine({ lat: loc.lat, lon: loc.lon }, { lat: pin.lat, lon: pin.lon }) // km
        if (d <= 0.1) {
          reachedRef.current.add(key)
          const name = lives[friendId]?.name || 'Friend'
          const msg = `🎉 Quest Complete! ${name} reached your pin: ${pin.name}`
          toast?.show?.(msg, { type: 'success', duration: 5000 })
          requestNotifyPermission().then((perm) => { if (perm === 'granted') notify('Quest Complete!', { body: `${name} reached ${pin.name}` }) })
          setFireConfetti(true)
          setTimeout(() => setFireConfetti(false), 2500)
        }
      })
    })
  }

  async function savePin({ name, emoji }) {
    if (!modal || !userId) return
    const pin = { name, emoji, lat: modal.lat, lon: modal.lon }
    try {
      const id = await addPin(userId, pin)
      toast?.show?.('Pin saved! Share from the marker popup.', { type: 'success' })
      setModal(null)
    } catch (e) {
      toast?.show?.('Failed to save pin', { type: 'error' })
    }
  }

  function sharePin(pin) {
    const data = encodeURIComponent(JSON.stringify({ owner: userId, pin: pin.id }))
    const url = `${location.origin}${location.pathname}#questpin=${data}`
    if (navigator.share) navigator.share({ title: 'Grand Route Pin', text: pin.name, url }).catch(() => copy(url))
    else copy(url)
    toast?.show?.('Share link copied', { type: 'info' })
  }

  function copy(text) { navigator.clipboard?.writeText(text).catch(() => {}) }

  return (
    <>
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lon]} icon={emojiIcon(p.emoji)}>
          <Popup>
            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 700 }}>{p.emoji} {p.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Lat {p.lat.toFixed(4)} • Lon {p.lon.toFixed(4)}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" onClick={() => sharePin(p)}>Share</button>
                <button className="btn btn-secondary" onClick={() => deletePin(userId, p.id)}>Delete</button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <PinModal open={!!modal} onClose={() => setModal(null)} onSave={savePin} lat={modal?.lat || 0} lon={modal?.lon || 0} />
      <Confetti fire={fireConfetti} />
    </>
  )
}

function emojiIcon(emoji = '📍') {
  return L.divIcon({
    className: 'emoji-pin',
    html: `<div style="font-size:24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4))">${emoji}</div>`
  })
}
