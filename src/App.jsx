// src/App.jsx (updated)
import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewStory from './pages/NewStory.jsx'
import StoryReader from './pages/StoryReader.jsx'
import Library from './pages/Library.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import Auth from './pages/Auth.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import GlobalAudioPlayer from './components/GlobalAudioPlayer.jsx'
import FullscreenPlayer from './pages/FullscreenPlayer.jsx'
import Immersive from './pages/Immersive.jsx'                  // ← add

export default function App(){
  const location = useLocation()
  const hideNavbar = location.pathname === '/immersive'        // ← hide top nav on this page

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/player" element={<FullscreenPlayer />} />
        <Route path="/immersive" element={<Immersive />} />     {/* ← new page */}

        {/* Legacy paths → redirect to single Auth page */}
        <Route path="/signin" element={<Navigate to="/auth" replace />} />
        <Route path="/signup" element={<Navigate to="/auth" replace />} />

        {/* Protected */}
        <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
        <Route path="/dashboard"  element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/new"        element={<RequireAuth><NewStory /></RequireAuth>} />
        <Route path="/story/:id"  element={<RequireAuth><StoryReader /></RequireAuth>} />
        <Route path="/library"    element={<RequireAuth><Library /></RequireAuth>} />
        <Route path="/progress"   element={<RequireAuth><Progress /></RequireAuth>} />
        <Route path="/settings"   element={<RequireAuth><Settings /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalAudioPlayer />
    </>
  )
}