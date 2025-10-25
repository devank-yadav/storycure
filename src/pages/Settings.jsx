import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import FairyMascot from '../components/FairyMascot'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Settings(){
  const [child, setChild] = useState({})
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(()=> { setChild(JSON.parse(localStorage.getItem('childProfile') || '{}')) }, [])

  const sessions = useMemo(()=> JSON.parse(localStorage.getItem('sessionLogs') || '[]'), [])
  const stories = useMemo(()=> JSON.parse(localStorage.getItem('stories') || '[]'), [])

  const labels = sessions.map(s => new Date(s.ts).toLocaleDateString())
  const data = {
    labels,
    datasets: [{ label:'Mood (1-5)', data: sessions.map(s => s.mood), backgroundColor:'#A7F3D0' }]
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const save = (e)=>{
    e.preventDefault()
    localStorage.setItem('childProfile', JSON.stringify(child))
    alert('Saved!')
  }

  return (
    <>
      <FairyMascot style={{top: '300px', right: '130px', left: 'auto'}} />

      {/* Fixed logout button */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 900
      }}>
        <button 
          className="btn" 
          onClick={handleLogout}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            boxShadow: '0 4px 0 var(--primary-700)',
            fontSize: '14px',
            fontWeight: '600',
            padding: '10px 16px',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 6px 0 var(--primary-700)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 0 var(--primary-700)'
          }}
        >
          <span style={{fontSize: '16px'}}>↪️</span> Logout
        </button>
      </div>

      {/* SETTINGS FORM */}
      <div className="container" style={{maxWidth: '720px', marginTop: '0px', marginLeft:"100px", marginBottom: '100px'}}>
        <div className="card" style={{padding: '20px 24px 16px'}}>
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

        </div>

        {/* PROGRESS SECTION */}
        <div className="card" style={{padding: '24px', marginTop: '40px'}}>
          <h2 className="h2">Progress</h2>
          <div className="grid grid-3" style={{marginTop:12}}>
            <div className="card" style={{padding:16}}>
              <h3 className="h2">Stories completed</h3>
              <p className="p">{sessions.length}</p>
            </div>
            <div className="card" style={{padding:16}}>
              <h3 className="h2">Stories created</h3>
              <p className="p">{stories.length}</p>
            </div>
            <div className="card" style={{padding:16}}>
              <h3 className="h2">Average mood</h3>
              <p className="p">{sessions.length ? (sessions.reduce((a,b)=>a+b.mood,0)/sessions.length).toFixed(1) : '—'}</p>
            </div>
          </div>

          <div className="section" style={{marginTop:'24px'}}>
            <h3 className="h2">Mood over time</h3>
            {sessions.length ? (
              <Bar data={data} />
            ) : (
              <p className="p">No sessions yet. Read a story to see progress.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

