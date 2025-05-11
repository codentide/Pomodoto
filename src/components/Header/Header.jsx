import logo from '/favicon.png'
import './Header.scss'

export function Header() {
  return (
    <>
      <header className="header">
        <div className="header__logo">
          <img src={logo} alt="logo" />
          {/* <p className="header__logo__title">Pomodoto</p> */}
        </div>
        <nav className="header__nav">
          <ul className="header__nav__list">
            <li className="header__nav__list__item">
              <a href="#" className="header__nav__link">
                Home
              </a>
            </li>
            <li className="header__nav__list__item">
              <a href="#" className="header__nav__link">
                Login
              </a>
            </li>
            <li className="header__nav__list__item">
              <a href="#" className="header__nav__link">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
