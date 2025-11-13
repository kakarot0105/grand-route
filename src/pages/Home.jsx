import React from 'react'
import QuestPlanner from '../components/QuestPlanner/QuestPlanner.jsx'
import MapView from '../components/Map/MapView.jsx'
import WeatherWidget from '../components/WeatherWidget/WeatherWidget.jsx'
import RouteCard from '../components/RouteCard/RouteCard.jsx'
import { useQuest } from '../context/QuestContext.js'

export default function Home() {
  const { route } = useQuest()
  return (
    <main className="container" style={{ display: 'grid', gap: 16 }}>
      <header className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Bangers, cursive', margin: 0 }}>Your Epic Journey Awaits</h2>
        <p style={{ opacity: 0.8 }}>Plan quests with real-time weather, scenic routes, and anime flair.</p>
      </header>
      <section className="grid grid-2" style={{ alignItems: 'start' }}>
        <QuestPlanner />
        <MapView />
      </section>
      <WeatherWidget />
      <RouteCard route={route} />
    </main>
  )
}
