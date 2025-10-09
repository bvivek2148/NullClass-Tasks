import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Initialize i18n before rendering the app
import './i18n'
import { initTheme } from './theme'

initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
