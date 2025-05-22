import { useEffect } from 'react'
import { useState, createContext } from 'react'

export const PomodoroContext = createContext(null)

export const PomodoroProvider = ({ children }) => {
  // [ ]: Crear un contexto exclusivo para configuraciones
  // [ ]: Guardar por defecto, cambios en las configuraciones en localStorage
  const [settings, setSettings] = useState({
    sessionValues: {
      pomo: 4,
      long: 3,
      short: 2
    },
    autoStartBreak: true,
    autoStartPomodoro: true,
    longBreakInterval: 2,
    notification: {
      isActive: true,
      sound: {
        isActive: true,
        track: 'soft-bell',
        volume: 50
      }
    },
    ticking: {
      isActive: false,
      track: 'tick',
      volume: 75
    }
  })

  const [currentMode, setCurrentMode] = useState('pomo')
  const [timeLeft, setTimeLeft] = useState(settings.sessionValues[currentMode])
  const [isRunning, setIsRunning] = useState(false)
  const [userInterrupted, setUserInterrupted] = useState(false)
  const [endedPomodoros, setEndedPomodoros] = useState(0)

  //

  function updateSettings(path, value) {
    setSettings((prev) => {
      // Clonamos settings
      const newSettings = structuredClone(prev)
      // sessionValues.pomo = [sessionValues, pomo]
      const keys = path.split('.')
      // Pasamos el clon de settings a current
      let current = newSettings
      // Si hay mas de una key
      while (keys.length > 1) {
        // Traemos el primer elemento del array keys
        const key = keys.shift()
        // Sacamos ese valor del current y lo guardamos en current
        current = current[key]
      }
      current[keys[0]] = value
      return newSettings
    })
  }

  /**
   * Actualiza el modo actual del temporizador.
   * @param {'pomo' | 'short' | 'long'} value - Nuevo modo.
   * @param {boolean} [isManually=false] - Indica si fue un cambio manual.
   */
  const updateCurrentMode = (value, isManually = false) => {
    setCurrentMode(value)
    setUserInterrupted(isManually)
  }

  const updateTimeLeft = (value) => {
    setTimeLeft(value)
  }

  const updateIsRunning = (value, isManually = false) => {
    setIsRunning(value)
    setUserInterrupted(isManually)
  }

  const updateUserInterrupted = (value) => {
    setUserInterrupted(value)
  }

  const updateEndedPomodoros = (value) => {
    setEndedPomodoros(value)
  }

  const completePomodoro = () => {
    setEndedPomodoros((prev) => prev + 1)
  }

  const resetPomodoroCount = () => {
    setEndedPomodoros(0)
  }

  return (
    <PomodoroContext.Provider
      value={{
        settings,
        updateSettings,
        currentMode,
        updateCurrentMode,
        timeLeft,
        updateTimeLeft,
        isRunning,
        updateIsRunning,
        userInterrupted,
        updateUserInterrupted,
        endedPomodoros,
        updateEndedPomodoros,
        completePomodoro,
        resetPomodoroCount
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}
