import { useContext } from 'react'
import { PomodoroContext } from '../../../context/pomodoro/pomodoro.context'
import './PomoTabs.scss'

export const PomoTabs = () => {
  const { currentMode, updateCurrentMode } = useContext(PomodoroContext)

  const handleClick = (e) => {
    const mode = e.target.getAttribute('data-tab')
    updateCurrentMode(mode, true)
  }

  return (
    <div className="pomo-timer__tab-box">
      <button
        className={
          'pomo-timer__tab-box__tab ' +
          (currentMode.mode === 'pomo' && 'active')
        }
        onClick={handleClick}
        data-tab="pomo"
      >
        Pomodoro
      </button>{' '}
      <button
        className={
          'pomo-timer__tab-box__tab ' +
          (currentMode.mode === 'short' && 'active')
        }
        onClick={handleClick}
        data-tab="short"
      >
        Short Break
      </button>{' '}
      <button
        className={
          'pomo-timer__tab-box__tab ' +
          (currentMode.mode === 'long' && 'active')
        }
        onClick={handleClick}
        data-tab="long"
      >
        Long Break
      </button>
    </div>
  )
}
