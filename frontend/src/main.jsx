import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AudioProvider } from './context/AudioContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TrackProvider } from './context/TrackContext.jsx'
import { RouterProvider } from "react-router-dom";
import {router} from "./routers.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioProvider>
      <AuthProvider>
        <TrackProvider>
          <RouterProvider router={router} />
        </TrackProvider>
      </AuthProvider>
    </AudioProvider>
  </StrictMode>,
)
