import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <b>Loading…</b>
        </div>
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  return children
}