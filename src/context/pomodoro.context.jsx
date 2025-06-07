import { useState, createContext, useEffect } from 'react' // useEffect va con los hooks de React
import { getISODateString, loadFromLocalStorage, saveInLocalStorage } from '../tools'
import { useContext } from 'react'
import { DialogContext } from './dialog.context'
import { useCallback } from 'react'

// [x]: Ended Pomodoros tambien se guardará en local storage
// [x]: Guardar pomodoros totales para generar estadísticas (x día)

// Mediano plazo
// [ ]: Estudiar métricas interesantes para el objeto stats
// [x]: Si el usuario interrumpió el pomodoro, crear otro item "interrupted Pomodoros"

export const PomodoroContext = createContext(null)
export const PomodoroProvider = ({ children }) => {
  const { showDialog } = useContext(DialogContext)

  const POMO_COUNT_KEY = 'pomodoroCount'
  const SESSION_HISTORY_KEY = 'dailyStats'

  // Estados
  const [currentMode, setCurrentMode] = useState('pomo')
  const [timeLeft, setTimeLeft] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [userInterrupted, setUserInterrupted] = useState(false)
  const [endedPomodoros, setEndedPomodoros] = useState(loadFromLocalStorage(POMO_COUNT_KEY, 0))
  const [dailyStats, setDailyStats] = useState(loadFromLocalStorage(SESSION_HISTORY_KEY, []))

  // Efectos (Side Effects)
  useEffect(() => {
    saveInLocalStorage(POMO_COUNT_KEY, endedPomodoros)
  }, [endedPomodoros])

  useEffect(() => {
    saveInLocalStorage(SESSION_HISTORY_KEY, dailyStats)
  }, [dailyStats])

  // Funciones para actualizar estados
  const updateCurrentMode = (value, isManually = false) => {
    setUserInterrupted(isManually)

    // Si el cambio es manual y el temporizador esta corriendo
    if (isManually && isRunning) {
      // Si current mode es igual al value no hace nada
      if (currentMode === value) return

      // Pausamos
      setIsRunning(false)

      // Mostramos dialogo
      showDialog({
        title: 'Alert',
        message: 'Si cambias de sesión ahora, se perderá el progreso de la sesión actual, estas seguro?',
        confirmText: 'Cambiar',
        cancelText: 'Cancelar',
        // Si acepta cambia de sesión
        onConfirm: () => setCurrentMode(value, true),
        // Si declina cae el modal y reanuda el conteo
        onCancel: () => setIsRunning(true)
      })
    } else {
      setCurrentMode(value)
    }
    console.log({ currentMode, value })
  }

  const updateTimeLeft = (value) => {
    setTimeLeft(value)
  }

  const updateIsRunning = (value, isManually = false) => {
    setIsRunning(value)
    setUserInterrupted(isManually) // Marca si el cambio de estado de ejecución fue manual
  }

  const updateUserInterrupted = (value) => {
    setUserInterrupted(value)
  }

  // Session History
  const addHistoryPomodoro = () => {
    const today = getISODateString(new Date())

    setDailyStats((prev) => {
      const isEntryIndex = prev.findIndex((entry) => entry.date === today)

      if (isEntryIndex > -1) {
        const updatedStats = [...prev]
        updatedStats[isEntryIndex] = {
          ...updatedStats[isEntryIndex],
          completedPomodoros: updatedStats[isEntryIndex].completedPomodoros + 1
        }
        return updatedStats
      }
      return [
        ...prev,
        {
          date: today,
          completedPomodoros: 1
        }
      ]
    })
  }

  // Funciones específicas de la lógica del Pomodoro
  const updateEndedPomodoros = (value) => {
    setEndedPomodoros(value)
  }

  const completePomodoro = () => {
    setEndedPomodoros((prev) => prev + 1)

    addHistoryPomodoro()
  }

  const resetPomodoroCount = () => {
    setEndedPomodoros(0)
  }

  // Renderizado del Proveedor
  return (
    <PomodoroContext.Provider
      value={{
        // Estados
        currentMode,
        timeLeft,
        isRunning,
        userInterrupted,
        endedPomodoros,
        // Funciones para actualizar estados
        updateCurrentMode,
        updateTimeLeft,
        updateIsRunning,
        updateUserInterrupted,
        updateEndedPomodoros,
        // Funciones específicas de la lógica
        completePomodoro,
        resetPomodoroCount
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}
