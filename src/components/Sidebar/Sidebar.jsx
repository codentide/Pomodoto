import { Link } from '../Link/Link'

import settingsIcon from '../../assets/svg/settings.svg'
import houseIcon from '../../assets/svg/house.svg'
import logo from '/favicon.png'

import './Sidebar.scss'

export function Sidebar() {
  return (
    <header className="sidebar">
      <div className="sidebar__logo-section">
        <img src={logo} alt="logo" />
        <div>
          <p className="sidebar__logo-title">Pomodoto</p>
          <small className="sidebar__app-version">{VITE_APP_VERSION}</small>
        </div>
      </div>
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li className="sidebar__list-item">
            <Link className="sidebar__tab" to={'/'}>
              <img src={houseIcon} alt="Icono de casa" />
              <span>home</span>
            </Link>
          </li>
          <li className="sidebar__nav__list__item">
            <Link className="sidebar__tab" to={'/settings'}>
              <img src={settingsIcon} alt="Icono de ajustes" />
              <span>settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* <div className="sidebar__login-box">
          <a href="#" className="header__nav__link">
            Login
          </a>
        </div> */}
    </header>
  )
}
