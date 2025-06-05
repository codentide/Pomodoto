import { Link } from '../Link/Link'

import logo from '/favicon.png'
import { isDev } from '../../tools'

import './Sidebar.scss'

import TimerSVG from "../../assets/svg/timer.svg?react"
import SettingsSVG from "../../assets/svg/settings.svg?react"

// [ ]: Componentizar enlaces para facilitar lectura
// [ ]: Cambiar iconos
// [ ]: Descargar licencia premium de los iconos usados
// [ ]: Aplicar responsividad para celulares
// [ ]: Implementar lógica de login

export function Sidebar() {
  return (
    <header className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li className="sidebar__list-item">
            <Link className="sidebar__tab" to={'/'}>
              <TimerSVG />
              <span>timer</span>
            </Link>
          </li>
          <li className="sidebar__nav__list__item">
            <Link className="sidebar__tab" to={'/settings'}>
              {/* <img src={settingsIcon} alt="Icono de ajustes" /> */}
              <SettingsSVG/>
              <span>settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar__logo-section">
        <img src={logo} alt="logo" />
        <div>
          <p className="sidebar__logo-title">Pomodoto</p>
          <small className="sidebar__app-version">
            {isDev() ? 'Dev' : 'v'}
            {VITE_APP_VERSION}
          </small>
        </div>
      </div>
    </header>
  )
}
