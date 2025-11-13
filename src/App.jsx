import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import BottomNav from './components/Navigation/BottomNav.jsx'
import FloatingParticles from './components/Decor/FloatingParticles.jsx'
import Mascot from './components/Decor/Mascot.jsx'
import Airi from './components/Assistant/Airi.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Community from './pages/Community.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <>
      <FloatingParticles />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
      <Mascot />
      <Airi />
    </>
  )
}
