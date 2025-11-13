import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function FloatingParticles({ count = 24 }) {
  const parts = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: 6 + Math.random() * 10,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 18 + Math.random() * 12,
    delay: Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.25,
    color: pick(['#F9A8D4', '#C4B5FD', '#AEEEEE'])
  })), [count])

  return (
    <div aria-hidden className="pointer-events-none" style={wrap}>
      {parts.map(p => (
        <motion.span
          key={p.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -40, opacity: p.opacity }}
          transition={{ duration: p.duration, repeat: Infinity, repeatType: 'mirror', delay: p.delay, ease: 'easeInOut' }}
          style={{ ...dot, left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, background: p.color }}
        />
      ))}
    </div>
  )
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const wrap = { position: 'fixed', inset: 0, zIndex: 0 }
const dot = { position: 'absolute', borderRadius: '9999px', filter: 'blur(0.5px)' }

