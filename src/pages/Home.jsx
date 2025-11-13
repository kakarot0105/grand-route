import React from 'react'
import QuestPlanner from '../components/QuestPlanner/QuestPlanner.jsx'
import MapView from '../components/Map/MapView.jsx'
import WeatherWidget from '../components/WeatherWidget/WeatherWidget.jsx'
import RouteCard from '../components/RouteCard/RouteCard.jsx'
import { useQuest } from '../context/QuestContext.js'
import PreviewPlayer from '../components/Preview/PreviewPlayer.jsx'
import HUD from '../components/Preview/HUD.jsx'
import FAB from '../components/Navigation/FAB.jsx'
import SeverityLegend from '../components/WeatherWidget/SeverityLegend.jsx'
import WeatherGearTips from '../components/WeatherWidget/WeatherGearTips.jsx'

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
      <div className="grid grid-2">
        <SeverityLegend />
        <WeatherGearTips />
      </div>
      <PreviewPlayer />
      <RouteCard route={route} />
      <HUD />
      <FAB />
    </main>
  )
}
