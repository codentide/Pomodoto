import { useEffect } from 'react'
import { useState, createContext } from 'react'

export const SettingsContext = createContext(null)
export const SettingsProvider = ({ children, isTesting = false }) => {
  const LOCAL_STORAGE_KEY = 'settings'

  const DEFAULT_SESSION_VALUES = isTesting
    ? {
        pomo: 12,
        long: 8,
        short: 4
      }
    : {
        pomo: 25 * 60,
        long: 15 * 60,
        short: 5 * 60
      }

  const DEFAULT_SETTINGS = {
    sessionValues: DEFAULT_SESSION_VALUES,
    autoStartBreak: true,
    autoStartPomodoro: true,
    longBreakInterval: 4,
    notification: {
      isActive: true,
      sound: {
        isActive: true,
        track: 'default-tone',
        volume: 50
      }
    },
    ticking: {
      isActive: false,
      track: 'tick',
      volume: 75
    }
  }

  const loadSettings = () => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedSettings) return JSON.parse(storedSettings)
    } catch (error) {
      console.error('Error al cargar settings desde localStorage: ', error)
    }

    // Fallback
    console.log('Entregando fallback de settings')
    return DEFAULT_SETTINGS
  }

  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error al guardar settings en localStorage', error)
    }
  }, [settings])

  function updateSettings(path, value) {
    setSettings((prev) => {
      const newSettings = structuredClone(prev)
      const keys = path.split('.')
      let current = newSettings

      while (keys.length > 1) {
        const key = keys.shift()
        current = current[key]
      }
      current[keys[0]] = value
      return newSettings
    })
  }

  function resetSettings() {
    setSettings((prev) => ({
      ...prev,
      sessionValues: DEFAULT_SESSION_VALUES,
      longBreakInterval: 4
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  )
}
