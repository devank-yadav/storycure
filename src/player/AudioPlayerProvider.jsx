import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const AudioPlayerContext = createContext(null)

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null)

  const [queue, setQueue] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ap.queue') || '[]') } catch { return [] }
  })
  const [index, setIndex] = useState(() => {
    try { return Number(localStorage.getItem('ap.index') || 0) } catch { return 0 }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(() => {
    try { return Number(localStorage.getItem('ap.volume') || 0.9) } catch { return 0.9 }
  })
  const [loop, setLoop] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ap.loop') || 'false') } catch { return false }
  })
  const [shuffle, setShuffle] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ap.shuffle') || 'false') } catch { return false }
  })

  // Persist some bits
  useEffect(() => { localStorage.setItem('ap.queue', JSON.stringify(queue)) }, [queue])
  useEffect(() => { localStorage.setItem('ap.index', String(index)) }, [index])
  useEffect(() => { localStorage.setItem('ap.volume', String(volume)) }, [volume])
  useEffect(() => { localStorage.setItem('ap.loop', JSON.stringify(loop)) }, [loop])
  useEffect(() => { localStorage.setItem('ap.shuffle', JSON.stringify(shuffle)) }, [shuffle])

  // Wire native <audio> events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onMeta = () => setDuration(isFinite(audio.duration) ? audio.duration : 0)
    const onEnd = () => {
      if (loop) {
        audio.currentTime = 0
        audio.play().catch(() => {})
        return
      }
      next()
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [loop])

  // Media Session (lockscreen/OS controls)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const t = queue[index]
    if (!t) return
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: t.title || 'Untitled',
      artist: t.artist || '',
      album: t.album || '',
      artwork: t.cover ? [{ src: t.cover, sizes: '512x512', type: 'image/png' }] : []
    })
    navigator.mediaSession.setActionHandler('play', () => play())
    navigator.mediaSession.setActionHandler('pause', () => pause())
    navigator.mediaSession.setActionHandler('previoustrack', () => prev())
    navigator.mediaSession.setActionHandler('nexttrack', () => next())
    navigator.mediaSession.setActionHandler('seekto', (d) => { if (d.seekTime != null) seek(d.seekTime) })
  }, [queue, index])

  // Load current track into <audio> when index/queue changes
  useEffect(() => {
    const audio = audioRef.current
    const t = queue[index]
    if (!audio || !t || !t.src) return
    audio.src = t.src
    audio.loop = false
    audio.preload = 'metadata'
    audio.currentTime = 0
    setCurrentTime(0)
    setDuration(0)
    // If user just set a new track by clicking "play", we'll immediately play in play()
  }, [queue, index])

  // Controls
  const play = async (trackOrOpts) => {
    const audio = audioRef.current
    if (!audio) return
    // 1) If a track object provided, set it (and queue if provided)
    if (trackOrOpts && (trackOrOpts.src || Array.isArray(trackOrOpts))) {
      if (Array.isArray(trackOrOpts)) {
        setQueue(trackOrOpts)
        setIndex(0)
      } else {
        // if same src and already loaded, just resume
        const same = queue[index]?.src === trackOrOpts.src
        if (!same) {
          setQueue([trackOrOpts])
          setIndex(0)
        }
      }
      // wait next tick for effect to load src
      setTimeout(async () => {
        try { await audio.play() } catch { /* autoplay blocked until user clicks */ }
      }, 0)
      return
    }
    // 2) Resume current
    try { await audio.play() } catch { /* ignore */ }
  }

  const pause = () => { audioRef.current?.pause() }
  const toggle = () => { isPlaying ? pause() : play() }
  const seek = (timeSec) => {
    const a = audioRef.current
    if (!a || !isFinite(a.duration)) return
    a.currentTime = Math.max(0, Math.min(timeSec, a.duration))
  }
  const seekPercent = (p) => {
    const a = audioRef.current
    if (!a || !isFinite(a.duration)) return
    a.currentTime = Math.max(0, Math.min(p, 1)) * a.duration
  }
  const setVol = (v) => {
    const a = audioRef.current
    const clamped = Math.max(0, Math.min(v, 1))
    if (a) a.volume = clamped
    setVolume(clamped)
  }

  const next = () => {
    if (!queue.length) return
    if (shuffle) {
      const r = Math.floor(Math.random() * queue.length)
      setIndex(r)
      setTimeout(() => play(), 0)
      return
    }
    const ni = index + 1
    if (ni < queue.length) {
      setIndex(ni); setTimeout(() => play(), 0)
    } else {
      // end of queue
      setIsPlaying(false)
    }
  }

  const prev = () => {
    if (!queue.length) return
    const a = audioRef.current
    if (a && a.currentTime > 3) { a.currentTime = 0; return }
    const pi = index - 1
    if (pi >= 0) { setIndex(pi); setTimeout(() => play(), 0) }
  }

  const setQueueAndPlay = (tracks, startIndex = 0) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return
    setQueue(tracks)
    setIndex(Math.max(0, Math.min(startIndex, tracks.length - 1)))
    setTimeout(() => play(), 0)
  }

  const addToQueue = (track) => setQueue((q) => [...q, track])

  // Keyboard shortcuts (space/p/l, arrows)
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); toggle() }
      if (e.key === 'ArrowRight') seek(currentTime + 5)
      if (e.key === 'ArrowLeft') seek(currentTime - 5)
      if (e.key === 'ArrowUp') setVol(Math.min(1, volume + 0.05))
      if (e.key === 'ArrowDown') setVol(Math.max(0, volume - 0.05))
      if (e.key === 'l') setLoop(v => !v)
      if (e.key === 's') setShuffle(v => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentTime, volume])

  const value = useMemo(() => ({
    // state
    queue, index, track: queue[index] || null, isPlaying, currentTime, duration, volume, loop, shuffle,
    // controls
    play, pause, toggle, next, prev, seek, seekPercent, setVolume: setVol,
    setQueue: setQueueAndPlay, addToQueue, setLoop, setShuffle
  }), [queue, index, isPlaying, currentTime, duration, volume, loop, shuffle])

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('useAudioPlayer must be used within <AudioPlayerProvider>')
  return ctx
}