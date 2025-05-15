import './App.scss'

import { useEffect, useContext } from 'react'
import { requestNotificationPermission } from '../tools'
import { Sidebar } from '../components'
import { Home, Settings } from '../pages'
import { PageContext } from '../context'

// [x]: Aplicar clase hidden en vez de usar renderizado condicional en el router
// [ ]: Añadir en el timer "x of x sessions ended"

const routes = [
  { path: '/', Component: Home, isHidden: true },
  { path: '/settings', Component: Settings }
]

export function App() {
  const { currentPath, displayPage } = useContext(PageContext)

  const routes = [
    { path: '/', Component: Home, isHidden: true },
    { path: '/settings', Component: Settings }
  ]

  useEffect(() => {
    console.log(currentPath)
    requestNotificationPermission()
  }, [currentPath])

  return (
    <main>
      <Sidebar />
      {routes.map(({ path, Component }) => displayPage(path, Component))}
    </main>
  )
}
