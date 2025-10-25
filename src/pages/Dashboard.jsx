import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useAudioPlayer } from '../player/AudioPlayerProvider'
import './Immersive.css'

export default function Immersive(){
  const { track } = useAudioPlayer()
  const cover = track?.cover || null

  // 6 panels (A–F). Seed panel A with the current track cover if available.
  const [panels, setPanels] = useState([
    cover, // A
    null,  // B
    null,  // C
    null,  // D
    null,  // E
    null,  // F
  ])

  // Keep panel A synced if the track cover changes (only if user hasn't replaced it)
  useEffect(() => {
    setPanels(prev => {
      if (prev[0] && prev[0] !== cover) return prev // user set a custom image already
      const copy = [...prev]; copy[0] = cover; return copy
    })
  }, [cover])

  const fileInputRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)

  const openPicker = (idx) => {
    setActiveIndex(idx)
    fileInputRef.current?.click()
  }

  const onFilePick = (e) => {
    const file = e.target.files?.[0]
    if (!file || activeIndex == null) return
    const url = URL.createObjectURL(file)
    setPanels(p => {
      const copy = [...p]; copy[activeIndex] = url; return copy
    })
    e.target.value = '' // allow same file again later
  }

  const clearPanel = (idx) => {
    setPanels(p => {
      const copy = [...p]; copy[idx] = null; return copy
    })
  }

  // Drag & drop support on the whole grid
  const prevent = (e) => { e.preventDefault(); e.stopPropagation() }
  const onDrop = useCallback((e) => {
    prevent(e)
    const dt = e.dataTransfer
    const file = dt?.files?.[0]
    const idxAttr = (e.target.closest?.('[data-idx]')?.getAttribute('data-idx')) ?? null
    const idx = idxAttr != null ? Number(idxAttr) : null
    if (!file || idx == null) return
    const url = URL.createObjectURL(file)
    setPanels(p => {
      const copy = [...p]; copy[idx] = url; return copy
    })
  }, [])

  const Panel = ({ idx, area, seed }) => {
    const img = panels[idx] ?? seed ?? null
    return (
      <div
        className={`panel ${img ? 'has-img' : 'is-empty'}`}
        style={{ gridArea: area }}
        data-idx={idx}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={onDrop}
      >
        {img ? (
          <>
            <img className="panel-img" src={img} alt="" draggable={false} />
            <button className="panel-clear" onClick={()=>clearPanel(idx)} aria-label="Remove image">×</button>
            <button className="panel-change" onClick={()=>openPicker(idx)} aria-label="Change image">Change</button>
          </>
        ) : (
          <button className="panel-add" onClick={()=>openPicker(idx)} aria-label="Add image">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z"/>
            </svg>
            <span>Add image</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="immersive" role="main" aria-label="Immersive comic canvas + player">
      {/* soft bg blur using current cover if present */}
      <div className="im-bg" style={cover ? { backgroundImage: `url(${cover})` } : undefined} />
      <div className="im-overlay" />

      <div className="im-inner">
        <div className="comic-wrapper">
          <div className="comic-grid" role="group" aria-label="Comic layout">
            {/* Layout areas: A A B / A A C / D E C / D F F */}
            <Panel idx={0} area="A" seed={cover} />
            <Panel idx={1} area="B" />
            <Panel idx={2} area="C" />
            <Panel idx={3} area="D" />
            <Panel idx={4} area="E" />
            <Panel idx={5} area="F" />
          </div>
          <p className="tip">Click or drop an image into a panel • Right now: {panels.filter(Boolean).length}/6 filled</p>
        </div>
      </div>

      {/* one hidden file input for all panels */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFilePick}
        hidden
      />
    </div>
  )
}