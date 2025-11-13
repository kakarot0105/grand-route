import React, { useState } from 'react'

export default function PinModal({ open, onClose, onSave, lat, lon }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📍')
  if (!open) return null
  return (
    <div role="dialog" aria-modal className="pop" style={overlay} onClick={onClose}>
      <div className="card" style={modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>Add Quest Pin</h3>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Lat {lat.toFixed(4)}, Lon {lon.toFixed(4)}</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            <span className="sr-only">Emoji</span>
            <input aria-label="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji" />
          </label>
          <label>
            <span className="sr-only">Name</span>
            <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g., Summit Point)" />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn" onClick={() => onSave({ name, emoji })} disabled={!name.trim()}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 80 }
const modal = { width: 360, maxWidth: '90vw' }

