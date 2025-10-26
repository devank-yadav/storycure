import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { AuthProvider } from './auth/AuthContext.jsx'
import { AudioPlayerProvider } from './player/AudioPlayerProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AudioPlayerProvider>
          <App />
        </AudioPlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
