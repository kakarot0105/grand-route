import React from 'react'

export default function Dashboard() {
  const stats = [
    { label: 'Quests Completed', value: '24', emoji: '✅', color: 'var(--teal)' },
    { label: 'Total Distance', value: '342km', emoji: '🚴', color: 'var(--orange)' },
    { label: 'Weather Checks', value: '156', emoji: '🌦️', color: 'var(--gold)' },
    { label: 'Achievements', value: '12', emoji: '🏆', color: 'var(--purple)' }
  ]

  const recentActivities = [
    { title: 'Mountain Quest', date: '2 days ago', status: 'Completed', badge: 'success' },
    { title: 'Coastal Ride', date: '5 days ago', status: 'Completed', badge: 'success' },
    { title: 'City Tour', date: '1 week ago', status: 'In Progress', badge: 'warning' }
  ]

  return (
    <main className="container" style={{ display: 'grid', gap: 24 }}>
      <div className="card animate-fade-in" style={{ 
        background: 'linear-gradient(135deg, rgba(114,9,183,0.1), rgba(247,37,133,0.1))',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          fontFamily: 'Bangers, cursive',
          fontSize: '36px',
          background: 'linear-gradient(135deg, var(--purple), var(--pink))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Quest Dashboard
        </h2>
        <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '-6px', marginBottom: '6px' }}>クエストダッシュボード</div>
        <p style={{ opacity: 0.8, marginBottom: 0 }}>
          Track your epic adventures and achievements
        </p>
      </div>

      <section className="grid grid-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.emoji}</div>
            <div className="stat-number" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-2 animate-slide-in">
        <div className="card">
          <h3 style={{ 
            fontFamily: 'Bangers, cursive', 
            marginTop: 0,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📊</span> Weekly Progress
          </h3>
          <div style={{ 
            height: '200px', 
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed rgba(255,255,255,0.2)'
          }}>
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📈</div>
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ 
            fontFamily: 'Bangers, cursive',
            marginTop: 0,
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span> Recent Activities
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recentActivities.map((activity, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{activity.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>{activity.date}</div>
                </div>
                <span className={`badge badge-${activity.badge}`}>{activity.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'Bangers, cursive', fontSize: '20px' }}>
            Daily Goals
          </h4>
          <p style={{ opacity: 0.7, fontSize: '14px', margin: 0 }}>2/3 Completed</p>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '4px',
            marginTop: '12px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '66%', 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--teal), var(--gold))',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'Bangers, cursive', fontSize: '20px' }}>
            Current Streak
          </h4>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            fontFamily: 'Bangers, cursive',
            margin: '8px 0 0 0',
            color: 'var(--gold)'
          }}>7 Days</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</div>
          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'Bangers, cursive', fontSize: '20px' }}>
            Rank
          </h4>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 800, 
            fontFamily: 'Bangers, cursive',
            margin: '8px 0 0 0',
            color: 'var(--orange)'
          }}>#42</p>
        </div>
      </div>
    </main>
  )
}
