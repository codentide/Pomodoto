import { useContext, useState, useEffect, useRef } from 'react'
import { PomodoroContext } from '../context/pomodoro/pomodoro.context'
import { notify } from '../tools/notification'

// [x]: Implementar la secuencia de tipos (pomo -> short -> pomo -> long -> pomo)
// [x]: Implementar autoStartBreak (hacer que el break inicie automaticamente luego de un pomo)
// [x]: Implementar autoStartPomodoro (hacer que el pomo inicie automaticamente)
// [ ]: Definir mejor las responsabilidades de los componentes (contexto vs hook)

export const useTimer = () => {
  // Estado global y configuraciones
  const { currentMode, updateCurrentMode, settings } = useContext(PomodoroContext)
  const { mode, wasActivatedManually } = currentMode
  const {
    sessionValues,
    notification,
    longBreakInterval,
    autoStartBreak,
    autoStartPomodoro
  } = settings

  // Tiempo restante segun modo activo
  const [timeLeft, setTimeLeft] = useState(sessionValues[mode])
  // Flag para controlar el estado del timer
  const [isRunning, setIsRunning] = useState(false)

  // Referencias

  /** Almacena el id del intervalo del timer */
  const intervalRef = useRef(null)
  /** Almacena la cantidad de pomodoros terminados */
  const endedPomosRef = useRef(0)
  /** Es una flag para controlar end() */
  const hasEndedRef = useRef(false)
  /** Es una flag que controla el primer render */
  const isFirstRender = useRef(true)

  /**
   * Efecto encargado de:
   * Iniciar el intervalo del timer
   * En caso de que el timer termine limpiar el intervalo y ejecutar @function end()
   *
   * @param {boolean} isRunning - Determina cuando iniciar el timer
   */
  useEffect(() => {
    if (!isRunning) return
    console.log('Timer started')

    // Iniciar nuevo intervalo
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          end()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup on unmount or when isRunning changes
    return () => {
      clearInterval(intervalRef.current)
      hasEndedRef.current = false
    }
  }, [isRunning, settings])

  /**
   * Efecto encargado de:
   * Reiniciar el conteo del timer
   * En caso de estar habilitado el autoStart, iniciar el timer
   *
   * Cambiar el estado del timer
   * @param {string} mode - Reacciona a los cambios de modo
   */
  useEffect(() => {
    console.log('Mode changed to:', mode)
    setTimeLeft(sessionValues[mode])

    if (!isFirstRender.current && !wasActivatedManually) {
      setIsRunning(doesAutoStart(mode))
    }

    isFirstRender.current = false
  }, [mode, settings])

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
    if (mode === 'pomo') {
      endedPomosRef.current += 1
      return endedPomosRef.current % longBreakInterval === 0 ? 'long' : 'short'
    }
    return 'pomo'
  }

  /**
   * Inicia el timer
   */
  const start = () => {
    setIsRunning(true)
  }

  /**
   * Pausa el timer
   */
  const pause = () => {
    console.log('Timer paused')
    setIsRunning(false)
  }

  /**
   * Detiene el timer y reinicia el tiempo restante al valor de la sesión actual
   */
  const stop = () => {
    console.log('Timer stopped')
    setIsRunning(false)
    setTimeLeft(sessionValues[mode])
  }

  /**
   * Finaliza el timer y cambia el modo actual
   */
  const end = () => {
    if (hasEndedRef.current) return

    console.log('Timer ended')
    hasEndedRef.current = true

    setIsRunning(false)
    notify(mode, notification)

    setTimeout(() => {
      updateCurrentMode(getNextMode())
    }, 1000)
  }

  return {
    isRunning,
    timeLeft,
    start,
    pause,
    stop,
    end
  }
}
