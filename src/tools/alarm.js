let currentAlarm = null

let userInteracted = false

window.addEventListener(
  'DOMContentLoaded',
  () => {
    setTimeout(() => {
      userInteracted = true
    }, 1000)
  },
  { once: true }
)

const playAlarm = (track, volume = 100) => {
  if (!userInteracted) {
    return
  }

  if (currentAlarm) stopAlarm()

  const alarm = new Audio(`/audio/${track}.mp3`)
  alarm.volume = volume / 100
  alarm.play().catch((e) => console.warn('Error al reproducir audio:', e))
  currentAlarm = alarm
}

const stopAlarm = () => {
  if (currentAlarm) {
    currentAlarm.pause()
    currentAlarm.currentTime = 0
    currentAlarm = null
  }
}
