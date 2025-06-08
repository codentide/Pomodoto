import { useContext } from 'react'
import { DialogContext, PomodoroContext } from '../../../context'
import './PomoTabs.scss'

export const PomoTabs = () => {
  const { currentMode, updateCurrentMode, isRunning, updateIsRunning } = useContext(PomodoroContext)
  const { showDialog } = useContext(DialogContext)

  const handleClick = (event) => {
    const button = event.target
    const mode = button.getAttribute('data-tab')

    // [x]: Crear modal para manejar esto de mejor manera
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
        Short
      </button>
      <button className={`tab-box__button ${currentMode === 'long' && 'active'}`} onClick={handleClick} data-tab="long">
        Long
      </button>
    </div>
  )
}
