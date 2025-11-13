import React, { createContext, useContext, useMemo, useState } from 'react'

const QuestContext = createContext(null)

export function QuestProvider({ children }) {
  const [questType, setQuestType] = useState('fast')
  const [waypoints, setWaypoints] = useState([]) // [{lat, lon, name}]
  const [route, setRoute] = useState(null) // {distanceKm, durationSec, geometry: [[lat,lon], ...]}
  const [options, setOptions] = useState({ avoidTolls: false, avoidHighways: false })

  const value = useMemo(() => ({ questType, setQuestType, waypoints, setWaypoints, route, setRoute, options, setOptions }), [questType, waypoints, route, options])
  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
}

export function useQuest() {
  return useContext(QuestContext)
}

