import { useContext, useState, useEffect, useRef } from 'react'
import { PomodoroContext } from '../context/pomodoro/pomodoro.context'
import { notify } from '../tools/notification'

export const useTimer = () => {
  const {
    currentMode,
    updateCurrentMode,
    isRunning,
    updateIsRunning,
    updateTimeLeft,
    settings,
    userInterrupted,
    endedPomodoros,
    completePomodoro,
    resetPomodoroCount
  } = useContext(PomodoroContext)

  const {
    sessionValues,
    notification,
    longBreakInterval,
    autoStartBreak,
    autoStartPomodoro
  } = settings

  // Referencias
  const isFirstRender = useRef(true)
  const intervalRef = useRef(null)
  const lastModeRef = useRef(null)
  const hasEndedRef = useRef(false)

  useEffect(() => {
    if (!isRunning) return
    if (intervalRef.current) return
    console.log('Timer started')

    // Iniciar nuevo intervalo
    intervalRef.current = setInterval(() => {
      updateTimeLeft((prev) => {
        if (prev <= 1) {
          end()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      hasEndedRef.current = false
    }
  }, [isRunning])

  /*
   Efecto encargado de: 
   - Reiniciar el conteo del timer
   - Valida si los eventos los desata el usuario o el flujo del app
   - En caso de estar habilitado el autoStart, iniciar el timer
  */
  useEffect(() => {
    if (!isFirstRender.current && !userInterrupted) {
      updateTimeLeft(sessionValues[currentMode])
      updateIsRunning(doesAutoStart(currentMode))
    } else {
      updateIsRunning(false, userInterrupted)
    }

    isFirstRender.current = false
  }, [currentMode, userInterrupted])

  /**
   *
   * @param {'pomo' | 'short' | 'long'} mode - Modo actual
   * @returns {boolean} Determina si el timer inicia automaticamente
   */
  const doesAutoStart = (mode) => {
    return mode === 'pomo' ? autoStartPomodoro : autoStartBreak
  }

  /**
   * Determina el siguiente modo del timer
   */
  const getNextMode = () => {
    let nextMode = null

    if (lastModeRef.current === 'pomo') {
      const nextCount = endedPomodoros + 1
      completePomodoro()

      nextMode = nextCount % longBreakInterval === 0 ? 'long' : 'short'
    } else {
      nextMode = 'pomo'
    }

    if (lastModeRef.current === 'long') resetPomodoroCount()

    return nextMode
  }

  // Inicia el timer
  const start = () => {
    if (!isRunning) updateIsRunning(true)
  }

  // Pausa el timer
  const pause = () => {
    console.log('Timer paused')
    updateIsRunning(false, true)
  }

  /**
   * Detiene el timer y reinicia el tiempo restante al valor de la sesión actual
   */
  const stop = () => {
    console.log('Timer stopped')
    updateIsRunning(false, true)
    updateTimeLeft(sessionValues[currentMode])
  }

  // Finaliza el timer y cambia el modo actual
  const end = () => {
    if (hasEndedRef.current) return
    updateIsRunning(false)
    hasEndedRef.current = true
    lastModeRef.current = currentMode

    notify(currentMode, notification)

    setTimeout(() => {
      updateCurrentMode(getNextMode())
    }, 1000)
  }

  return {
    start,
    pause,
    stop,
    end
  }
}
