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
          <b>Lirra</b>
        </Link>

        <div className="navlinks">
          {isAuthed ? (
            <>
                          <NavLink to="/library" className={({isActive})=> isActive ? 'active': ''}>My Library</NavLink>

              <NavLink to="/new" className={({isActive})=> isActive ? 'active': ''}>Dear Diary</NavLink>
              <NavLink to="/settings" className={({isActive})=> isActive ? 'active': ''}>Myself</NavLink>
            </>
          ) : (
            <NavLink to="/auth" className={({isActive})=> isActive ? 'active': ''}>Sign in</NavLink>
          )}

          
          
        </div>
      </div>
    </nav>
  )
}
