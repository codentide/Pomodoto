import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App'
import { PageProvider, PomodoroProvider } from './context'
import './scss/index.scss'

createRoot(document.getElementById('root')).render(
  <PageProvider>
    <PomodoroProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </PomodoroProvider>
  </PageProvider>
)
