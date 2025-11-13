import React from 'react'
import { FEATURE_FLAGS } from '../../utils/constants.js'

export default function FAB() {
  if (!FEATURE_FLAGS.fab) return null
  function clickStart() {
    const btn = document.getElementById('start-quest-btn')
    if (btn) btn.click()
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <button 
      aria-label="Start Quest" 
      onClick={clickStart} 
      style={fab} 
      className="btn glow fab-floating"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15) rotate(15deg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
      }}
    >
      ⚡
    </button>
  )
}

const fab = {
  position: 'fixed', 
  right: 16, 
  bottom: 80, 
  width: 56, 
  height: 56, 
  borderRadius: '50%', 
  display: 'grid', 
  placeItems: 'center',
  zIndex: 60,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 16px rgba(255,107,53,0.4)'
}
