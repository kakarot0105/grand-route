import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/community', label: 'Community' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/settings', label: 'Settings' }
]

export default function Header() {
  const { pathname } = useLocation()
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(2,48,71,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden style={{ fontSize: 28 }}>🗺️</span>
          <h1 style={{ margin: 0, fontFamily: 'Bangers, cursive', letterSpacing: 1, textShadow: '2px 2px 0 #001728' }}>GRAND ROUTE</h1>
        </div>
        <nav style={{ display: 'flex', gap: 12 }} aria-label="Primary">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} style={{
              color: pathname === n.to ? 'var(--gold)' : 'var(--white)', textDecoration: 'none', fontWeight: 700,
              borderBottom: pathname === n.to ? '2px solid var(--gold)' : '2px solid transparent', padding: '8px 4px'
            }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

