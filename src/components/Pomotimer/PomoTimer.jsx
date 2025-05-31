import { useContext, useEffect } from 'react'
import { PomodoroContext, SettingsContext } from '../../context'
import { PomoTabs } from './PomoTabs/PomoTabs'
import { SegmentBar } from '../SegmentBar/SegmentBar'
import { secondsToTime } from '../../tools'
import { useTimer } from '../../hooks'
import './PomoTimer.scss'

import PlayIcon from '../../assets/svg/play.svg?react'
import PauseIcon from '../../assets/svg/pause.svg?react'
import NextIcon from '../../assets/svg/next.svg?react'
import StopIcon from '../../assets/svg/stop.svg?react'

export const PomoTimer = () => {
  const { settings } = useContext(SettingsContext)
  const { timeLeft, endedPomodoros, isRunning, resetPomodoroCount } = useContext(PomodoroContext)
  const { startTimer, pauseTimer, stopTimer, nextSession } = useTimer()

  // [x]: Añadir función para forzar la siguiente sesión (next)
  // [x]: Crear eventos con teclas para manejar el start/pause - stop - nextSession
  // [ ]: Mostrar shortcuts (space, arrowLeft, arrowRight)
  // [ ]: Estilizar botón de reset pomodoro count

  // Eventos con teclado
  useEffect(() => {
    const handleKeyPressed = (event) => {
      const key = event.code.toLowerCase()
      switch (key) {
        case 'space':
          event.preventDefault()
          if (!isRunning) startTimer()
          else pauseTimer()
          break
        case 'arrowright':
          if (isRunning) nextSession()
          break
        case 'arrowleft':
          stopTimer()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPressed)

    return () => {
      window.removeEventListener('keydown', handleKeyPressed)
    }
  }, [isRunning])

  return (
    <div className="pomo-timer">
      <PomoTabs />
      <p className="pomo-timer__time">{secondsToTime(timeLeft)}</p>
      <div className="pomo-timer__controls">
        <button className="pomo-timer__reset-btn" onClick={stopTimer} title="Press [←] to reset ">
          <StopIcon />
        </button>
        <button onClick={isRunning ? pauseTimer : startTimer} title="Press [space] to pause">
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button disabled={!isRunning} onClick={nextSession} title="Press [→] to next session">
          <NextIcon />
        </button>
      </div>
      <br />
      <SegmentBar value={endedPomodoros} limit={settings.longBreakInterval} />
      <br />
      <button onClick={resetPomodoroCount}>Reset Pomodoro Count</button>
    </div>
  )
}
