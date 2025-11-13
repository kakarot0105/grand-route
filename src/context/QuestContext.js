import React, { createContext, useContext, useMemo, useState } from 'react'

const QuestContext = createContext(null)

export function QuestProvider({ children }) {
  const [questType, setQuestType] = useState('fast')
  const [waypoints, setWaypoints] = useState([]) // [{lat, lon, name}]
  const [route, _setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gr_route')) || null } catch { return null }
  }) // {distanceKm, durationSec, geometry: [[lat,lon], ...]}
  const [options, setOptions] = useState({ avoidTolls: false, avoidHighways: false })
  const setRoute = (r) => {
    _setRoute(r)
    try { localStorage.setItem('gr_route', JSON.stringify(r)) } catch {}
  }

  const value = useMemo(() => ({ questType, setQuestType, waypoints, setWaypoints, route, setRoute, options, setOptions }), [questType, waypoints, route, options])
  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
}

export function useQuest() {
  return useContext(QuestContext)
}
