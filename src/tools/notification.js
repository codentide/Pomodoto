export function notify(currentMode) {
  if (Notification.permission === 'granted') {
    new Notification('Tiempo terminado', {
      body: `Finalizó tu sesión ${currentMode}`,
      icon: '/favicon.png'
    })
  }
}

export function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}
