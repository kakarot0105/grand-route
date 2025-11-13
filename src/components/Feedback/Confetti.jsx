import React, { useEffect, useMemo, useState } from 'react'

export default function Confetti({ fire, duration = 2000 }) {
  const [show, setShow] = useState(false)
  const parts = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 6,
    color: pick(['#FFD23F', '#FF6B35', '#00B4D8', '#E6E6FA', '#FFC0CB', '#98FF98']),
    delay: Math.random() * 200,
    duration: 1200 + Math.random() * 1200,
    rotate: Math.random() * 360
  })), [])

  useEffect(() => {
    if (fire) {
      setShow(true)
      const t = setTimeout(() => setShow(false), duration)
      return () => clearTimeout(t)
    }
  }, [fire, duration])

  if (!show) return null
  return (
    <div aria-hidden className="confetti" style={wrap}>
      {parts.map((p) => (
        <span key={p.id} style={{
          ...piece,
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          background: p.color,
          animationDelay: `${p.delay}ms`,
          animationDuration: `${p.duration}ms`,
          transform: `rotate(${p.rotate}deg)`
        }} />
      ))}
    </div>
  )
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const wrap = { position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1000 }
const piece = {
  position: 'absolute', top: -10, borderRadius: 2,
  animationName: 'confetti-fall, confetti-sway', animationTimingFunction: 'ease-in, ease-in-out', animationIterationCount: '1, infinite'
}

