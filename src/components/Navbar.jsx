import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar(){
  const { user, isAuthed, logout } = useAuth()
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
  <>
    <NavLink to="/auth" className={({isActive})=> isActive ? 'active': ''}>Sign in</NavLink>
  </>
)}
        </div>
      </div>
    </nav>
  )
}