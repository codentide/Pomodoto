import { useContext } from 'react'
import { useTimer } from '../../hooks/useTimer'
import { PomodoroContext } from '../../context'
import { PomoTabs } from './PomoTabs/PomoTabs'
import { secondsToTime } from '../../tools'
import './PomoTimer.scss'

export const PomoTimer = () => {
  const { timeLeft } = useContext(PomodoroContext)
  const { start, pause, stop } = useTimer()

  // [ ]: Añadir botón para forzar la siguiente sesión (next)
  // [ ]: Colocar iconos (play / pause - stop - next) en los botones

  return (
    <div className="pomo-timer">
      <PomoTabs />
      <p className="pomo-timer__time">{secondsToTime(timeLeft)}</p>
      <div className="pomo-timer__controls">
        <button onClick={start}>start</button>
        <button onClick={pause}>pause</button>
        <button onClick={stop}>stop</button>
      </div>
    </div>
  )
}
