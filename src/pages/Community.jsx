import React from 'react'

const friends = [
  { id: 1, name: 'Sonic', status: 'On a quest', avatar: 'https://i.pravatar.cc/150?u=sonic' },
  { id: 2, name: 'Tails', status: 'Idle', avatar: 'https://i.pravatar.cc/150?u=tails' },
  { id: 3, name: 'Knuckles', status: 'On a quest', avatar: 'https://i.pravatar.cc/150?u=knuckles' },
  { id: 4, name: 'Amy', status: 'Idle', avatar: 'https://i.pravatar.cc/150?u=amy' },
]

export default function Community() {
  return (
    <main className="container">
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(247,37,133,0.1), rgba(114,9,183,0.1))',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          fontFamily: 'Bangers, cursive',
          fontSize: '36px',
          background: 'linear-gradient(135deg, var(--pink), var(--purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Your Guild
        </h2>
        <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '-6px', marginBottom: '6px' }}>あなたのギルド</div>
        <p style={{ opacity: 0.8, marginBottom: 0 }}>
          Connect with your fellow adventurers
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, fontFamily: 'Bangers, cursive', fontSize: '24px' }}>Friends List</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {friends.map(friend => (
            <div key={friend.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{friend.name}</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>{friend.status}</div>
                </div>
              </div>
              <button className="button-secondary">
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
