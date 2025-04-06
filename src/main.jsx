import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/index.scss'
import { App } from './App/App'
import { PomodoroProvider } from './context/pomodoro/pomodoro.context'

createRoot(document.getElementById('root')).render(
  <PomodoroProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </PomodoroProvider>
)
