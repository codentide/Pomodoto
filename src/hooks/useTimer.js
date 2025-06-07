import { useContext, useEffect, useRef, useCallback } from 'react'
import { SettingsContext, PomodoroContext } from '../context'
import { endSessionNotify, getNotificationPermission } from '../tools/notification'
import { useAlarm } from './useAlarm'
import { isDev, secondsToTime } from '../tools'

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

  // [x]: Arreglar el recalculo de pomodoros, cuando se salta el long (el cual resetea el conteo)

  // Calcula el siguiente modo
  const determineNextMode = useCallback(() => {
    if (lastCompletedMode.current === 'pomo') {
      const nexCount = endedPomodoros + 1
      return nexCount % longBreakInterval === 0 ? 'long' : 'short'
    } else return 'pomo'
  }, [endedPomodoros, longBreakInterval])

  // Inicia el timer
  const startTimer = () => {
    updateIsRunning(true)
    playAlarm('sound-on', 100)
  }

  // Pausa el timer
  const pauseTimer = () => {
    updateIsRunning(false, true)
    playAlarm('sound-off', 100)
  }

  // Detiene el timer y reinicia el tiempo restante al valor de la sesión actual
  const stopTimer = () => {
    updateIsRunning(false, true)
    sendWorkerMessage('reset')
  }

  // Forzar siguiente sesión
  const nextSession = () => {
    playAlarm()
    isSessionEndingRef.current = true
    updateIsRunning(false)
  }

  const serviceWorkeNotification = () => {
    const permission = getNotificationPermission()

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      if (permission === 'granted') {
        navigator.serviceWorker.controller.postMessage({
          type: 'END_SESSION_NOTIFICATION',
          payload: {
            mode: currentMode,
            title: 'Session Ended'
          }
        })
        console.log(
          '[USE-TIMER] Flag de notificación enviada al SW. Hora:',
          new Date().toLocaleTimeString()
        )
      }
    }
  }

  // Finaliza el timer y cambia el modo actual
  const handleSessionEnd = useCallback(() => {
    // Notificación
    serviceWorkeNotification()

    // Guardar ultimo modo completado
    lastCompletedMode.current = currentMode
    isSessionEndingRef.current = false

    // Conteo de pomodoros
    if (currentMode === 'pomo') {
      // Nextcount existe debido a la latencia de actualizar estados
      const nextCount = endedPomodoros + 1
      if (nextCount > longBreakInterval) resetPomodoroCount()
      completePomodoro()
    } else if (currentMode === 'long') resetPomodoroCount()

    setTimeout(() => {
      const nextMode = determineNextMode()
      updateCurrentMode(nextMode)
    }, 800)
  }, [currentMode, notification, endedPomodoros, completePomodoro, determineNextMode, playAlarm])

  // Efecto del worker
  useEffect(() => {
    // Worker no soportado por el navegador
    if (!window.Worker) {
      console.error('[USE-TIMER] Su navegador no soporta Web Workers.')
      return
    }

    // Si el worker existe no se vuelve a crear
    if (timerWorkerRef.current) return

    try {
      timerWorkerRef.current = new Worker(new URL('/time-worker.js', import.meta.url))
      timerWorkerRef.current.postMessage({ type: 'setDuration', payload: sessionValues[currentMode] })
      timerWorkerRef.current.onmessage = ({ data }) => {
        const { type, payload } = data
        if (type === 'timeUpdate') {
          const elapsedTime = payload
          const currentModeTimeMs = sessionValues[currentMode] * 1000
          const remainingTimeMs = Math.max(0, currentModeTimeMs - elapsedTime)
          updateTimeLeft(Math.ceil(remainingTimeMs / 1000))
        } else if (type === 'sessionEnd') {
          nextSession()
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
    if (!userInterrupted && lastCompletedMode.current !== null) {
      const shouldAutoStart = currentMode === 'pomo' ? autoStartPomodoro : autoStartBreak
      updateIsRunning(shouldAutoStart)
    }
  }, [currentMode])

  useEffect(() => {
    if (isSessionEndingRef.current && !isRunning) {
      console.log('[USE-TIMER] End session request received')
      handleSessionEnd()
    }
    sendWorkerMessage(isRunning ? 'start' : 'pause')
  }, [isRunning, handleSessionEnd, notification])

  // Este efecto puede vivir en otro lado quizá
  // Cambiar el titulo con el conteo
  useEffect(() => {
    const mode = currentMode === 'pomo' ? 'Focus' : 'Break'
    document.title = isRunning ? `${secondsToTime(timeLeft)} - ${mode}` : 'Pomodoto'
  }, [timeLeft, isRunning])

  return {
    startTimer,
    pauseTimer,
    stopTimer,
    nextSession
  }
}
