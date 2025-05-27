import { useState, createContext } from 'react'
import { loadFromLocalStorage, saveInLocalStorage } from '../tools'
import { useEffect } from 'react'

// [x]: Ended Pomodoros tambien se guardará en local storage
// [ ]: Guardar pomodoros totales para estadísticas

export const PomodoroContext = createContext(null)

export const PomodoroProvider = ({ children }) => {
  const STORAGE_POMODORO_COUNT_KEY = 'pomodoroCount'

  const [currentMode, setCurrentMode] = useState('pomo')
  const [timeLeft, setTimeLeft] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [userInterrupted, setUserInterrupted] = useState(false)

  // Ended Pomodoros
  const [endedPomodoros, setEndedPomodoros] = useState(loadFromLocalStorage(STORAGE_POMODORO_COUNT_KEY, 0))

  useEffect(() => {
    console.log('asfasfdfssfasf')
    saveInLocalStorage(STORAGE_POMODORO_COUNT_KEY, endedPomodoros)
  }, [endedPomodoros])

  //

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
