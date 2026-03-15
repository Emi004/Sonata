import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AudioProvider } from './context/AudioContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
    </AudioProvider>
  </StrictMode>,
)
