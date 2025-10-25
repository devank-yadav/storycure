import React, { useEffect, useState } from 'react'

export default function Settings(){
  const [child, setChild] = useState({})

  useEffect(()=> { setChild(JSON.parse(localStorage.getItem('childProfile') || '{}')) }, [])

  const save = (e)=>{
    e.preventDefault()
    localStorage.setItem('childProfile', JSON.stringify(child))
    alert('Saved!')
  }

  return (
    <div className="container">
      <div className="card" style={{padding:20, maxWidth:720}}>
        <h2 className="h2">Settings</h2>
        <form className="form" onSubmit={save}>
          <div className="two">
            <div><label>Name</label><input value={child.name || ''} onChange={e=>setChild({...child, name:e.target.value})}/></div>
            <div><label>Age</label><input type="number" value={child.age || ''} onChange={e=>setChild({...child, age:e.target.value})}/></div>
          </div>
          <div className="two">
            <div><label>Hobbies</label><input value={child.hobbies || ''} onChange={e=>setChild({...child, hobbies:e.target.value})}/></div>
            <div><label>Condition</label><input value={child.condition || ''} onChange={e=>setChild({...child, condition:e.target.value})}/></div>
          </div>
          <div><label>Preferred language</label>
            <select value={child.language || 'en'} onChange={e=>setChild({...child, language:e.target.value})}>
              <option value="en">English</option><option value="es">Español</option><option value="fr">Français</option>
            </select>
          </div>
          <div className="row" style={{justifyContent:'flex-end'}}>
            <button className="btn">Save</button>
          </div>
        </form>

        <div className="section">
          <h3 className="h2">Voice (coming soon)</h3>
          <p className="p">Record a 15s sample to clone a caregiver’s voice for narration.</p>
          <button className="btn-ghost" disabled>Upload sample (disabled)</button>
        </div>
      </div>
    </div>
  )
}