import React, { useState } from 'react'
import { QUEST_TYPES } from '../../utils/constants.js'
import { geocode, getRoute } from '../../services/maps.js'
import { useQuest } from '../../context/QuestContext.js'

export default function QuestPlanner() {
  const { questType, setQuestType, setRoute, options, setOptions } = useQuest()
  const [from, setFrom] = useState('New York')
  const [to, setTo] = useState('Boston')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onPlan(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const a = await geocode(from)
      const b = await geocode(to)
      const route = await getRoute([a, b], questType === 'scenic' ? 'cycling' : 'driving', options)
      setRoute({ ...route, from: a, to: b })
    } catch (err) {
      setError(err?.message || 'Failed to plan route')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card pop" onSubmit={onPlan} aria-label="Quest Planner">
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          <span className="sr-only">From</span>
          <input aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" required style={inputStyle} />
        </label>
        <label>
          <span className="sr-only">To</span>
          <input aria-label="To" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" required style={inputStyle} />
        </label>
        <label>
          <span className="sr-only">Quest Type</span>
          <select aria-label="Quest Type" value={questType} onChange={(e) => setQuestType(e.target.value)} style={inputStyle}>
            {QUEST_TYPES.map((q) => (
              <option key={q.key} value={q.key}>{q.label}</option>
            ))}
          </select>
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={checkStyle}><input type="checkbox" checked={options.avoidTolls} onChange={(e) => setOptions({ ...options, avoidTolls: e.target.checked })} /> Avoid tolls</label>
          <label style={checkStyle}><input type="checkbox" checked={options.avoidHighways} onChange={(e) => setOptions({ ...options, avoidHighways: e.target.checked })} /> Avoid highways</label>
        </div>
        <button className="btn" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Calculating…' : 'Start Quest ⚡'}
        </button>
        {error && <div role="alert" style={{ color: '#FFD23F' }}>{error}</div>}
      </div>
    </form>
  )
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: 10, border: '2px solid var(--teal)', background: 'rgba(255,255,255,0.06)', color: 'var(--white)'
}
const checkStyle = { display: 'flex', alignItems: 'center', gap: 8 }

