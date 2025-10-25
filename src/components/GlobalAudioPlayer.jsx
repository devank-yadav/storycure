import React, { useMemo, useRef, useState } from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'

// Simple time formatter
const fmt = (s=0) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2,'0')}`
}

export default function GlobalAudioPlayer() {
  const {
    track, queue, index, isPlaying, currentTime, duration, volume, loop, shuffle,
    toggle, next, prev, seekPercent, setVolume, setLoop, setShuffle
  } = useAudioPlayer()

  const pc = useMemo(() => duration ? (currentTime / duration) : 0, [currentTime, duration])
  const [hoverPc, setHoverPc] = useState(null)
  const barRef = useRef(null)

  const onSeek = (e) => {
    const rect = barRef.current.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    seekPercent(p)
  }

  const onBarMove = (e) => {
    const rect = barRef.current.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHoverPc(p)
  }

  return (
    <div className="ap-shell" role="region" aria-label="Global audio player">
      <div className="ap-inner">
        {/* Left: cover + meta */}
        <div className="ap-left">
          <div className="ap-cover">
            {track?.cover
              ? <img src={track.cover} alt="" />
              : <div className="ap-cover-ph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 13H8v-2h5v2Zm3-4H8V8h8v4Z"/></svg>
                </div>}
          </div>
          <div className="ap-meta">
            <div className="ap-title" title={track?.title || 'Nothing playing'}>
              {track?.title || 'Nothing playing'}
            </div>
            <div className="ap-artist" title={track?.artist || ''}>
              {track?.artist || ''}
            </div>
          </div>
        </div>

        {/* Center: controls + progress */}
        <div className="ap-center">
          <div className="ap-controls">
            <button className={`icon ${shuffle ? 'active' : ''}`} onClick={()=>setShuffle(!shuffle)} title="Shuffle (S)">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 3h4v4h-2V5h-2V3ZM3 7h5.17l8 8H21v2h-5.17l-8-8H3V7Zm0 10h4v2H3v-2Zm14-4h4v4h-2v-2h-2v-2Z"/></svg>
            </button>
            <button className="icon" onClick={prev} title="Previous">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z"/></svg>
            </button>
            <button className="play" onClick={toggle} title="Play/Pause (Space)">
              {isPlaying ? (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7L8 5Z"/></svg>
              )}
            </button>
            <button className="icon" onClick={next} title="Next">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 6h-2v12h2V6Zm-3.5 6L6 18V6l8.5 6Z"/></svg>
            </button>
            <button className={`icon ${loop ? 'active' : ''}`} onClick={()=>setLoop(!loop)} title="Repeat (L)">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h7V5H7a5 5 0 0 0 0 10h2v-2H7a3 3 0 1 1 0-6Zm10 0h-2v2h2a3 3 0 1 1 0 6h-7v2h7a5 5 0 0 0 0-10Z"/></svg>
            </button>
          </div>

          <div className="ap-progress">
            <div className="ap-time">{fmt(currentTime)}</div>
            <div
              className="ap-bar"
              ref={barRef}
              onClick={onSeek}
              onMouseMove={onBarMove}
              onMouseLeave={()=>setHoverPc(null)}
            >
              <div className="ap-loaded" style={{ width: `${(hoverPc ?? pc)*100}%` }} />
              <div className="ap-played" style={{ width: `${pc*100}%` }} />
            </div>
            <div className="ap-time">{fmt(duration)}</div>
          </div>
        </div>

        {/* Right: volume + queue count */}
        <div className="ap-right">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 15v-6h4l5-5v16l-5-5H5Z"/></svg>
          <input
            className="ap-vol"
            type="range"
            min="0" max="1" step="0.01"
            value={volume}
            onChange={(e)=>setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
          <div className="ap-queue" title="Queue">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 7h14v2H3V7Zm0 4h14v2H3v-2Zm0 4h10v2H3v-2Zm16-8h2v10h-2V7Z"/></svg>
            <span>{queue.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}