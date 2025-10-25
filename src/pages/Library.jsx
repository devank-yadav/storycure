import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import sampleStories from '../data/sampleStories'

export default function Library(){
  const saved = useMemo(()=> JSON.parse(localStorage.getItem('stories') || '[]'), [])
  const stories = saved.length ? saved : sampleStories

  return (
    <div className="container">
      <div className="card" style={{padding:20}}>
        <h2 className="h2">Library</h2>
        <div className="grid grid-3" style={{marginTop:12}}>
          {stories.map(s => (
            <div key={s.id} className="card" style={{padding:14}}>
              <div className="story-img" style={{height:140}}>[ Cover ]</div>
              <h3 className="h2" style={{fontSize:18}}>{s.title}</h3>
              <p className="p">Created {s.createdAt}</p>
              <div className="row">
                <Link className="btn" to={`/story/${s.id}`}>Read</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}