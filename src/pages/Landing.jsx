// src/pages/Landing.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Landing(){
  const nav = useNavigate()
  const { isAuthed } = useAuth()

  return (
    <div className="container">
      <div className="hero">
        <div>
          <span className="badge">New</span>
          <h1 className="h1">Personalized stories that teach real coping skills</h1>
          <p className="p">Turn a child’s journey into a magical, age-appropriate storybook.</p>

          <div className="row" style={{ marginTop: 14 }}>
            {isAuthed ? (
  <>
    <button className="btn" onClick={()=>nav('/dashboard')}>Go to dashboard</button>
    <button className="btn-ghost" onClick={()=>nav('/new')}>Create a story</button>
  </>
) : (
  <>
    <button className="btn" onClick={()=>nav('/auth')}>Get started</button>
    <button className="btn-ghost" onClick={()=>nav('/auth')}>I already have an account</button>
  </>
)}
          </div>
          <p className="help" style={{ marginTop: 8 }}>Parental review required before any story reaches a child.</p>
        </div>

        <div className="ill card" />
      </div>
    </div>
  )
}