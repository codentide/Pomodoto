import { useContext, useRef, useCallback, useEffect } from 'react'
import { SettingsContext } from '../context'

export const useAlarm = () => {
  const { settings } = useContext(SettingsContext)
  const { isActive, track, volume } = settings.notification.sound

  const currentAudioInstanceRef = useRef(null)
  const userInteractedRef = useRef(false)

  // Es necesario que el usuario interactue primero con la app para ejecutar sonidos
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true

      // Reproducir un sonido silencioso para "engañar" al navegador y habilitar audio
      const audioPath = `/audio/${track}.mp3`
      const silentAudio = new Audio(audioPath)
      silentAudio.volume = 0

      silentAudio.play().catch((error) => {
        // Captura errores si la reproducción silenciosa es bloqueada
        console.warn('La reproducción del sonido silencioso fue bloqueada:', error.name, '-', error.message)
      })
    }

    // Escucha eventos de interacción del usuario una sola vez
    window.addEventListener('wheel', handleUserInteraction, { once: true })
    window.addEventListener('mousedown', handleUserInteraction, { once: true })
    window.addEventListener('keydown', handleUserInteraction, { once: true })
    window.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      // Los listeners con { once: true } se eliminan solos.
    }
  }, [track])

  const stopAlarm = useCallback(() => {
    if (!currentAudioInstanceRef.current) return

    currentAudioInstanceRef.current.pause()
    currentAudioInstanceRef.current.currentTime = 0
    currentAudioInstanceRef.current = null
  }, [])

  const playAlarm = useCallback(
    (manualAudio, manualVolumen) => {
      // No reproducir si el usuario no ha interactuado o el sonido no está activo en configuración
      if (!userInteractedRef.current || !isActive) return

      // Detener alarma actual si ya hay una sonando
      if (currentAudioInstanceRef.current) {
        stopAlarm()
      }

      const audioSrc = manualAudio || `/audio/${track}.mp3`
      const audioVol = (manualVolumen || volume) / 100

      try {
        const audio = new Audio(audioSrc)
        audio.volume = audioVol

        audio
          .play()
          .then(() => {
            currentAudioInstanceRef.current = audio
          })
          .catch((error) => {
            // Captura errores de reproducción (ej. por políticas del navegador como throttling)
            console.error('Fallo al intentar reproducir la alarma:', error.name, ':', error.message)
          })
      } catch (error) {
        // Captura errores al crear la instancia de Audio
        console.error('Error al crear la instancia de Audio:', error.message)
      }
    },
    [track, volume, isActive, stopAlarm]
  )

  return { playAlarm, stopAlarm }
}
