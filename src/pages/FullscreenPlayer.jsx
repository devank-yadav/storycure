// src/pages/FullscreenPlayer.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'
import './FullscreenPlayer.css'

const fmt = (s=0) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2,'0')}`
}

export default function FullscreenPlayer() {
  const {
    track, queue, index, isPlaying, currentTime, duration, volume, loop, shuffle,
    toggle, next, prev, seekPercent, setVolume, setLoop, setShuffle, setQueue
  } = useAudioPlayer()

  const pc = useMemo(() => duration ? (currentTime / duration) : 0, [currentTime, duration])

  const barRef = useRef(null)
  const [hoverPc, setHoverPc] = useState(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging || !barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      const x = (e.clientX ?? (e.touches?.[0]?.clientX ?? 0))
      const p = Math.min(1, Math.max(0, (x - rect.left) / rect.width))
      setHoverPc(p)
      seekPercent(p)
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, seekPercent])

  const onBarClick = (e) => {
    const rect = barRef.current.getBoundingClientRect()
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0)
    const p = Math.min(1, Math.max(0, (x - rect.left) / rect.width))
    seekPercent(p)
  }

  const onBarEnterMove = (e) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0)
    const p = Math.min(1, Math.max(0, (x - rect.left) / rect.width))
    setHoverPc(p)
  }

  const activePc = hoverPc ?? pc
  const cover = track?.cover || ''
  const title = track?.title || 'Nothing playing'
  const artist = track?.artist || ''

  return (
    <div className="fsp" role="main" aria-label="Fullscreen audio player">
      <div className="fsp-bg" style={{ backgroundImage: cover ? `url(${cover})` : 'none' }} />
      <div className="fsp-overlay" />

      <div className="fsp-inner">
        <div className="fsp-art-wrap">
          <div className="fsp-art">
            {cover ? (
              <img src={cover} alt="" />
            ) : (
              <div className="fsp-art-ph" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path fill="currentColor" d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 13H8v-2h5v2Zm3-4H8V8h8v4Z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="fsp-panel">
          <div className="fsp-meta">
            <div className="fsp-title" title={title}>{title}</div>
            <div className="fsp-artist" title={artist}>{artist}</div>
          </div>

          <div className="fsp-progress">
            <div className="fsp-time">{fmt(currentTime)}</div>
            <div
              className="fsp-bar"
              ref={barRef}
              onClick={onBarClick}
              onMouseMove={onBarEnterMove}
              onMouseLeave={()=>setHoverPc(null)}
              onMouseDown={()=>setDragging(true)}
              onTouchStart={(e)=>{ setDragging(true); onBarEnterMove(e) }}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={(activePc || 0) * (duration || 0)}
              aria-label="Seek"
              tabIndex={0}
            >
              <div className="fsp-loaded" style={{ width: `${activePc*100}%` }} />
              <div className="fsp-played" style={{ width: `${pc*100}%` }} />
            </div>
            <div className="fsp-time">{fmt(duration)}</div>
          </div>

          <div className="fsp-controls">
            <button className={`icon ${shuffle ? 'active' : ''}`} onClick={()=>setShuffle(!shuffle)} title="Shuffle (S)" aria-pressed={shuffle}>
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 3h4v4h-2V5h-2V3ZM3 7h5.17l8 8H21v2h-5.17l-8-8H3V7Zm0 10h4v2H3v-2Zm14-4h4v4h-2v-2h-2v-2Z"/></svg>
            </button>
            <button className="icon" onClick={prev} title="Previous">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z"/></svg>
            </button>
            <button className="play" onClick={toggle} title="Play/Pause (Space)" aria-pressed={isPlaying}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7L8 5Z"/></svg>
              )}
            </button>
            <button className="icon" onClick={next} title="Next">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 6h-2v12h2V6Zm-3.5 6L6 18V6l8.5 6Z"/></svg>
            </button>
            <button className={`icon ${loop ? 'active' : ''}`} onClick={()=>setLoop(!loop)} title="Repeat (L)" aria-pressed={loop}>
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 7h7V5H7a5 5 0 0 0 0 10h2v-2H7a3 3 0 1 1 0-6Zm10 0h-2v2h2a3 3 0 1 1 0 6h-7v2h7a5 5 0 0 0 0-10Z"/></svg>
            </button>
          </div>

          <div className="fsp-bottom">
            <div className="fsp-volume">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 15v-6h4l5-5v16l-5-5H5Z"/></svg>
              <input
                className="fsp-vol"
                type="range"
                min="0" max="1" step="0.01"
                value={volume}
                onChange={(e)=>setVolume(Number(e.target.value))}
                aria-label="Volume"
              />
            </div>

            <div className="fsp-queue">
              <div className="fsp-queue-head">
                <div className="fsp-queue-title">Queue</div>
                <div className="fsp-queue-count">{queue.length}</div>
              </div>
              <div className="fsp-queue-list" role="list">
                {queue.map((t, i) => (
                  <button
                    key={`${t.src}-${i}`}
                    className={`fsp-queue-item ${i === index ? 'current' : ''}`}
                    onClick={() => setQueue(queue, i)}
                    role="listitem"
                    title={t.title || 'Untitled'}
                  >
                    <div className="row-left">
                      <div className="thumb">
                        {t.cover ? <img src={t.cover} alt="" /> : <div className="ph" />}
                      </div>
                      <div className="meta">
                        <div className="ti" title={t.title || 'Untitled'}>{t.title || 'Untitled'}</div>
                        <div className="ar" title={t.artist || ''}>{t.artist || ''}</div>
                      </div>
                    </div>
                    <div className="row-right">
                      {i === index ? <span className="playing-dot" aria-label="Now playing">•</span> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}