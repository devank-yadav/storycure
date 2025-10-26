// src/pages/Library.jsx
import React, { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import sampleStories from '../data/sampleStories'
import FairyMascot from '../components/FairyMascot'

export default function Library() {
  const navigate = useNavigate()
  const [showFairy, setShowFairy] = useState(true)
  const saved = useMemo(() => JSON.parse(localStorage.getItem('stories') || '[]'), [])
  const stories = saved.length ? saved : sampleStories

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowFairy(false)
      else setShowFairy(true)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePlayStory = (story) => {
    navigate(`/story/${story.id}`)
  }

  // dynamic container height based on rows (3 cards per row)
  const containerHeight = `${Math.max(1, Math.ceil(stories.length / 3)) * 340}px`

  return (
    <>
      

      {/* Library container */}
      <div
        className="container"
        style={{
          marginTop: '0px',
          marginLeft: '180px',

          minHeight: containerHeight,
          paddingBottom: '200px'
        }}
      >
        <div className="card" style={{ padding: 20 }}>
          <h2 className="h2">Library</h2>

          {stories && stories.length > 0 ? (
            <div className="grid grid-3" style={{ marginTop: 12 }}>
              {stories.map((s) => (
                <div
                  key={s.id}
                  className="card"
                  style={{
                    padding: 14,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <div className="story-img" style={{ height: 140 }}>
                    [ Cover ]
                  </div>
                  <h3 className="h2" style={{ fontSize: 18 }}>
                    {s.title}
                  </h3>
                  <p className="p"style={{ fontSize: 10 }} >Created on {s.createdAt}</p>

                  <div className="row" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    
                  </div>

                  <button
                    className="play-btn"
                    onClick={() => handlePlayStory(s)}
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(88, 204, 2, 0.3)',
                      transition: 'all 0.2s ease',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)'
                      e.target.style.boxShadow = '0 6px 16px rgba(88, 204, 2, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)'
                      e.target.style.boxShadow = '0 4px 12px rgba(88, 204, 2, 0.3)'
                    }}
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p className="p" style={{ fontSize: 18, marginBottom: 20 }}>
                You do not have any stories yet.
              </p>
              <button
                onClick={() => navigate('/new')}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(88, 204, 2, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 6px 16px rgba(88, 204, 2, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 4px 12px rgba(88, 204, 2, 0.3)'
                }}
              >
                ✏️ Create Story
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}