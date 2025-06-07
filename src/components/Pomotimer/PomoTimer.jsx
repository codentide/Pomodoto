import { useContext, useEffect } from 'react'
import { DialogContext, PomodoroContext, SettingsContext } from '../../context'
import { PomoTabs } from './PomoTabs/PomoTabs'
import { SegmentBar } from '../SegmentBar/SegmentBar'
import { secondsToTime } from '../../tools'
import { useTimer } from '../../hooks'
import './PomoTimer.scss'

import PlaySVG from '../../assets/svg/play.svg?react'
import PauseSVG from '../../assets/svg/pause.svg?react'
import NextSVG from '../../assets/svg/next.svg?react'
import StopSVG from '../../assets/svg/stop.svg?react'
import RefreshSVG from '../../assets/svg/refresh.svg?react'

export const PomoTimer = () => {
  const { settings } = useContext(SettingsContext)
  const { timeLeft, endedPomodoros, isRunning, resetPomodoroCount, currentMode, updateCurrentMode } =
    useContext(PomodoroContext)
  const { startTimer, pauseTimer, stopTimer, nextSession } = useTimer()
  const { showDialog, dialogState } = useContext(DialogContext)

  // [x]: Añadir función para forzar la siguiente sesión (next)
  // [x]: Crear eventos con teclas para manejar el start/pause - stop - nextSession
  // [ ]: Mostrar shortcuts
  // [x]: Estilizar botón de reset pomodoro count

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
        case 'keyr':
          resetPomodoroCount()
          break
        case 'keyp':
          updateCurrentMode('pomo', true)
          break
        case 'keys':
          updateCurrentMode('short', true)
          break
        case 'keyl':
          updateCurrentMode('long', true)
          break
      }
    }

    if (dialogState.isOpen === true) {
      window.removeEventListener('keydown', handleKeyPressed)
    } else {
      window.addEventListener('keydown', handleKeyPressed)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPressed)
    }
  }, [isRunning, dialogState.isOpen])

  return (
    <div className="pomo-timer">
      <PomoTabs />

      <div className="pomo-timer__display">
        <p className="time-left">{secondsToTime(timeLeft)}</p>
        <SegmentBar title="askf" value={endedPomodoros} limit={settings.longBreakInterval} />
      </div>

      <div className="pomo-timer__controls">
        <div className="button-box">
          <button className="pomo-timer__reset-btn" onClick={stopTimer} title="Press [←] to reset ">
            <StopSVG />
          </button>
          <button onClick={isRunning ? pauseTimer : startTimer} title="Press [space] to pause">
            {isRunning ? <PauseSVG /> : <PlaySVG />}
          </button>
          <button disabled={!isRunning} onClick={nextSession} title="Press [→] to next session">
            <NextSVG />
          </button>
        </div>
        <button className="refresh-btn" onClick={resetPomodoroCount}>
          <RefreshSVG />
        </button>
      </div>
    </div>
  )
}
