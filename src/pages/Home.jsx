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
    <main className="container" style={{ display: 'grid', gap: 24 }}>
      <header className="card animate-fade-in" style={{ 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(0,180,216,0.1))',
        padding: '48px 24px',
        borderRadius: '24px'
      }}>
        <div style={{ display: 'inline-block', fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ 
          fontFamily: 'Bangers, cursive', 
          fontSize: '48px',
          margin: '0 0 12px 0',
          background: 'linear-gradient(135deg, var(--gold), var(--orange))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px'
        }}>
          Your Epic Journey Awaits
        </h2>
        <p style={{ 
          opacity: 0.9, 
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Plan quests with real-time weather, scenic routes, and anime flair. Adventure starts here! 🚀
        </p>
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-success">🌦️ Live Weather</span>
          <span className="badge badge-warning">🗾 Scenic Routes</span>
          <span className="badge">✨ Anime Style</span>
        </div>
      </header>
      
      <section className="grid grid-2 animate-fade-in" style={{ alignItems: 'start' }}>
        <QuestPlanner />
        <MapView />
      </section>
      
      <WeatherWidget />
      
      <div className="grid grid-2 animate-slide-in">
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
