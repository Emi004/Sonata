import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AudioProvider } from './context/AudioContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { RouterProvider } from "react-router-dom";
import {router} from "./routers.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AudioProvider>
  </StrictMode>,
)
