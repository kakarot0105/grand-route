import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuest } from '../../context/QuestContext.js'
import { useWeather } from '../../hooks/useWeather.js'

// Airi — pastel anime chibi assistant with glowing outline and speech bubbles
export default function Airi({ position = 'bottom-left' }) {
  const { route, questType } = useQuest()
  const target = useMemo(() => route?.to || route?.from, [route])
  const { current } = useWeather(target?.lat, target?.lon)
  const [visible, setVisible] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const info = useMemo(() => weatherInsight(current?.data, route), [current?.data, route, tick])
  const posStyle = positions[position] || positions['bottom-left']

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', zIndex: 30, ...posStyle }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <AiriAvatar mood={info.mood} />
        <AnimatePresence>
          <motion.div
            key={info.message}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="glass-overlay"
            role="status"
            aria-live="polite"
            style={bubble}
          >
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>アイリ</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{info.emoji}</span>
              <span style={{ fontWeight: 600 }}>{info.message}</span>
            </div>
            <button onClick={() => setVisible(false)} aria-label="Hide Airi" title="Hide" style={closeBtn}>×</button>
            <div style={tail} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function AiriAvatar({ mood = 'idle' }) {
  const { emoji, glow } = moodEmoji(mood)
  return (
    <motion.div
      className="airi-avatar"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.35 }}
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #F9A8D4, #C4B5FD)',
        boxShadow: `0 0 0 3px rgba(255,255,255,0.7), 0 8px 24px ${glow}`,
        filter: 'saturate(1.1)'
      }}
    >
      <span style={{ fontSize: 26 }}>{emoji}</span>
    </motion.div>
  )
}

function moodEmoji(mood) {
  switch (mood) {
    case 'rain': return { emoji: '🌧️', glow: 'rgba(157, 193, 249, 0.45)' }
    case 'snow': return { emoji: '❄️', glow: 'rgba(196, 229, 255, 0.45)' }
    case 'fog': return { emoji: '🌫️', glow: 'rgba(200, 200, 200, 0.4)' }
    case 'wind': return { emoji: '💨', glow: 'rgba(186, 230, 253, 0.45)' }
    case 'hot': return { emoji: '☀️', glow: 'rgba(255, 201, 150, 0.45)' }
    case 'cold': return { emoji: '🥶', glow: 'rgba(180, 220, 255, 0.45)' }
    case 'clear': return { emoji: '🌤️', glow: 'rgba(255, 210, 200, 0.45)' }
    default: return { emoji: '🧭', glow: 'rgba(220, 200, 255, 0.45)' }
  }
}

function weatherInsight(w, route) {
  if (!w) return { emoji: '🧭', message: 'Setting up your epic quest…', mood: 'idle' }
  const temp = Math.round(w.temp ?? 22)
  const wind = Math.round(w.wind ?? 0)
  const icon = String(w.icon || '')
  const distance = route?.distanceKm ? `${route.distanceKm.toFixed(0)} km` : ''
  // Prioritize conditions
  if (icon.includes('09') || icon.includes('10')) return { emoji: '🌧', message: `Rain ahead${distance ? ` on your ${distance} route` : ''}! Don’t forget your umbrella!`, mood: 'rain' }
  if (icon.includes('13')) return { emoji: '❄️', message: 'Snow on your path—drive safe and stay warm!', mood: 'snow' }
  if (icon.includes('50')) return { emoji: '🌫', message: 'Foggy patches ahead—slow and steady.', mood: 'fog' }
  if (wind >= 10) return { emoji: '💨', message: 'Strong winds today—secure your gear!', mood: 'wind' }
  if (temp >= 30) return { emoji: '☀️', message: 'Toasty weather—pack water and sunscreen.', mood: 'hot' }
  if (temp <= 5) return { emoji: '🥶', message: 'Chilly out—layer up for comfort.', mood: 'cold' }
  return { emoji: '🌤', message: 'Clear skies—perfect time to roll!', mood: 'clear' }
}

const bubble = {
  position: 'relative',
  padding: '10px 32px 10px 12px',
  maxWidth: 280,
  fontSize: 14,
  color: '#023047',
  boxShadow: '0 8px 24px rgba(2, 48, 71, 0.15)',
}

const tail = {
  position: 'absolute',
  bottom: 6,
  left: -6,
  width: 12,
  height: 12,
  background: 'inherit',
  transform: 'rotate(45deg)',
  borderLeft: '1px solid rgba(255,255,255,0.35)',
  borderBottom: '1px solid rgba(255,255,255,0.35)'
}

const closeBtn = {
  position: 'absolute',
  top: 6,
  right: 6,
  background: 'transparent',
  border: 0,
  color: '#023047',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1
}

const positions = {
  'bottom-left': { left: 16, bottom: 100 },
  'bottom-right': { right: 16, bottom: 100 },
  'top-left': { left: 16, top: 100 },
  'top-right': { right: 16, top: 100 }
}

