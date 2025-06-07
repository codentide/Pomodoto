import { useEffect, useContext } from 'react'
import { PageContext } from '../context'
import { Home, Settings } from '../pages'
import { Dialog, Sidebar } from '../components'
import { requestNotificationPermission } from '../tools'
import './App.scss'

const routes = [
  { path: '/', Component: Home },
  { path: '/settings', Component: Settings }
]

export function App() {
  const { displayPage } = useContext(PageContext)

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <>
      <Dialog />
      <main>
        <Sidebar />
        {routes.map(({ path, Component }) => displayPage(path, Component))}
      </main>
    </>
  )
}
