import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuest } from '../../context/QuestContext.js'
import { useWeather } from '../../hooks/useWeather.js'

// Tiny animated mascot that reacts to weather conditions
export default function Mascot({ position = 'bottom-right' }) {
  const { route } = useQuest()
  const point = useMemo(() => route?.to || route?.from, [route])
  const { current } = useWeather(point?.lat, point?.lon)

  const mood = useMemo(() => {
    if (current.isLoading || current.isError || !current.data) return 'idle'
    const w = current.data
    if ((w.icon || '').includes('09') || (w.icon || '').includes('10')) return 'rain'
    if ((w.icon || '').includes('13')) return 'snow'
    if ((w.icon || '').includes('50')) return 'fog'
    if ((w.icon || '').includes('01') || (w.icon || '').includes('02')) return 'sun'
    return 'cloud'
  }, [current])

  const sprite = moodSprite(mood)

  const posStyle = positions[position] || positions['bottom-right']

  return (
    <motion.div aria-label="Mascot" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ ...wrap, ...posStyle }}>
      <motion.div whileHover={{ scale: 1.06 }} className="glass-overlay" style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28 }}>{sprite.emoji}</span>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700 }}>旅の案内人</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{sprite.caption}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function moodSprite(mood) {
  switch (mood) {
    case 'rain': return { emoji: '🌧️', caption: '雨に気をつけて！' }
    case 'snow': return { emoji: '❄️', caption: '雪道はゆっくり。' }
    case 'fog': return { emoji: '🌫️', caption: '視界注意！' }
    case 'sun': return { emoji: '☀️', caption: '絶好の旅日和！' }
    case 'cloud': return { emoji: '⛅', caption: '雲多めの空。' }
    default: return { emoji: '🧭', caption: '出発の準備はOK？' }
  }
}

const wrap = { position: 'fixed', zIndex: 20 }
const positions = {
  'bottom-right': { right: 16, bottom: 96 },
  'bottom-left': { left: 16, bottom: 96 },
  'top-right': { right: 16, top: 96 },
  'top-left': { left: 16, top: 96 },
}

