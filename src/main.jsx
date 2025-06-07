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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        // console.log('[SW] Registro exitoso:', registration.scope, new Date().toLocaleTimeString())
      })
      .catch((error) => {
        console.error(error, new Date().toLocaleTimeString())
      })
  })
} else {
  console.warn(
    'Tu navegador no soporta Service Workers. Las notificaciones en segundo plano podrían fallar'
  )
}
