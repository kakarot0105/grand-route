import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { requestNotifyPermission } from '../../utils/notifications.js'
import { useTheme } from '../../context/ThemeContext.js'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/create-quest', label: 'Create Quest' },
  { to: '/community', label: 'Community' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/settings', label: 'Settings' }
]

export default function Header() {
  const { pathname } = useLocation()
  const [lang, setLang] = useState('en')
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      background: 'rgba(2,48,71,0.85)', 
      backdropFilter: 'blur(12px)', 
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ 
            fontSize: 28,
            transition: 'transform 0.3s ease',
            display: 'inline-block'
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2) rotate(10deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          >🗺️</span>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontFamily: 'Bangers, cursive', 
              letterSpacing: 1.5, 
              textShadow: '2px 2px 0 #001728',
              background: 'linear-gradient(135deg, var(--gold), var(--orange))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '24px'
            }}>
              GRAND ROUTE
            </h1>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>グランド・ルート — 冒険の旅へ</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 8 }} aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} style={{
              color: pathname === n.to ? 'var(--gold)' : 'var(--white)', 
              textDecoration: 'none', 
              fontWeight: 600,
              fontSize: '14px',
              borderBottom: pathname === n.to ? '2px solid var(--gold)' : '2px solid transparent', 
              padding: '8px 12px',
              transition: 'var(--transition)',
              borderRadius: '8px 8px 0 0'
            }}
            onMouseEnter={(e) => {
              if (pathname !== n.to) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button 
            onClick={toggleTheme}
            className="btn-icon btn-secondary"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              fontSize: '20px',
              transition: 'var(--transition)'
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <label className="sr-only" htmlFor="lang">Language</label>
          <select 
            id="lang" 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            title="Language"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="ja">日本語</option>
          </select>
          <button className="btn" onClick={requestNotifyPermission}>
            🔔 Notify
          </button>
        </div>
      </div>
    </header>
  )
}
