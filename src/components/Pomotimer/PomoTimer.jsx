import { useContext } from 'react'
import { PomodoroContext, SettingsContext } from '../../context'
import { secondsToTime } from '../../tools'
import { PomoTabs } from './PomoTabs/PomoTabs'
import { useTimer } from '../../hooks'
import './PomoTimer.scss'

export const PomoTimer = () => {
  const { settings } = useContext(SettingsContext)
  const { timeLeft, endedPomodoros, isRunning } = useContext(PomodoroContext)
  const { startTimer, pauseTimer, stopTimer } = useTimer()

  // [ ]: Añadir botón para forzar la siguiente sesión (next)
  // [ ]: Colocar iconos (play / pause - reset - next) en los botones

  return (
    <div className="pomo-timer">
      <PomoTabs />
      <p className="pomo-timer__time">{secondsToTime(timeLeft)}</p>
      <div className="pomo-timer__controls">
        <button className="pomo-timer__reset-btn" onClick={stopTimer}>
          reset
        </button>
        {isRunning ? <button onClick={pauseTimer}>pause</button> : <button onClick={startTimer}>start</button>}
        <button onClick={stopTimer}>next</button>
      </div>
      <br />
      <small>
        {endedPomodoros} of {settings.longBreakInterval}
      </small>
    </div>
  )
}
