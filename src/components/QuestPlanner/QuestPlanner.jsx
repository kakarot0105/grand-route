import React, { useState } from 'react'
import { QUEST_TYPES } from '../../utils/constants.js'
import { geocode, getRoute } from '../../services/maps.js'
import AutocompleteInput from './AutocompleteInput.jsx'
import { useToast } from '../../context/ToastContext.js'
import { useQuest } from '../../context/QuestContext.js'

export default function QuestPlanner() {
  const { questType, setQuestType, setRoute, options, setOptions } = useQuest()
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  async function onPlan(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (!from || !to) {
        throw new Error('Please select both From and To locations from suggestions.')
      }
      const a = from?.lat ? from : await geocode(typeof from === 'string' ? from : (from?.name || ''))
      const b = to?.lat ? to : await geocode(typeof to === 'string' ? to : (to?.name || ''))
      const route = await getRoute([a, b], questType === 'scenic' ? 'cycling' : 'driving', options)
      setRoute({ ...route, from: a, to: b })
      toast?.show?.('Quest planned! Ready to preview.', { type: 'success' })
    } catch (err) {
      const msg = err?.message || 'Failed to plan route'
      setError(msg)
      toast?.show?.(msg, { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card pop" onSubmit={onPlan} aria-label="Quest Planner">
      <div style={{ display: 'grid', gap: 12 }}>
        <AutocompleteInput label="From" placeholder="City, State, or 'NC'" value={from} onSelect={setFrom} name="from" />
        <AutocompleteInput label="To" placeholder="City, State, or 'SC'" value={to} onSelect={setTo} name="to" />
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
        <button id="start-quest-btn" className="btn" type="submit" disabled={loading} aria-busy={loading}>
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
