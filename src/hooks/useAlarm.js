import { useContext, useRef, useCallback, useEffect } from 'react'
import { SettingsContext } from '../context'

export const useAlarm = () => {
  const { settings } = useContext(SettingsContext)
  const { isActive, track, volume } = settings.notification.sound

  const currentAudioInstanceRef = useRef(null)
  const userInteractedRef = useRef(false)

  // Es necesario que el usuario interactue primero con el app para ejecutar sonidos
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true
    }

    window.addEventListener('wheel', handleUserInteraction, { once: true })
    window.addEventListener('mousedown', handleUserInteraction, { once: true })
    window.addEventListener('keydown', handleUserInteraction, { once: true })
    window.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      window.removeEventListener('wheel', handleUserInteraction)
      window.removeEventListener('mousedown', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const stopAlarm = useCallback(() => {
    if (!currentAudioInstanceRef.current) return

    currentAudioInstanceRef.current.pause()
    currentAudioInstanceRef.current.currentTime = 0
    currentAudioInstanceRef.current = null
  }, [])

  const playAlarm = useCallback(() => {
    if (!userInteractedRef.current || !isActive) return

    if (currentAudioInstanceRef.current) stopAlarm()

    try {
      const audio = new Audio(`/audio/${track}.mp3`)
      audio.volume = volume / 100
      audio.play()
      currentAudioInstanceRef.current = audio
    } catch (error) {
      console.error(error)
    }
  }, [track, volume, isActive, stopAlarm])

  return { playAlarm, stopAlarm }
}
