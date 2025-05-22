import { useContext } from 'react'
import { useTimer } from '../../hooks/useTimer'
import { PomodoroContext } from '../../context'
import { PomoTabs } from './PomoTabs/PomoTabs'
import { secondsToTime } from '../../tools'
import './PomoTimer.scss'

export const PomoTimer = () => {
  const { timeLeft, settings, endedPomodoros } = useContext(PomodoroContext)
  const { startTimer, pauseTimer, stopTimer } = useTimer()

  // [ ]: Añadir botón para forzar la siguiente sesión (next)
  // [ ]: Colocar iconos (play / pause - stop - next) en los botones

  return (
    <div className="pomo-timer">
      <PomoTabs />
      <p className="pomo-timer__time">{secondsToTime(timeLeft)}</p>
      <div className="pomo-timer__controls">
        <button onClick={startTimer}>start</button>
        <button onClick={pauseTimer}>pause</button>
        <button onClick={stopTimer}>stop</button>
      </div>
      <br />
      <small>
        {endedPomodoros} of {settings.longBreakInterval}
      </small>
    </div>
  )
}
