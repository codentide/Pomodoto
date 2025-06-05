import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App/App'
import { PageProvider, PomodoroProvider, SettingsProvider, DialogProvider } from './context'
import './scss/index.scss'

createRoot(document.getElementById('root')).render(
  <>
    <StrictMode>
      {/* Manejo de router */}
      <PageProvider>
        {/*  */}
        <DialogProvider>
          {/* Configuraciones globales */}
          <SettingsProvider isTesting={process.env.NODE_ENV === 'development'}>
            <PomodoroProvider>
              <App />
            </PomodoroProvider>
          </SettingsProvider>
        </DialogProvider>
      </PageProvider>
    </StrictMode>
  </>
)
