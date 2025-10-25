import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Progress(){
  const sessions = useMemo(()=> JSON.parse(localStorage.getItem('sessionLogs') || '[]'), [])
  const stories = useMemo(()=> JSON.parse(localStorage.getItem('stories') || '[]'), [])
  const labels = sessions.map(s => new Date(s.ts).toLocaleDateString())
  const data = {
    labels,
    datasets:[{ label:'Mood (1-5)', data: sessions.map(s => s.mood), backgroundColor:'#A7F3D0' }]
  }

  return (
    <div className="container">
      <div className="grid grid-3">
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

      <div className="section card" style={{padding:16}}>
        <h3 className="h2">Mood over time</h3>
        {sessions.length ? <Bar data={data} /> : <p className="p">No sessions yet. Read a story to see progress.</p>}
      </div>
    </div>
  )
}