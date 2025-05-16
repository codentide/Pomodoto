import { useContext, useState, useEffect, useRef } from 'react'
import { PomodoroContext } from '../context/pomodoro/pomodoro.context'
import { notify } from '../tools/notification'

// [x]: Implementar la secuencia de tipos (pomo -> short -> pomo -> long -> pomo)
// [x]: Implementar autoStartBreak (hacer que el break inicie automaticamente luego de un pomo)
// [x]: Implementar autoStartPomodoro (hacer que el pomo inicie automaticamente)
// [ ]: Definir mejor las responsabilidades de los componentes (contexto vs hook)

export const useTimer = () => {
  // Estado global y configuraciones
  const {
    currentMode,
    isRunning,
    updateCurrentMode,
    updateTimeLeft,
    updateIsRunning,
    settings,
    userInterrupted,
    updateUserInterrupted
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
  const endedPomosRef = useRef(0)
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
    console.log('USER-INTERRUPTED', userInterrupted)

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
    if (currentMode === 'pomo') {
      endedPomosRef.current += 1
      return endedPomosRef.current % longBreakInterval === 0 ? 'long' : 'short'
    }
    return 'pomo'
  }

  /**
   * Inicia el timer
   */
  const start = () => {
    if (!isRunning) updateIsRunning(true)
  }

  // Pausa el timer (Manual)
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

    console.log('Timer ended')
    hasEndedRef.current = true

    updateIsRunning(false)
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
