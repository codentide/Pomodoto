import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App'
import { PageProvider, PomodoroProvider, SettingsProvider } from './context'
import './scss/index.scss'

createRoot(document.getElementById('root')).render(
  <>
    <StrictMode>
      {/* Manejo de router */}
      <PageProvider>
        {/* Configuraciones globales */}
        <SettingsProvider isTesting={false}>
          <PomodoroProvider>
            <App />
          </PomodoroProvider>
        </SettingsProvider>
      </PageProvider>
    </StrictMode>
  </>
)
