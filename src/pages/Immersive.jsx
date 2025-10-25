// src/pages/Immersive.jsx
import React from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'
import './Immersive.css'

export default function Immersive(){
  const { track } = useAudioPlayer()
  const cover = track?.cover

  return (
    <div className="immersive" role="main" aria-label="Immersive image + player">
      <div className="im-bg" style={cover ? { backgroundImage: `url(${cover})` } : undefined} />
      <div className="im-overlay" />
      <div className="im-inner">
        {cover ? (
          <img className="im-art" src={cover} alt="" />
        ) : (
          <div className="im-art ph" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="72" height="72">
              <path fill="currentColor" d="M12 3a9 9 0 100 18 9 9 0 000-18Zm1 13H8v-2h5v2Zm3-4H8V8h8v4Z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}