import React, { useEffect, useRef, useState } from 'react'
import { resolveUSState, searchSuggestions } from '../../services/maps.js'

export default function AutocompleteInput({ label, placeholder, value, onSelect, initialState, name }) {
  const [text, setText] = useState(value?.name || '')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [stateCtx, setStateCtx] = useState(initialState || null)
  const [active, setActive] = useState(-1)
  const [announce, setAnnounce] = useState('')
  const boxRef = useRef()
  const tRef = useRef()
  const listId = `ac-list-${name || Math.random().toString(36).slice(2)}`
  const listRef = useRef(null)

  useEffect(() => { setText(value?.name || '') }, [value])

  useEffect(() => {
    const handler = (e) => { if (open && boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [open])

  useEffect(() => {
    clearTimeout(tRef.current)
    const q = text.trim()
    if (!q) { setItems([]); return }
    tRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const st = resolveUSState(q) || stateCtx
        const list = await searchSuggestions(q, { withinState: st })
        setItems(list)
        setActive(list.length ? 0 : -1)
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }, 250)
  }, [text, stateCtx])

  // Keep active option scrolled into view
  useEffect(() => {
    if (!open) return
    if (active < 0) return
    const el = document.getElementById(`${listId}-opt-${active}`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [active, open, listId])

  // Screen reader announcement of active option
  useEffect(() => {
    if (!open || active < 0 || !items[active]) { setAnnounce(''); return }
    setAnnounce(items[active].name)
  }, [active, open, items])

  function choose(item) {
    setOpen(false)
    setText(item.name)
    // If user selected a state, keep bbox context
    const st = resolveUSState(item.name.split(',')[0])
    if (st || item.type === 'region') setStateCtx(st || item)
    onSelect?.(item)
  }

  function onKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      e.preventDefault()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!items.length) return
      setActive((i) => (i + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!items.length) return
      setActive((i) => (i - 1 + items.length) % items.length)
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (!items.length) return
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      if (!items.length) return
      setActive(items.length - 1)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      if (!items.length) return
      setActive((i) => Math.min(items.length - 1, (i < 0 ? 0 : i) + 5))
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      if (!items.length) return
      setActive((i) => Math.max(0, (i < 0 ? 0 : i) - 5))
    } else if (e.key === 'Enter') {
      if (active >= 0 && items[active]) {
        e.preventDefault()
        choose(items[active])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      setActive(-1)
    }
  }

  function clear() {
    setText('')
    setItems([])
    setActive(-1)
    onSelect?.(null)
  }

  function onWheel(e) {
    if (!open || !items.length) return
    e.preventDefault()
    const dir = e.deltaY > 0 ? 1 : -1
    setActive((i) => {
      let next = i + dir
      if (next < 0) next = 0
      if (next >= items.length) next = items.length - 1
      return next
    })
  }

  return (
    <div className="card" ref={boxRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: 6, color: 'var(--gold)', fontWeight: 700 }}>{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={active >= 0 && items[active] ? `${listId}-opt-${active}` : undefined}
        style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: 10, border: '2px solid var(--teal)', background: 'rgba(255,255,255,0.06)', color: 'var(--white)' }}
      />
      {text ? (
        <button type="button" onClick={clear} aria-label={`Clear ${label}`} title="Clear" style={clearBtn}>
          ×
        </button>
      ) : null}
      {open && (items.length || loading) ? (
        <ul id={listId} role="listbox" ref={listRef} style={listStyle} onWheel={onWheel}>
          {loading ? <li style={optStyle}>Searching…</li> : items.map((it, idx) => (
            <li
              key={it.id}
              id={`${listId}-opt-${idx}`}
              role="option"
              aria-selected={idx === active}
              onMouseEnter={() => setActive(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(it)}
              style={{ ...optStyle, ...(idx === active ? optActiveStyle : null) }}
            >
              {it.name}
            </li>
          ))}
        </ul>
      ) : null}
      <div role="status" aria-live="polite" className="sr-only">{announce}</div>
    </div>
  )
}

const listStyle = { position: 'absolute', zIndex: 60, insetInline: 0, top: '100%', marginTop: 6, listStyle: 'none', padding: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', maxHeight: 300, overflowY: 'auto', background: 'rgba(2,48,71,0.98)' }
const optStyle = { padding: 10, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.08)' }
const optActiveStyle = { background: 'rgba(255,210,63,0.15)' }
const clearBtn = { position: 'absolute', right: 10, top: 36, background: 'transparent', border: 0, color: 'var(--white)', fontSize: 18, cursor: 'pointer' }
