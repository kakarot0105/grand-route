import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, { type = 'info', duration = 3000 } = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }, [])

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={wrap} aria-live="polite" aria-atomic>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...typeStyle[t.type] }} role="status">
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" style={btn}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

const wrap = { position: 'fixed', top: 12, right: 12, display: 'grid', gap: 8, zIndex: 1000 }
const toastStyle = { background: 'rgba(2,48,71,0.96)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }
const typeStyle = { info: {}, success: { borderColor: '#43aa8b' }, warning: { borderColor: '#fcbf49' }, error: { borderColor: '#d62828' } }
const btn = { background: 'transparent', border: 0, color: '#fff', cursor: 'pointer', fontSize: 16 }

