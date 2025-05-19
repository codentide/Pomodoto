import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App'
import { PageProvider, PomodoroProvider } from './context'
import './scss/index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageProvider>
      <PomodoroProvider>
        <App />
      </PomodoroProvider>
    </PageProvider>
  </StrictMode>
)
