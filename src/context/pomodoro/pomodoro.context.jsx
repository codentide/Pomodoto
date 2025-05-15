import { useState, createContext } from 'react'

/**
 * Contexto principal para el manejo del temporizador
 * @type {React.Context}
 */

export const PomodoroContext = createContext(null)

/**
 * Proveedor del contexto Pomodoro.
 * Maneja el modo actual del temporizador y las configuraciones generales.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const PomodoroProvider = ({ children }) => {
  /**
   * Estado del modo actual del temporizador.
   * @type {[Object, Function]} - Objeto con el modo actual y si fue activado manualmente.
   * @property {string} mode - Modo actual ('pomo', 'short', 'long').
   * @property {boolean} wasActivatedManually - Indica si el modo fue activado manualmente.
   */
  const [currentMode, setCurrentMode] = useState({
    mode: 'pomo',
    wasActivatedManually: false
  })

  /**
   * Estado de las configuraciones generales del temporizador.
   * @type {[Object, Function]} - Objeto con las configuraciones.
   * @property {Object} sessionValues - Duración de las sesiones.
   * @property {number} sessionValues.pomo - Duración del pomodoro en segundos.
   * @property {number} sessionValues.short - Duración del short break en segundos.
   * @property {number} sessionValues.long - Duración del long break en segundos.
   * @property {boolean} autoStartBreak - Indica si se autocomenzarán los breaks.
   * @property {boolean} autoStartPomodoro - Indica si se autocomenzará los pomodoros.
   * @property {number} longBreakInterval - Intervalo para el long break (cada cuantas sesiones habrá un long break).
   * @property {Object} notification - Configuración de la notificación.
   * @property {boolean} notification.isActive - Indica si la notificación está activa.
   * @property {Object} notification.sound - Configuración del sonido de la notificación.
   * @property {boolean} notification.sound.isActive - Indica si el sonido está activo.
   * @property {string} notification.sound.track - Nombre del sonido.
   * @property {number} notification.sound.volume - Volumen del sonido.
   * @property {Object} ticking - Configuración del sonido de tick.
   * @property {boolean} ticking.isActive - Indica si el sonido de tick está activo.
   * @property {string} ticking.track - Nombre del sonido de tick.
   * @property {number} ticking.volume - Volumen del sonido de tick.
   */
  const [settings, setSettings] = useState({
    sessionValues: {
      pomo: 1500,
      long: 900,
      short: 300
    },
    autoStartBreak: false,
    autoStartPomodoro: false,
    longBreakInterval: 4,
    notification: {
      isActive: true,
      sound: {
        isActive: true,
        track: 'retro-game',
        volume: 100
      }
    },
    ticking: {
      isActive: false,
      track: 'default',
      volume: 100
    }
  })

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
      //
      current[keys[0]] = value
      return newSettings
    })
  }

  /**
   * Actualiza la duración del pomodoro.
   * @param {number} value - Nueva duración en minutos.
   */
  const updatePomo = (value) => {
    setSettings({
      ...settings,
      sessionValues: { ...settings.sessionValues, pomo: value }
    })
  }

  /**
   * Actualiza la duración del short break.
   * @param {number} value
   */
  const updateShort = (value) => {
    setSettings({
      ...settings,
      sessionValues: { ...settings.sessionValues, short: value }
    })
  }

  /**
   * Actualiza la duración del long break.
   * @param {number} value
   */
  const updateLong = (value) => {
    setSettings({
      ...settings,
      sessionValues: {
        ...settings.sessionValues,
        long: value
      }
    })
  }

  /**
   * Actualiza el modo actual del temporizador.
   * @param {'pomo' | 'short' | 'long'} value - Nuevo modo.
   * @param {boolean} [isManually=false] - Indica si fue un cambio manual.
   * @returns {void}
   */
  const updateCurrentMode = (value, isManually = false) => {
    setCurrentMode({
      mode: value,
      wasActivatedManually: isManually
    })
  }

  return (
    <PomodoroContext.Provider
      value={{
        currentMode,
        settings,
        updatePomo,
        updateShort,
        updateLong,
        updateCurrentMode,
        updateSettings,
        setSettings
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}
