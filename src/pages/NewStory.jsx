import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewStory(){
  const nav = useNavigate()
  const child = JSON.parse(localStorage.getItem('childProfile') || '{}')
  const [theme, setTheme] = useState('Hospital Adventure')
  const [style, setStyle] = useState('Cartoon')
  const [difficulty, setDifficulty] = useState('Standard')
  const [loading, setLoading] = useState(false)

  const generate = async (e)=>{
    e.preventDefault()
    setLoading(true)

    // Placeholder content (swap with your API calls later)
    const story = {
      id: 'story-' + Date.now(),
      title: `${child.name || 'Your'} ${theme}`,
      theme, style, difficulty,
      createdAt: new Date().toISOString().slice(0,10),
      pages: [
        { text: `${child.name || 'Your child'} felt nervous about ${theme.toLowerCase()}, so a friendly guide appeared.` },
        { text: `They practiced breathing: in 1-2-3-4, out 1-2-3-4, until it felt easier.` },
        { text: `They learned a coping skill and felt proud. The end.` }
      ]
    }

    const current = JSON.parse(localStorage.getItem('stories') || '[]')
    current.unshift(story)
    localStorage.setItem('stories', JSON.stringify(current))

    setLoading(false)
    nav('/story/' + story.id)
  }

  return (
    <div className="container">
      <div className="card" style={{padding:20}}>
        <h2 className="h2">New story</h2>
        <form className="form" onSubmit={generate}>
          <div className="two">
            <div>
              <label>Theme</label>
              <select value={theme} onChange={e=>setTheme(e.target.value)}>
                <option>Hospital Adventure</option>
                <option>Coping with Anxiety</option>
                <option>Making New Friends</option>
                <option>Brave at Bedtime</option>
              </select>
            </div>
            <div>
              <label>Art Style</label>
              <select value={style} onChange={e=>setStyle(e.target.value)}>
                <option>Cartoon</option><option>Comic</option><option>Watercolor</option><option>Storybook</option>
              </select>
            </div>
          </div>
          <div>
            <label>Difficulty</label>
            <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
              <option>Concise</option>
              <option>Standard</option>
              <option>Detailed</option>
            </select>
            <p className="help">Tip: choose Concise for younger kids or neurodivergent-friendly pacing.</p>
          </div>
          <button className="btn" disabled={loading}>{loading ? 'Generating…' : 'Generate story'}</button>
        </form>
      </div>
    </div>
  )
}