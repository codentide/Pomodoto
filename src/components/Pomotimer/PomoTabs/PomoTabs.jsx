import { useContext } from 'react'
import { PomodoroContext } from '../../../context'
import './PomoTabs.scss'

export const PomoTabs = () => {
  const { currentMode, updateCurrentMode, isRunning, updateIsRunning } = useContext(PomodoroContext)

  const handleClick = (event) => {
    const button = event.target
    const mode = button.getAttribute('data-tab')

    // [ ]: Crear modal para manejar esto de mejor manera
    if (isRunning) {
      const isConfirmed = window.confirm('Si cambias ahora, se perderá el progreso de la sesión actual, estas seguro?')
      if (!isConfirmed) return
    }

    updateCurrentMode(mode, true)
  }

  return (
    <div className="tab-box">
      <button className={`tab-box__button ${currentMode === 'pomo' && 'active'}`} onClick={handleClick} data-tab="pomo">
        Pomodoro
      </button>
      <button
        className={`tab-box__button ${currentMode === 'short' && 'active'}`}
        onClick={handleClick}
        data-tab="short"
      >
        Short Break
      </button>
      <button className={`tab-box__button ${currentMode === 'long' && 'active'}`} onClick={handleClick} data-tab="long">
        Long Break
      </button>
    </div>
  )
}
