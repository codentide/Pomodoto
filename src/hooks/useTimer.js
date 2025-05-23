import { useContext, useEffect, useRef, useCallback } from 'react'
import { SettingsContext, PomodoroContext } from '../context'
import { notify } from '../tools/notification'
import { useAlarm } from './useAlarm'

export const useTimer = () => {
  const {
    currentMode,
    updateCurrentMode,
    isRunning,
    updateIsRunning,
    timeLeft,
    updateTimeLeft,
    userInterrupted,
    endedPomodoros,
    completePomodoro,
    resetPomodoroCount
  } = useContext(PomodoroContext)

  const { settings } = useContext(SettingsContext)
  const { sessionValues, notification, longBreakInterval, autoStartBreak, autoStartPomodoro } = settings
  const { pomo, short, long } = sessionValues
  const { playAlarm } = useAlarm()

  // Referencias
  const lastCompletedMode = useRef(null)
  const isTimerEndingRef = useRef(false)
  const timerWorkerRef = useRef(null)

  // Worker
  function sendWorkerMessage(type) {
    if (timerWorkerRef.current) timerWorkerRef.current.postMessage({ type })
  }

  const determineNextMode = useCallback(() => {
    let nextMode = null

    if (lastCompletedMode.current === 'pomo') {
      const nextCount = endedPomodoros + 1
      completePomodoro()
      nextMode = nextCount % longBreakInterval === 0 ? 'long' : 'short'
    } else {
      nextMode = 'pomo'
    }

    if (lastCompletedMode.current === 'long') {
      resetPomodoroCount()
    }

    // Controlando desfase por cambio de sesión del usuario
    // [ ]: Cuando esta 2 of 2 y termina el longBreak añade 1 apenas inicia el pomodoro (suma erróneamente 1 pomodoro)
    // if (endedPomodoros + 1 > longBreakInterval) {
    //   resetPomodoroCount()
    //   completePomodoro()
    // }

    return nextMode
  }, [endedPomodoros, longBreakInterval, completePomodoro, resetPomodoroCount])

  // Inicia el timer
  const startTimer = () => {
    updateIsRunning(true)
  }

  // Pausa el timer
  const pauseTimer = () => {
    updateIsRunning(false, true)
  }

  // Detiene el timer y reinicia el tiempo restante al valor de la sesión actual
  const stopTimer = () => {
    updateIsRunning(false, true)
    sendWorkerMessage('reset')
  }

  // Finaliza el timer y cambia el modo actual
  const handleSessionEnd = () => {
    if (!isTimerEndingRef.current) return

    updateIsRunning(false)

    isTimerEndingRef.current = true
    lastCompletedMode.current = currentMode
    notify(currentMode, notification)
    playAlarm()

    setTimeout(() => {
      updateCurrentMode(determineNextMode())
      isTimerEndingRef.current = false
    }, 1000)
  }

  // Efectos
  useEffect(() => {
    // Worker no soportado por el navegador
    if (!window.Worker) {
      console.warn('Su navegador no soporta Web Workers. El temporizador puede no ser preciso.')
      return
    }

    // Si el worker existe no se vuelve a crear
    if (timerWorkerRef.current) return

    try {
      timerWorkerRef.current = new Worker(new URL('../timeWorker.js', import.meta.url))
      timerWorkerRef.current.onmessage = ({ data }) => {
        const { type, payload } = data
        if (type === 'timeUpdate') {
          const elapsedTime = payload
          const currentModeTimeMs = sessionValues[currentMode] * 1000
          const remainingTimeMs = Math.max(0, currentModeTimeMs - elapsedTime)
          updateTimeLeft(Math.ceil(remainingTimeMs / 1000))
        } else if (type === 'sessionEnd') {
          isTimerEndingRef.current = true
        }
      }

      timerWorkerRef.current.onerror = (error) => {
        console.error('Error en el Web Worker:', error)
      }

      // Cuando un cambio se desata en currenMode, o en session values
      // mientras isrunning es true este se queda en true y no permite
      // reanudar hasta que se pause manualmente este es el fix
      pauseTimer()
    } catch (error) {
      console.error('useTimer: No se pudo crear el Web Worker:', error)
    }

    return () => {
      if (timerWorkerRef.current) {
        timerWorkerRef.current.terminate()
        timerWorkerRef.current = null
      }
    }
  }, [currentMode, pomo, short, long])

  useEffect(() => {
    if (isRunning && timeLeft <= 0 && isTimerEndingRef.current) {
      handleSessionEnd()
    }
  }, [timeLeft])

  useEffect(() => {
    const currentDuration = sessionValues[currentMode]
    timerWorkerRef.current?.postMessage({ type: 'setDuration', payload: currentDuration })
    sendWorkerMessage('reset')

    if (!userInterrupted && lastCompletedMode.current !== null) {
      const shouldAutoStart = currentMode === 'pomo' ? autoStartPomodoro : autoStartBreak
      updateIsRunning(shouldAutoStart)
    }
  }, [currentMode])

  useEffect(() => {
    sendWorkerMessage(isRunning ? 'start' : 'pause')
  }, [isRunning])

  return {
    startTimer,
    pauseTimer,
    stopTimer
  }
}
