// src/components/GlobalAudioPlayer.jsx
import React, { useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAudioPlayer } from '../player/AudioPlayerProvider'

const fmt = (s=0) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2,'0')}`
}

const LAST_PATH_KEY = 'immersive.prevPath'

export default function GlobalAudioPlayer() {
  const {
    track, queue, isPlaying, currentTime, duration, volume, loop, shuffle,
    toggle, next, prev, seekPercent, setVolume, setLoop, setShuffle
  } = useAudioPlayer()

  const nav = useNavigate()
  const location = useLocation()
  const immersiveOpen = location.pathname === '/immersive'

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

  const toggleImmersive = () => {
    if (immersiveOpen) {
      let prev = '/'
      try { prev = sessionStorage.getItem(LAST_PATH_KEY) || '/'; sessionStorage.removeItem(LAST_PATH_KEY) } catch {}
      nav(prev, { replace: true })
    } else {
      try { sessionStorage.setItem(LAST_PATH_KEY, location.pathname + location.search) } catch {}
      nav('/immersive')
    }
  }

  // -------- inline styles (no external CSS) --------
  const colorAccent = '#22c55e'
  const sty = {
    shell: {
      position:'fixed', left:12, right:12, bottom:`calc(12px + env(safe-area-inset-bottom))`, zIndex:60,
      background:'#101214', color:'#e5e7eb', border:'1px solid rgba(255,255,255,.08)',
      borderRadius:20, boxShadow:'0 18px 60px rgba(0,0,0,.45)', overflow:'hidden'
    },
    inner: {
      display:'grid',
      gridTemplateColumns:'minmax(240px,28%) 1fr minmax(240px,28%)',
      alignItems:'center', gap:20, padding:'14px 18px', minHeight:94
    },
    left:{ display:'flex', alignItems:'center', gap:14, minWidth:0 },
    cover:{ width:68, height:68, borderRadius:14, overflow:'hidden', background:'#1f2937', flex:'0 0 auto' },
    coverImg:{ width:'100%', height:'100%', objectFit:'cover', display:'block' },
    coverPh:{ width:'100%', height:'100%', display:'grid', placeItems:'center', color:'#64748b' },
    meta:{ minWidth:0 },
    title:{ fontWeight:800, fontSize:'clamp(16px,2vw,22px)', color:'#f8fafc', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
    artist:{ marginTop:4, color:'#9fb0ba', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },

    center:{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, width:'100%', margin:'0 auto', minWidth:0 },
    controls:{ display:'flex', justifyContent:'center', alignItems:'center', gap:14, width:'100%' },
    btn:{ display:'grid', placeItems:'center', width:44, height:44, borderRadius:12, border:'none', cursor:'pointer',
          background:'rgba(255,255,255,.07)', color:'#fff' },
    btnActive:{ boxShadow:`inset 0 0 0 2px ${colorAccent}` },
    btnPrimary:{ width:58, height:58, borderRadius:999, background:colorAccent, color:'#0b0f0c' },
    svg22:{ width:22, height:22, display:'block' },
    svg28:{ width:28, height:28, display:'block' },

    progress:{ display:'grid', gridTemplateColumns:'56px 1fr 56px', alignItems:'center', gap:12, width:'100%', maxWidth:720, margin:'0 auto' },
    time:{ textAlign:'center', color:'#9fb0ba', fontVariantNumeric:'tabular-nums' },
    bar:{ position:'relative', height:8, borderRadius:999, background:'rgba(255,255,255,.16)', cursor:'pointer', overflow:'hidden' },
    loaded:{ position:'absolute', left:0, top:0, bottom:0, background:'rgba(255,255,255,.28)' },
    played:{ position:'absolute', left:0, top:0, bottom:0, background:`linear-gradient(90deg, ${colorAccent}, #86efac)` },
    knob:{ position:'absolute', right:0, top:'50%', transform:'translate(0,-50%)', width:14, height:14, borderRadius:999, background:'#fff',
           boxShadow:`0 0 0 6px rgba(34,197,94,.18)` },

    right:{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, minWidth:0 },
    volumeBox:{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:12, background:'rgba(255,255,255,.06)' },
    vol:{ width:'clamp(140px, 22vw, 240px)' },
    queue:{ display:'flex', alignItems:'center', gap:6, padding:'8px 10px', borderRadius:12, background:'rgba(255,255,255,.06)', color:'#d1d5db' }
  }

  return (
    <div role="region" aria-label="Global audio player" style={sty.shell}>
      <div style={sty.inner}>
        {/* Left: cover + meta */}
        <div style={sty.left}>
          <div style={sty.cover}>
            {track?.cover
              ? <img src={track.cover} alt="" style={sty.coverImg} />
              : <div aria-hidden="true" style={sty.coverPh}>
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 13H8v-2h5v2Zm3-4H8V8h8v4Z"/></svg>
                </div>}
          </div>
          <div style={sty.meta}>
            <div style={sty.title} title={track?.title || 'Nothing playing'}>{track?.title || 'Nothing playing'}</div>
            <div style={sty.artist} title={track?.artist || ''}>{track?.artist || ''}</div>
          </div>
        </div>

        {/* Center: controls + progress */}
        <div style={sty.center}>
          <div style={sty.controls}>
            <button
              style={{...sty.btn, ...(shuffle ? sty.btnActive : null)}}
              onClick={()=>setShuffle(!shuffle)}
              title="Shuffle (S)"
            >
              <svg viewBox="0 0 24 24" style={sty.svg22}><path fill="currentColor" d="M17 3h4v4h-2V5h-2V3ZM3 7h5.17l8 8H21v2h-5.17l-8-8H3V7Zm0 10h4v2H3v-2Zm14-4h4v4h-2v-2h-2v-2Z"/></svg>
            </button>

            <button style={sty.btn} onClick={prev} title="Previous">
              <svg viewBox="0 0 24 24" style={sty.svg22}><path fill="currentColor" d="M6 6h2v12H6V6Zm3.5 6 8.5 6V6l-8.5 6Z"/></svg>
            </button>

            <button style={{...sty.btn, ...sty.btnPrimary}} onClick={toggle} title="Play/Pause (Space)">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" style={sty.svg28}><path fill="currentColor" d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" style={sty.svg28}><path fill="currentColor" d="M8 5v14l11-7L8 5Z"/></svg>
              )}
            </button>

            <button style={sty.btn} onClick={next} title="Next">
              <svg viewBox="0 0 24 24" style={sty.svg22}><path fill="currentColor" d="M18 6h-2v12h2V6Zm-3.5 6L6 18V6l8.5 6Z"/></svg>
            </button>

            <button
              style={{...sty.btn, ...(loop ? sty.btnActive : null)}}
              onClick={()=>setLoop(!loop)}
              title="Repeat (L)"
            >
              <svg viewBox="0 0 24 24" style={sty.svg22}><path fill="currentColor" d="M7 7h7V5H7a5 5 0 0 0 0 10h2v-2H7a3 3 0 1 1 0-6Zm10 0h-2v2h2a3 3 0 1 1 0 6h-7v2h7a5 5 0 0 0 0-10Z"/></svg>
            </button>
          </div>

          <div style={sty.progress}>
            <div style={sty.time}>{fmt(currentTime)}</div>

            <div
              ref={barRef}
              onClick={onSeek}
              onMouseMove={onBarMove}
              onMouseLeave={()=>setHoverPc(null)}
              style={sty.bar}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={(hoverPc ?? pc) * (duration || 0)}
              aria-label="Seek"
            >
              <div style={{...sty.loaded, width:`${(hoverPc ?? pc)*100}%`}} />
              <div style={{...sty.played, width:`${pc*100}%`}}>
                <div style={sty.knob} />
              </div>
            </div>

            <div style={sty.time}>{fmt(duration)}</div>
          </div>
        </div>

        {/* Right: volume + immersive toggle + queue */}
        <div style={sty.right}>
          <div style={sty.volumeBox}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M5 15v-6h4l5-5v16l-5-5H5Z"/></svg>
            <input
              type="range" min="0" max="1" step="0.01"
              value={volume}
              onChange={(e)=>setVolume(Number(e.target.value))}
              aria-label="Volume"
              style={sty.vol}
            />
          </div>

          <button
            onClick={toggleImmersive}
            title={immersiveOpen ? 'Close Immersive' : 'Open Immersive'}
            aria-pressed={immersiveOpen}
            aria-label={immersiveOpen ? 'Close immersive player' : 'Open immersive player'}
            style={{...sty.btn, ...(immersiveOpen ? sty.btnActive : null)}}
          >
            <svg viewBox="0 0 24 24" style={sty.svg22} aria-hidden="true">
              <path fill="currentColor" d="M3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2.5l4-2.5v12l-4-2.5V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Z"/>
            </svg>
          </button>

          <div title="Queue" style={sty.queue}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 7h14v2H3V7Zm0 4h14v2H3v-2Zm0 4h10v2H3v-2Zm16-8h2v10h-2V7Z"/></svg>
            <span>{queue.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}