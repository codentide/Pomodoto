export function notify(title, body, tag) {
  if (Notification.permission !== 'granted') return

  new Notification(title, {
    icon: '/favicon.png',
    body: body || '',
    tag: tag || '',
    renotify: true,
    silent: false
  })
}

export function endSessionNotify(mode) {
  let title

  switch (mode) {
    case 'pomo':
      title = 'Time for a Break'
      break
    case 'short':
      title = 'Back to Focus'
      break
    case 'long':
      title = 'Long break over'
      break
  }

  notify(title, '', 'timer-session-end')
}

export function requestNotificationPermission() {
  if (Notification.permission !== 'granted') Notification.requestPermission()
}

export function getNotificationPermission() {
  return Notification.permission
}
