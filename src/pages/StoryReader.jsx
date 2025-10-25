// src/pages/StoryReader.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAudioPlayer } from '../player/AudioPlayerProvider'
import { supabase } from '../lib/supabaseClient' // only needed if you want signed URLs

export default function StoryReader() {
  const { id } = useParams() // e.g., /story/:id
  const { play, setQueue, addToQueue } = useAudioPlayer()
  const [signed1, setSigned1] = useState(null)
  const [signed2, setSigned2] = useState(null)

  // EXAMPLE: if your audio files are in Supabase Storage (bucket: "audio")
  useEffect(() => {
    let mounted = true
    ;(async () => {
      // replace with your real storage paths
      const p1 = `stories/${id || 'demo'}/page1.mp3`
      const p2 = `stories/${id || 'demo'}/page2.mp3`

      const { data: s1 } = await supabase
        .storage.from('audio')
        .createSignedUrl(p1, 60 * 10) // 10 min
      const { data: s2 } = await supabase
        .storage.from('audio')
        .createSignedUrl(p2, 60 * 10)

      if (!mounted) return
      setSigned1(s1?.signedUrl || null)
      setSigned2(s2?.signedUrl || null)
    })()
    return () => { mounted = false }
  }, [id])

  const sampleTrack = {
    id: 'page-1',
    src: signed1 || 'https://YOUR-FALLBACK-URL/page1.mp3',
    title: 'Alex’s Hospital Adventure — Page 1',
    artist: 'Narrator',
    cover: '/covers/hospital.png',
    album: 'StoryCure'
  }

  return (
    <div className="container">
      <h2 className="h2">Story Reader</h2>
      <p className="p">Story ID: {id || 'demo'}</p>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn" onClick={() => play(sampleTrack)}>
          ▶️ Play page audio
        </button>

        <button
          className="btn-ghost"
          onClick={() =>
            setQueue(
              [
                sampleTrack,
                {
                  id: 'page-2',
                  src: signed2 || 'https://YOUR-FALLBACK-URL/page2.mp3',
                  title: 'Page 2',
                  artist: 'Narrator',
                  cover: '/covers/hospital.png',
                  album: 'StoryCure',
                },
              ],
              0
            )
          }
        >
          ▶️ Play full story
        </button>

        <button
          className="btn-ghost"
          onClick={() =>
            addToQueue({
              id: 'page-3',
              src: 'https://YOUR-FALLBACK-URL/page3.mp3',
              title: 'Page 3',
              artist: 'Narrator',
            })
          }
        >
          ➕ Add Page 3 to queue
        </button>
      </div>
    </div>
  )
}