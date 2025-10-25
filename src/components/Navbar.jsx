// src/components/navbar.jsx
import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useAudioPlayer } from '../player/AudioPlayerProvider'

export default function Navbar(){
  const { isAuthed, logout } = useAuth()
  const { track, isPlaying } = useAudioPlayer()
  const nav = useNavigate()

  const onLogout = async ()=>{
    await logout()
    nav('/', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navinner">
        <Link to="/" className="brand">
          <span style={{fontSize:26}}>🧚‍♀️</span>
          <b>StoryCure</b>
        </Link>

        <div className="navlinks">
          {isAuthed ? (
            <>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'active': ''}>Dashboard</NavLink>
              <NavLink to="/new" className={({isActive})=> isActive ? 'active': ''}>New Story</NavLink>
              <NavLink to="/library" className={({isActive})=> isActive ? 'active': ''}>Library</NavLink>
              <NavLink to="/progress" className={({isActive})=> isActive ? 'active': ''}>Progress</NavLink>
              <NavLink to="/settings" className={({isActive})=> isActive ? 'active': ''}>Settings</NavLink>
              <button className="btn-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/auth" className={({isActive})=> isActive ? 'active': ''}>Sign in</NavLink>
          )}

          {/* Player button */}
          <Link
            to="/player"
            aria-label={track?.title ? `Open player: ${track.title}` : 'Open player'}
            className="btn-ghost"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:8, marginLeft:8 }}
            title={isPlaying ? 'Now Playing' : 'Open Player'}
          >
            {track?.cover ? (
              <img src={track.cover} alt="" style={{width:24,height:24,borderRadius:6,objectFit:'cover'}} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M9 18V5l11-2v13a4 4 0 1 1-2-3.465V7.3L11 8.8V18a4 4 0 1 1-2-3.464V18Z"/>
              </svg>
            )}
            <span style={{whiteSpace:'nowrap', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis'}}>
              {track?.title ? track.title : 'Player'}
            </span>
            <span style={{fontSize:12, opacity:0.8}}>
              {isPlaying ? '●' : '►'}
            </span>
          </Link>

          {/* Immersive page button */}
          <Link
            to="/immersive"
            aria-label="Open immersive view"
            className="btn-ghost"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:8, marginLeft:8 }}
            title="Immersive View"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M4 4h7v2H6v5H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z"/>
            </svg>
            <span>Immersive</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}