import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gr_user')) || null } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem('gr_user', JSON.stringify(user))
    else localStorage.removeItem('gr_user')
  }, [user])

  function ensureId(obj) {
    if (obj?.id) return obj
    const uid = localStorage.getItem('gr_uid') || (() => { const v = 'u_' + Math.random().toString(36).slice(2); localStorage.setItem('gr_uid', v); return v })()
    return { id: uid, ...obj }
  }

  const login = (profile) => setUser(ensureId({ ...profile, level: 1, xp: 0, class: 'Explorer' }))
  const logout = () => setUser(null)
  const addXp = (amount) => setUser((u) => (u ? ensureId({ ...u, xp: (u.xp || 0) + amount }) : u))

  const value = useMemo(() => ({ user: ensureId(user || {}), login, logout, addXp }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
