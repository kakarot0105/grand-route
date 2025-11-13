import React, { useEffect, useRef, useState } from 'react'
import { useQuest } from '../../context/QuestContext.js'
import { interpolateByT } from '../../utils/route.js'

export default function PreviewPlayer() {
  const { route } = useQuest()
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1) // x1, x2, x4
  const [t, setT] = useState(0) // 0..1 progress
  const raf = useRef()
  const last = useRef(0)

  useEffect(() => { setT(0); setPlaying(false) }, [route])

  useEffect(() => {
    if (!playing || !route?.geometry?.length) return
    function loop(ts) {
      const prev = last.current || ts
      const dt = Math.min(0.05, (ts - prev) / 1000) // seconds
      last.current = ts
      setT((prevT) => {
        const next = Math.min(1, prevT + dt * 0.02 * speed) // approx 50s full run at x1
        if (next >= 1) setPlaying(false)
        return next
      })
      if (playing) raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, speed, route])

  const pos = route?.geometry?.length ? interpolateByT(route.geometry, t) : null

  return (
    <div className="card" aria-label="Route Preview">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>{playing ? 'Pause ▮▮' : 'Play ▶︎'}</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Speed
            <select value={speed} onChange={(e) => setSpeed(+e.target.value)}>
              <option value={1}>x1</option>
              <option value={2}>x2</option>
              <option value={4}>x4</option>
            </select>
          </label>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input style={{ width: '100%' }} type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(parseFloat(e.target.value))} aria-label="Preview progress" />
          <div style={{ width: 80, textAlign: 'right' }}>{Math.round(t * 100)}%</div>
        </div>
      </div>
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        {pos ? `Sim position: ${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)}` : 'Load a quest to preview'}
      </div>
    </div>
  )
}

