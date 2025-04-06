export function notify(activeMode, { isActive, sound }) {
  if (Notification.permission === 'granted' && isActive) {
    new Notification('Tiempo terminado', {
      body: `Finalizó tu sesión ${activeMode}`,
      icon: '/logo.png' // opcional: ícono personalizado
    })
  }
}

export function requestPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}
