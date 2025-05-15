import { useTimer } from '../../hooks/useTimer'
import { secondsToTime } from '../../tools'
import { PomoTabs } from './PomoTabs/PomoTabs'
import './PomoTimer.scss'

export const PomoTimer = () => {
  // Functions that manage the timer
  const { isRunning, timeLeft, start, pause, stop } = useTimer()

  // TODO: Colocar iconos en los botones

  return (
    <div className="pomo-timer">
      {/* Tabs muestra y cambia el tipo de secuencia (pomodoro, short break, long break) */}
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
