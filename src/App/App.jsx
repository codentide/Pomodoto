import './App.scss'

import { useEffect } from 'react'
import { Pomolist, PomoTimer } from '../components'
import { requestPermission } from '../tools'
import logo from '/logo.png'

// [ ]: Añadir sistema de audio para alarma
// [ ]: Implementar audio para el "ticking"

export function App() {
  useEffect(() => {
    requestPermission()
  }, [])

  return (
    <>
      {/* Header tiene que ser un componente */}
      <header className="header">
        <div className="header__logo">
          <img src={logo} alt="logo" />
          <p className="header__logo__title">Pomodoto</p>
        </div>
        <div className="header__menu">
          <p className="header__menu__item">Home</p>
          <p className="header__menu__item">Login</p>
          <p className="header__menu__item">Settings</p>
        </div>
      </header>
      <main className="main">
        <PomoTimer />
        <Pomolist />
      </main>
    </>
  )
}
