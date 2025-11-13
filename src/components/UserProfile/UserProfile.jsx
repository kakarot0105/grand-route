import React, { useMemo } from 'react'
import { FEATURE_FLAGS } from '../../utils/constants.js'

export default function UserProfile({ user }) {
  if (!user) return <div className="card">Sign in to view your profile.</div>
  const xp = user.xp || 0
  const level = user.level || 1
  const nextLevelAt = 100
  const pct = Math.max(0, Math.min(1, (xp % nextLevelAt) / nextLevelAt))
  const size = 64
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = useMemo(() => c * (1 - pct), [c, pct])
  return (
    <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {FEATURE_FLAGS.xpRing ? (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
          <circle cx={size/2} cy={size/2} r={r} stroke="url(#grad)" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`} />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFD23F" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
          <foreignObject x={stroke} y={stroke} width={size-stroke*2} height={size-stroke*2}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 28, background: 'linear-gradient(135deg, var(--orange), #EE4266)' }}>🧭</div>
          </foreignObject>
        </svg>
      ) : (
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), #EE4266)', display: 'grid', placeItems: 'center', fontSize: 28 }}>🧭</div>
      )}
      <div>
        <div style={{ fontWeight: 700 }}>{user.name || 'Adventurer'}</div>
        <div>Level {level} • {user.class || 'Explorer'}</div>
        {FEATURE_FLAGS.xpRing ? <div style={{ fontSize: 12, opacity: 0.8 }}>{Math.round(pct*100)}% to next level</div> : null}
      </div>
    </div>
  )
}
