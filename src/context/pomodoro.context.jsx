import { useState, createContext } from 'react'

export const PomodoroContext = createContext(null)

export const PomodoroProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('pomo')
  const [timeLeft, setTimeLeft] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [userInterrupted, setUserInterrupted] = useState(false)
  const [endedPomodoros, setEndedPomodoros] = useState(0)

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
