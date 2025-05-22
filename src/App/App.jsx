import { useEffect, useContext } from 'react'
import { PageContext } from '../context'
import { Home, Settings } from '../pages'
import { Sidebar } from '../components'
import { requestNotificationPermission } from '../tools'
import './App.scss'

// [x]: Aplicar clase hidden en vez de usar renderizado condicional en el router
// [x]: Añadir en el timer "x of x sessions ended"

const routes = [
  { path: '/', Component: Home },
  { path: '/settings', Component: Settings }
]

export function App() {
  const { displayPage } = useContext(PageContext)

  useEffect(() => {
    requestNotificationPermission()

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Pestaña oculta')
      } else {
        console.log('Pestaña activa de nuevo')
      }
    })
  }, [])

  return (
    <main>
      <Sidebar />
      {routes.map(({ path, Component }) => displayPage(path, Component))}
    </main>
  )
}
