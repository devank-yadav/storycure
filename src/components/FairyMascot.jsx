import React, { useState, useEffect } from 'react'

export default function FairyMascot({ style = {} }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDialogue, setShowDialogue] = useState(true)
  const [isFloating, setIsFloating] = useState(true)
  const [fairyRef, setFairyRef] = useState(null)

  useEffect(() => {
    // Show fairy after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleFairyClick = () => {
    setShowDialogue(!showDialogue)
    setIsFloating(false)
  }

  const handleDialogueClose = () => {
    setShowDialogue(false)
    setIsFloating(true)
  }

  const getDialoguePosition = () => {
    if (!fairyRef) return {}
    const fairyRect = fairyRef.getBoundingClientRect()
    return {
      position: 'fixed',
      top: `${fairyRect.bottom - 20}px`, // Slightly overlap with fairy
      left: `${fairyRect.left + fairyRect.width/2}px`,
      transform: 'translateX(-50%)',
      zIndex: 999, // Below fairy
    }
  }

  return (
    <>
      {/* Fairy Mascot - Centered and Prominent */}
      <div
        ref={setFairyRef}
        className="fairy-mascot"
        style={{
          position: 'fixed',
          zIndex: 1000,
          cursor: 'pointer',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease',
          top: '80px',
          left: '50%',
          transform: isFloating ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-5px)',
          ...style
        }}
        onClick={handleFairyClick}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #FFD1DC, #FFB6C1, #FFC0CB)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            position: 'relative',
            animation: isFloating ? 'fairyFloat 3s ease-in-out infinite' : 'none',
            boxShadow: '0 12px 30px rgba(255, 182, 193, 0.6)',
            border: '3px solid #FFB6C1'
          }}
        >
          {/* Fairy Wings */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-30px',
              width: '60px',
              height: '80px',
              background: 'linear-gradient(45deg, #E6E6FA, #DDA0DD)',
              borderRadius: '50% 0 50% 0',
              transform: 'rotate(-20deg)',
              opacity: 0.9,
              animation: 'wingFlap 2s ease-in-out infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-30px',
              width: '60px',
              height: '80px',
              background: 'linear-gradient(-45deg, #E6E6FA, #DDA0DD)',
              borderRadius: '0 50% 0 50%',
              transform: 'rotate(20deg)',
              opacity: 0.9,
              animation: 'wingFlap 2s ease-in-out infinite 0.5s'
            }}
          />
          
          {/* Fairy Face */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px'
            }}
          >
            {/* Eyes */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '12px',
                width: '8px',
                height: '8px',
                background: '#333',
                borderRadius: '50%'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '12px',
                width: '8px',
                height: '8px',
                background: '#333',
                borderRadius: '50%'
              }}
            />
            {/* Smile */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '12px',
                border: '3px solid #333',
                borderTop: 'none',
                borderRadius: '0 0 24px 24px'
              }}
            />
          </div>

          {/* Sparkles */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '16px',
              height: '16px',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'sparkle 1.5s ease-in-out infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '-16px',
              width: '12px',
              height: '12px',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'sparkle 1.5s ease-in-out infinite 0.7s'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '-25px',
              width: '10px',
              height: '10px',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'sparkle 1.5s ease-in-out infinite 1.2s'
            }}
          />
        </div>
      </div>

      {/* Dialogue Box - Always visible and prominent */}
      {showDialogue && (
        <div
          className="fairy-dialogue"
          style={{
            ...getDialoguePosition(),
            animation: 'dialoguePop 0.3s ease-out',
            width: '100%',
            maxWidth: '350px',
            margin: '0 auto'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #FFF8DC, #FFE4E1)',
              border: '3px solid #FFB6C1',
              borderRadius: '25px',
              padding: '20px 25px',
              maxWidth: '350px',
              boxShadow: '0 12px 35px rgba(255, 182, 193, 0.4)',
              position: 'relative',
              textAlign: 'center'
            }}
          >
            {/* Speech bubble tail */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '15px solid #FFB6C1'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '12px solid #FFE4E1'
              }}
            />
            
            <p style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#8B4513',
              lineHeight: '1.4'
            }}>
              xxxxxxx
            </p>
            
            <button
              onClick={handleDialogueClose}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#FF69B4',
                fontWeight: 'bold',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fairyFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        
        @keyframes wingFlap {
          0%, 100% { transform: rotate(-20deg) scaleY(1); }
          50% { transform: rotate(-15deg) scaleY(0.8); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes dialoguePop {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </>
  )
}
