import React, { useMemo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import sampleStories from '../data/sampleStories'
import FairyMascot from '../components/FairyMascot'

export default function Library(){
  const navigate = useNavigate()
  const [showFairy, setShowFairy] = useState(true)
  const saved = useMemo(()=> JSON.parse(localStorage.getItem('stories') || '[]'), [])
  const stories = saved.length ? saved : sampleStories

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFairy(false)
      } else {
        setShowFairy(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePlayStory = (story) => {
    // Navigate to the story reader page to start playing
    navigate(`/story/${story.id}`)
  }

  return (
    <>
      {showFairy && (
        <FairyMascot style={{
          position: 'absolute',
          top: '130px',
          left: '700px',
          transition: 'opacity 0.3s ease-out',
          opacity: showFairy ? 1 : 0
        }} />
      )}
      <div 
        className="container" 
        style={{
          marginTop: '180px',
          marginLeft: '180px',
          minHeight: '150vh', // Make the container taller than viewport
          paddingBottom: '200px' // Add extra space at bottom
        }}
      >
        <div className="card" style={{padding:20}}>
          <h2 className="h2">Library</h2>
        <div className="grid grid-3" style={{marginTop:12}}>
          {stories && stories.length > 0 ? stories.map(s => (
            <div key={s.id} className="card" style={{padding:14, position:'relative', display:'flex', flexDirection:'column', height:'100%'}}>
              <div className="story-img" style={{height:140}}>[ Cover ]</div>
              <h3 className="h2" style={{fontSize:18}}>{s.title}</h3>
              <p className="p">Created {s.createdAt}</p>
              <div className="row" style={{marginTop: 'auto', paddingTop: '12px'}}>
                <Link 
                  className="btn" 
                  to={`/story/${s.id}`}
                  style={{
                    background: 'var(--secondary)',
                    color: 'var(--ink)',
                    boxShadow: '0 4px 0 #E6B800',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 6px 0 #E6B800'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 0 #E6B800'
                  }}
                >
                  📖 Read
                </Link>
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
          )) : (
            <div className="card" style={{padding:20, textAlign:'center'}}>
              <p className="p">No stories found. Create your first story!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}