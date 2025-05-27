import { useEffect } from 'react'
import { useState, createContext } from 'react'
import { loadFromLocalStorage, saveInLocalStorage } from '../tools'
import { DEFAULT_SETTINGS, DEFAULT_SESSION_VALUES, TEST_SESSION_VALUES } from '../constants'

export const SettingsContext = createContext(null)
export const SettingsProvider = ({ children, isTesting = false }) => {
  const STORAGE_SETTINGS_KEY = 'settings'

  const [settings, setSettings] = useState(loadFromLocalStorage(STORAGE_SETTINGS_KEY, DEFAULT_SETTINGS))

  useEffect(() => {
    saveInLocalStorage(STORAGE_SETTINGS_KEY, settings)
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
      sessionValues: !isTesting ? DEFAULT_SESSION_VALUES : TEST_SESSION_VALUES,
      longBreakInterval: 4
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  )
}
