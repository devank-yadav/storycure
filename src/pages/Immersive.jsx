// src/pages/Immersive.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'
import { getStoryboardForTrack } from '../storyboards/localStoryboards'
import './Immersive.css'

const PANELS = ['A','B','C','D','E','F']

export default function Immersive(){
  const { track, currentTime } = useAudioPlayer()
  const cover = track?.cover || null

  const storyboard = useMemo(() => getStoryboardForTrack(track), [track])
  const cues = storyboard.cues?.slice().sort((a,b)=>a.at-b.at) || [{ at: 0, panels: {} }]

  // livePanels is the currently visible image per panel key (A..F)
  const [livePanels, setLivePanels] = useState({})

  // find active cue index (last cue with at <= currentTime)
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    let i = 0
    for (let k=0; k<cues.length; k++){
      if (cues[k].at <= currentTime) i = k; else break
    }
    setIdx(i)
  }, [currentTime, cues])

  // apply cue → update visible panels (merge semantics)
  const lastIdxRef = useRef(-1)
  useEffect(() => {
    if (idx === lastIdxRef.current) return
    lastIdxRef.current = idx
    setLivePanels(prev => {
      const next = { ...prev }
      const changes = cues[idx]?.panels || {}
      for (const key of Object.keys(changes)) {
        const val = changes[key]
        if (val == null) delete next[key]               // null clears a panel
        else next[key] = val                            // set/replace
      }
      return next
    })
    // prefetch a couple of upcoming cue images
    const preload = (url) => { if (!url) return; const img = new Image(); img.src = url }
    for (let k=idx+1; k<=idx+2 && k<cues.length; k++){
      const p = cues[k].panels || {}
      Object.values(p).forEach(preload)
    }
  }, [idx, cues])

  // If there’s a track cover and panel A is still empty at t=0, seed it.
  useEffect(() => {
    if (!cover) return
    setLivePanels(prev => (prev.A ? prev : { ...prev, A: cover }))
  }, [cover])

  const Panel = ({ area }) => {
    const src = livePanels[area] || null
    return (
      <div className={`panel ${src ? 'has-img' : 'is-empty'}`} style={{ gridArea: area }}>
        {src ? (
          <img key={src} className="panel-img fade-in" src={src} alt="" draggable={false} />
        ) : (
          <div className="panel-empty-ink">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z"/>
            </svg>
            <span>Waiting for scene…</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="immersive" role="main" aria-label="Immersive comic storyboard">
      {/* Soft blurred BG based on panel A or track cover */}
      <div className="im-bg" style={{ backgroundImage: `url(${livePanels.A || cover || ''})` }} />
      <div className="im-overlay" />

      <div className="im-inner">
        <div className="comic-wrapper">
          <div className="comic-grid" role="group" aria-label="Comic layout">
            {/* Layout areas: A A B / A A C / D E C / D F F */}
            {PANELS.map(p => <Panel key={p} area={p} />)}
          </div>
          <p className="tip">
            Scenes auto-advance from local storyboard • Cue {idx+1}/{cues.length} • {Math.floor(currentTime)}s
          </p>
        </div>
      </div>
    </div>
  )
}