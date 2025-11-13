import React from 'react'

export default function UserProfile({ user }) {
  if (!user) return <div className="card">Sign in to view your profile.</div>
  return (
    <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), #EE4266)', display: 'grid', placeItems: 'center', fontSize: 28 }}>🧭</div>
      <div>
        <div style={{ fontWeight: 700 }}>{user.name || 'Adventurer'}</div>
        <div>Level {user.level || 1} • {user.class || 'Explorer'}</div>
      </div>
    </div>
  )
}

