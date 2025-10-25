// src/pages/Dashboard.jsx
import React from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'

export default function Dashboard() {
  const { play, setQueue, addToQueue } = useAudioPlayer()

  // Use files served from /public to avoid CORS / 500s while testing.
  // Place these in: public/audio/demo.mp3 and (optionally) public/audio/demo2.mp3
  const page1 = {
    id: 'page-1',
    src: '/audio/demo.mp3',
    title: 'Alex’s Hospital Adventure — Page 1',
    artist: 'Narrator',
    // cover: '/covers/hospital.png', // optional; remove if you don’t have it
    album: 'StoryCure'
  }

  const page2 = {
    id: 'page-2',
    src: '/audio/demo.mp3', // or reuse '/audio/demo.mp3' if you only have one file
    title: 'Page 2',
    artist: 'Narrator',
    // cover: '/covers/hospital.png',
    album: 'StoryCure'
  }

  return (
    <div className="container">
      <h2 className="h2">Dashboard</h2>
      <p className="p">Welcome back! Try the global player controls below.</p>

      <div className="card" style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => play(page1)}>
          ▶️ Play page 1
        </button>

        <button className="btn-ghost" onClick={() => setQueue([page1, page2], 0)}>
          ▶️ Play full story (pages 1–2)
        </button>

        <button
          className="btn-ghost"
          onClick={() =>
            addToQueue({
              id: 'page-3',
              src: '/audio/demo.mp3', // add a third file if you like
              title: 'Page 3',
              artist: 'Narrator'
            })
          }
        >
          ➕ Add page 3 to queue
        </button>
      </div>
    </div>
  )
}