// src/pages/Landing.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Landing() {
  const nav = useNavigate()
  const { isAuthed } = useAuth()
  const [showArrow, setShowArrow] = useState(true)
  const wrapperRef = useRef(null)

  const scrollToFeatures = () => {
    const section = document.getElementById('features')
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleScroll = () => {
      if (wrapper.scrollTop > 15) setShowArrow(false)
      else setShowArrow(true)
    }

    wrapper.addEventListener('scroll', handleScroll)
    return () => wrapper.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="landing-wrapper"
      style={{
        height: '100vh',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
      }}
    >
      {/* HERO SECTION */}
      <section
        className="container"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '25px 100px',
          marginTop: '-80px'
        }}
      >
        <div
          className="hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '60px',
            width: '120%',
            maxWidth: '1600px',
            flexWrap: 'nowrap'
          }}
        >
          {/* Left section — text */}
          <div style={{ flex: '1', maxWidth: '540px' }}>
            <span
              className="badge"
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '3px 14px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              New • Therapeutic AI
            </span>

            <h1
              className="h1"
              style={{
                fontSize: '44px',
                fontWeight: '800',
                lineHeight: '1.2',
                marginTop: '20px',
                marginBottom: '40px'
              }}
            >
              Lirra 🌙
            </h1>

            <p
              className="p"
              style={{
                fontSize: '18px',
                marginTop: '18px',
                color: '#333',
                lineHeight: '1.6'
              }}
            >
              Lirra listens to a child’s voice — their emotions, fears, and
              daily experiences — and transforms them into personalized,
              healing stories based on the child's needs.
            </p>

            <p
              className="p"
              style={{
                fontSize: '16px',
                marginTop: '16px',
                color: '#555'
              }}
            >
              Designed for children with diverse needs and developing minds,
              Lirra combines psychology, storytelling, and AI to create
              magical therapy through narration — a bedtime story reimagined
              for wellbeing.
            </p>

            <div className="row" style={{ marginTop: 28, display: 'flex', gap: '14px' }}>
              {isAuthed ? (
                <>
                  <button className="btn" onClick={() => nav('/dashboard')} style={buttonStyle}>
                    Go to Dashboard
                  </button>
                  <button className="btn-ghost" onClick={() => nav('/new')} style={ghostButtonStyle}>
                    Create a Story
                  </button>
                </>
              ) : (
                <button className="btn" onClick={() => nav('/auth')} style={buttonStyle}>
                  Sign In
                </button>
              )}
            </div>

            <p className="help" style={{ marginTop: 18, fontSize: '14px', color: '#666' }}>
              🛡️ Parental review required before any story reaches a child.
            </p>
          </div>

          {/* Right section — fairy illustration */}
          <div
            className="ill card"
            style={{
              flex: '1',
              minWidth: '400px',
              height: '480px',
              background: 'url("/assets/fairy_moon.jpg") center/cover no-repeat',
              borderRadius: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
        </div>

        {/* Animated Scroll Arrow */}
        <div
          onClick={scrollToFeatures}
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            animation: 'bounce 2s infinite',
            opacity: showArrow ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <span style={{ fontSize: '32px', color: 'var(--primary)' }}>↓</span>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>Scroll down</p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        style={{
          minHeight: '100vh',
          padding: '80px 100px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '40px' }}>
          🌟 Features that make Lirra magical
        </h2>

        <div
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            maxWidth: '1000px'
          }}
        >
          <div className="card" style={cardStyle}>
            <h3>🎙️ Voice Recognition</h3>
            <p>Understands the child’s speech to detect emotions and context.</p>
          </div>
          <div className="card" style={cardStyle}>
            <h3>💫 AI Story Generation</h3>
            <p>Transforms emotions into personalized therapeutic stories.</p>
          </div>
          <div className="card" style={cardStyle}>
            <h3>🎧 Immersive Audio</h3>
            <p>Stories narrated with expressive voices and calming music.</p>
          </div>
          <div className="card" style={cardStyle}>
            <h3>🎨 Visual Story Mode</h3>
            <p>Stories display visuals in sync with narration — like a comic.</p>
          </div>
          <div className="card" style={cardStyle}>
            <h3>💖 Inclusive Therapy</h3>
            <p>Supports children with disabilities or trauma through gentle storytelling.</p>
          </div>
          <div className="card" style={cardStyle}>
            <h3>🧠 Emotional Wellness</h3>
            <p>Builds empathy, calmness, and resilience through guided tales.</p>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes bounce {
            0%,20%,50%,80%,100% { transform: translateY(0); }
            40% { transform: translateY(8px); }
            60% { transform: translateY(4px); }
          }
          @media (max-width: 900px) {
            .hero { flex-direction: column; text-align: center; }
            .ill.card { margin-top: 40px; width: 90%; height: 380px; }
          }
        `}
      </style>
    </div>
  )
}

/* Reusable styles */
const buttonStyle = {
  background: 'var(--primary)',
  color: 'white',
  border: 'none',
  padding: '12px 28px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(88, 204, 2, 0.3)'
}

const ghostButtonStyle = {
  background: 'transparent',
  border: '2px solid var(--primary)',
  color: 'var(--primary)',
  padding: '12px 22px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer'
}

const cardStyle = {
  padding: '24px',
  borderRadius: '16px',
  background: '#f7f8fa',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  minHeight: '180px', // 🔒 Ensures equal box height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

