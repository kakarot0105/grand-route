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

  const login = (profile) => setUser({ ...profile, level: 1, xp: 0, class: 'Explorer' })
  const logout = () => setUser(null)
  const addXp = (amount) => setUser((u) => (u ? { ...u, xp: (u.xp || 0) + amount } : u))

  const value = useMemo(() => ({ user, login, logout, addXp }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

