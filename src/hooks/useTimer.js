import { useContext, useEffect, useRef, useCallback } from 'react'
import { SettingsContext, PomodoroContext } from '../context'
import { endSessionNotify, notify } from '../tools/notification'
import { useAlarm } from './useAlarm'
import { secondsToTime } from '../tools'

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
  const timerWorkerRef = useRef(null)
  const isSessionEndingRef = useRef(false)

  // Worker
  function sendWorkerMessage(type) {
    if (timerWorkerRef.current) timerWorkerRef.current.postMessage({ type })
  }

  // Calcula el siguiente modo
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
  const handleSessionEnd = useCallback(() => {
    lastCompletedMode.current = currentMode

    endSessionNotify(currentMode)
    playAlarm()

    setTimeout(() => {
      isSessionEndingRef.current = false
      updateCurrentMode(determineNextMode())
    }, 1000)
  }, [currentMode, notification, determineNextMode, playAlarm])

  // Efecto del worker
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
      timerWorkerRef.current.postMessage({ type: 'setDuration', payload: sessionValues[currentMode] })
      timerWorkerRef.current.onmessage = ({ data }) => {
        const { type, payload } = data
        if (type === 'timeUpdate') {
          const elapsedTime = payload
          const currentModeTimeMs = sessionValues[currentMode] * 1000
          const remainingTimeMs = Math.max(0, currentModeTimeMs - elapsedTime)
          updateTimeLeft(Math.ceil(remainingTimeMs / 1000))
        } else if (type === 'sessionEnd') {
          isSessionEndingRef.current = true
          updateIsRunning(false)
        }
      }

      timerWorkerRef.current.onerror = (error) => {
        console.error('Error en el Web Worker:', error)
      }

      if (isRunning) pauseTimer()
    } catch (error) {
      console.error('useTimer: No se pudo crear el TimeWorker:', error)
    }

    return () => {
      if (timerWorkerRef.current) {
        timerWorkerRef.current.terminate()
        timerWorkerRef.current = null
      }
    }
  }, [currentMode, pomo, short, long])

  useEffect(() => {
    // const currentDuration = sessionValues[currentMode]
    // timerWorkerRef.current.postMessage({ type: 'setDuration', payload: currentDuration })
    // sendWorkerMessage('reset')

    if (!userInterrupted && lastCompletedMode.current !== null) {
      const shouldAutoStart = currentMode === 'pomo' ? autoStartPomodoro : autoStartBreak
      updateIsRunning(shouldAutoStart)
    }
  }, [currentMode])

  useEffect(() => {
    if (isSessionEndingRef.current && !isRunning) {
      console.log('[END-SESSION-HELPER] End of session request received')
      handleSessionEnd()
    }
    sendWorkerMessage(isRunning ? 'start' : 'pause')
  }, [isRunning, handleSessionEnd, notification])

  // Cambiar el titulo con el conteo
  useEffect(() => {
    const mode = currentMode === 'pomo' ? 'Focus' : 'Break'
    document.title = isRunning ? `${secondsToTime(timeLeft)} - ${mode}` : 'Pomodoto'

    console.log(timeLeft)
  }, [timeLeft, isRunning])

  return {
    startTimer,
    pauseTimer,
    stopTimer
  }
}
