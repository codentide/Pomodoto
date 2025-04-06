import { useContext, useState, useEffect, useRef } from 'react'
import { PomodoroContext } from '../context/pomodoro/pomodoro.context'
import { notify } from '../tools/notification'

// [ ]: Implementar la secuencia de tipos (pomo -> short -> pomo -> long -> pomo)
// NOTA: usar longBreakInterval para controlar el intervalo de los long breaks

// [ ]: Implementar autoStartBreak (hacer que el break inicie automaticamente luego de un pomo)
// [ ]: Implementar autoStartPomodoro (hacer que el pomo inicie automaticamente)

export const useTimer = () => {
  // Configuraciones y modo actual
  const { activeMode, pomoSettings } = useContext(PomodoroContext)
  // Valores de cada sesion
  const { sessionValues, notification } = pomoSettings
  // Tiempo restante segun modo activo
  const [timeLeft, setTimeLeft] = useState(sessionValues[activeMode])
  // Flag para controlar el estado del timer
  const [isRunning, setIsRunning] = useState(false)
  // Referencia al intervalo del timer
  const intervalRef = useRef(null)

  // Efecto del intervalo del timer
  useEffect(() => {
    // Si la flag isRunning es false, no se ejecuta el intervalo
    if (!isRunning) return

    // Iniciar nuevo intervalo
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // Stop timer when it reaches 0
        if (prev <= 1) {
          end()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup on unmount or when isRunning changes
    return () => {
      console.log('Cleaning up interval')
      clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // Reset timer when mode changes
  useEffect(() => {
    console.log('Mode changed to', activeMode)
    setTimeLeft(sessionValues[activeMode])
    setIsRunning(false)
  }, [activeMode])

  // Timer control functions
  const start = () => {
    console.log('Timer started')
    setIsRunning(true)
  }

  const pause = () => {
    console.log('Timer paused')
    setIsRunning(false)
  }

  const stop = () => {
    console.log('Timer stopped')
    setIsRunning(false)
    setTimeLeft(sessionValues[activeMode])
  }

  const end = () => {
    console.log('Timer ended')
    setIsRunning(false)

    setTimeLeft(sessionValues[activeMode])
    notify(activeMode, notification)
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
