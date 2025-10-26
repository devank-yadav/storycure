// src/components/navbar.jsx
import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar(){
  const { isAuthed } = useAuth()

  return (
    <nav className="navbar">
      <div className="navinner">
        <Link to="/" className="brand">
          <span className="brand-icon fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
          <b>Lirra</b>
        </Link>

        <div className="navlinks">
          {isAuthed ? (
            <>
              <NavLink to="/library" className={({isActive})=> isActive ? 'active': ''}>
                <span className="nav-icon fa-solid fa-book-open-reader" aria-hidden="true" />
                <span>My Library</span>
              </NavLink>
              <NavLink to="/new" className={({isActive})=> isActive ? 'active': ''}>
                <span className="nav-icon fa-solid fa-pen-nib" aria-hidden="true" />
                <span>Dear Diary</span>
              </NavLink>
              <NavLink to="/settings" className={({isActive})=> isActive ? 'active': ''}>
                <span className="nav-icon fa-solid fa-gear" aria-hidden="true" />
                <span>Myself</span>
              </NavLink>
            </>
          ) : (
            <NavLink to="/auth" className={({isActive})=> isActive ? 'active': ''}>
              <span className="nav-icon fa-solid fa-right-to-bracket" aria-hidden="true" />
              <span>Sign in</span>
            </NavLink>
          )}

        </div>
      </div>
    </nav>
  )
}
