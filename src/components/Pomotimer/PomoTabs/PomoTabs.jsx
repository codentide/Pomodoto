import { useContext } from 'react'
import { PomodoroContext } from '../../../context'
import './PomoTabs.scss'

export const PomoTabs = () => {
  const { currentMode, updateCurrentMode, isRunning } =
    useContext(PomodoroContext)

  const handleClick = (event) => {
    if (isRunning) {
      const isConfirmed = window.confirm(
        'Estás seguro de que deseas continuar?'
      )
      if (!isConfirmed) return
    }

    const button = event.target
    const mode = button.getAttribute('data-tab')

    updateCurrentMode(mode, true)
  }

  return (
    <div className="tab-box">
      <button
        className={`tab-box__button ${currentMode === 'pomo' && 'active'}`}
        onClick={handleClick}
        data-tab="pomo"
      >
        Pomodoro
      </button>
      <button
        className={`tab-box__button ${currentMode === 'short' && 'active'}`}
        onClick={handleClick}
        data-tab="short"
      >
        Short Break
      </button>
      <button
        className={`tab-box__button ${currentMode === 'long' && 'active'}`}
        onClick={handleClick}
        data-tab="long"
      >
        Long Break
      </button>
    </div>
  )
}
