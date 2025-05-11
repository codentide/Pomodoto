import './App.scss'

import { useEffect } from 'react'
import { Pomolist, PomoTimer, Header } from '../components'
import { requestNotificationPermission } from '../tools'

// [ ]: Añadir sistema de audio para alarma
// [ ]: Implementar audio para el "ticking"

export function App() {
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <>
      {/* TODO: Header tiene que ser un componente */}
      <Header></Header>
      <main className="main">
        <PomoTimer />
        <Pomolist />
      </main>
    </>
  )
}
