import { useState, createContext } from 'react'

export const PomodoroContext = createContext()
export const PomodoroProvider = ({ children }) => {
  // Modo activo (pomo, short, long)
  const [activeMode, setActiveMode] = useState('pomo')

  // Configuraciones
  const [pomoSettings, setPomoSettings] = useState({
    sessionValues: {
      pomo: 1500,
      short: 10,
      long: 900
    },
    autoStartBreak: false,
    autoStartPomodoro: false,
    longBreakInterval: 4,
    notification: {
      isActive: true,
      sound: {
        track: 'default',
        volume: 100,
        isActive: false
      }
    },
    ticking: {
      track: 'default',
      volume: 100,
      isActive: false
    }
  })

  // Funciones para actualizar configuraciones
  const updatePomo = (value) => {
    setPomoSettings({
      ...pomoSettings,
      sessionValues: { ...pomoSettings.sessionValues, pomo: value }
    })
  }

  const updateShort = (value) => {
    setPomoSettings({
      ...pomoSettings,
      sessionValues: { ...pomoSettings.sessionValues, short: value }
    })
  }

  const updateLong = (value) => {
    setPomoSettings({
      ...pomoSettings,
      sessionValues: {
        ...pomoSettings.sessionValues,
        long: value
      }
    })
  }

  // Funciones para actualizar el modo activo
  const updateActiveMode = (value) => {
    setActiveMode(value)
  }

  return (
    <PomodoroContext.Provider
      value={{
        activeMode,
        pomoSettings,
        updatePomo,
        updateShort,
        updateLong,
        updateActiveMode
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}
