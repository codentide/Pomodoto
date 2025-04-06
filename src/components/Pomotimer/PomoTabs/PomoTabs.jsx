import { useContext } from 'react'
import { PomodoroContext } from '../../../context/pomodoro/pomodoro.context'

import './PomoTabs.scss'

export const PomoTabs = () => {
  const { activeMode, updateActiveMode } = useContext(PomodoroContext)

  // Handle tab click
  const handleClick = (e) => {
    const tab = e.target.getAttribute('data-tab')
    updateActiveMode(tab)
  }

  // Tabs are generated here
  return (
    <div className="pomo-timer__tab-box">
      <button
        className={
          'pomo-timer__tab-box__tab ' + (activeMode === 'pomo' && 'active')
        }
        onClick={handleClick}
        data-tab="pomo"
      >
        Pomodoro
      </button>{' '}
      <button
        className={
          'pomo-timer__tab-box__tab ' + (activeMode === 'short' && 'active')
        }
        onClick={handleClick}
        data-tab="short"
      >
        Short Break
      </button>{' '}
      <button
        className={
          'pomo-timer__tab-box__tab ' + (activeMode === 'long' && 'active')
        }
        onClick={handleClick}
        data-tab="long"
      >
        Long Break
      </button>
    </div>
  )
}
