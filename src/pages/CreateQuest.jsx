import React from 'react'

export default function CreateQuest() {
  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0, fontFamily: 'Bangers, cursive' }}>Create a New Quest</h2>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: -6, marginBottom: 6 }}>新しいクエストを作成</div>
        <p>Design your own adventure for the community to experience.</p>
        
        {/* Quest creation form will go here */}
        <div style={{ 
          height: '300px', 
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed rgba(255,255,255,0.2)',
          marginTop: '24px'
        }}>
          <div style={{ textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️</div>
            <p>Quest creation map and form coming soon</p>
          </div>
        </div>
      </div>
    </main>
  )
}
