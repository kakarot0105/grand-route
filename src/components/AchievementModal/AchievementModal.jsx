import React from 'react'

export default function AchievementModal({ open, onClose, title = 'Quest Complete!', xp = 50 }) {
  if (!open) return null
  return (
    <div role="dialog" aria-modal className="pop" style={overlay} onClick={onClose}>
      <div className="card glow" style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
        <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>{title}</h3>
        <p>You earned <strong>{xp}</strong> XP!</p>
        <button className="btn" onClick={onClose}>Awesome!</button>
      </div>
    </div>
  )
}

const overlay = { position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)' }
const modal = { width: 360, textAlign: 'center' }

