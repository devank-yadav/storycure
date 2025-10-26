// src/pages/NewStory.jsx
import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAudioPlayer } from '../player/AudioPlayerProvider'

export default function NewStory() {
  const { addToQueue, setQueue, play } = useAudioPlayer()
  const child = JSON.parse(localStorage.getItem('childProfile') || '{}')

  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState('')
  const [supportedType, setSupportedType] = useState('')

  const recRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const tickRef = useRef(null)

  useEffect(() => {
    if (window.MediaRecorder) {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        setSupportedType('audio/webm;codecs=opus')
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        setSupportedType('audio/mp4')
      } else {
        setSupportedType('')
      }
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  const start = async () => {
    if (!supportedType) { setStatus('Recording not supported in this browser'); return }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    chunksRef.current = []
    const mr = new MediaRecorder(stream, { mimeType: supportedType })
    recRef.current = mr
    mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = handleStop
    mr.start()
    setIsRecording(true)
    setElapsed(0)
    tickRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
  }

  const stop = () => {
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop()
    setIsRecording(false)
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
  }

  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, { type: supportedType || 'audio/webm' })
    const ext = supportedType.includes('mp4') ? 'm4a' : 'webm'
    const safeName = (child.name || 'child').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const path = `recordings/${safeName}/${Date.now()}.${ext}`

    setStatus('Uploading…')
    const { error } = await supabase.storage.from('audio').upload(path, blob, {
      contentType: blob.type,
      upsert: false
    })
    if (error) { setStatus('Upload failed'); return }

    const { data: signed } = await supabase.storage.from('audio').createSignedUrl(path, 60 * 60 * 24 * 7)
    if (signed?.signedUrl) {
      const track = { id: path, title: `${child.name || 'Child'} Recording`, src: signed.signedUrl }
      if (typeof addToQueue === 'function') addToQueue(track)
      else if (typeof setQueue === 'function') setQueue([track])
      if (typeof play === 'function') play(track.id)
    }
    setStatus('Saved')
  }

  return (
    <>
      <div className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh', 
        textAlign: 'center',
        padding: '0 20px' // To avoid any padding issues for small screens
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 className="h2">Record a Story</h1>

          <p className="help" style={{ marginTop: '20px', fontSize: '18px' }}>
            {isRecording ? `Recording… ${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}` : 'Tap the button to start'}
          </p>

          <div style={{ marginTop: '16px', minHeight: 24 }}>
            {status && <span className="help">{status}</span>}
          </div>
        </div>

        {/* Floating circular action button with microphone icon */}
        <button
          className="play-btn"
          onClick={isRecording ? stop : start}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          style={{
            width: '220px', // Increased size
            height: '220px', // Increased size
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
            fontSize: '30px', // Increased font size for the icon
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(88, 204, 2, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 204, 2, 0.3)'
          }}
        >
          {/* Microphone Icon */}
          <i className="fas fa-microphone" style={{ fontSize: '50px' }}></i> {/* Increased icon size */}
        </button>
      </div>
    </>
  )
}