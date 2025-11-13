import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FEATURE_FLAGS } from '../../utils/constants.js'

const tabs = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/dashboard', label: 'Plan', emoji: '🧭' },
  { to: '/community', label: 'Community', emoji: '👥' },
  { to: '/leaderboard', label: 'Ranks', emoji: '🏆' },
  { to: '/profile', label: 'Profile', emoji: '🧑‍🚀' }
]

export default function BottomNav() {
  const { pathname } = useLocation()
  if (!FEATURE_FLAGS.bottomNav) return null
  return (
    <nav aria-label="Bottom" style={wrap} className="bottom-nav">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} style={{ ...item, color: pathname === t.to ? 'var(--gold)' : 'var(--white)' }}>
          <span aria-hidden style={{ fontSize: 18 }}>{t.emoji}</span>
          <span style={{ fontSize: 12 }}>{t.label}</span>
        </Link>
      ))}
    </nav>
  )
}

const wrap = {
  position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around',
  padding: '8px 8px calc(env(safe-area-inset-bottom) + 8px)', background: 'rgba(2,48,71,0.9)', backdropFilter: 'blur(8px)',
  borderTop: '1px solid rgba(255,255,255,0.12)', zIndex: 50, gap: 8
}
const item = { display: 'grid', placeItems: 'center', gap: 2, textDecoration: 'none', padding: '6px 8px', borderRadius: 10 }
