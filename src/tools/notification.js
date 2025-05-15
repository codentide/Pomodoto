import { playAlarm } from "./alarm"

export function notify(activeMode, { isActive, sound }) {
  if (Notification.permission === 'granted' && isActive) {
    new Notification('Tiempo terminado', {
      body: `Finalizó tu sesión ${activeMode}`,
      icon: '/favicon.png' // opcional: ícono personalizado
    })

    if (sound.isActive) playAlarm(sound.track, sound.volume)
  }
}

export function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}

