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
        <button
          className="pomo-timer__controls__button"
          onClick={isRunning ? pause : start}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="pomo-timer__controls__button" onClick={stop}>
          Stop
        </button>
      </div>
    </div>
  )
}
