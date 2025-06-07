export function notify(title, body, tag) {
  // Log de qué permisos tenemos antes de intentar notificar
  console.log(
    '[Notify] INFO: Intentando enviar notificación. Permiso actual:',
    Notification.permission,
    '. Hora:',
    new Date().toLocaleTimeString()
  )

  if (Notification.permission !== 'granted') {
    console.warn(
      '[Notify] WARN: Notificación NO enviada. Permisos no otorgados. Hora:',
      new Date().toLocaleTimeString()
    )
    return
  }

  // Si los permisos están granted, intentamos crear y mostrar la notificación
  try {
    new Notification(title, {
      icon: '/favicon.png',
      body: body || '',
      tag: tag || '',
      renotify: true,
      silent: false
    })
    console.log(
      `[Notify] INFO: Notificación "${title}" enviada con éxito. Tag: "${tag}". Hora:`,
      new Date().toLocaleTimeString()
    )
  } catch (error) {
    // Captura cualquier error que ocurra al crear la notificación
    console.error(
      '[Notify] ERROR: Fallo al crear la notificación:',
      error.message,
      '. Hora:',
      new Date().toLocaleTimeString()
    )
  }
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
    default:
      title = 'Pomodoro Session Ended' // Un título por defecto si el modo no es reconocido
      console.warn(
        '[endSessionNotify] WARN: Modo de sesión desconocido:',
        mode,
        '. Usando título por defecto. Hora:',
        new Date().toLocaleTimeString()
      )
  }

  // Log de qué notificación específica se va a enviar
  console.log(
    `[endSessionNotify] INFO: Preparando notificación de fin de sesión para el modo: "${mode}", con título: "${title}". Hora:`,
    new Date().toLocaleTimeString()
  )
  notify(title, '', 'timer-session-end')
}

export function requestNotificationPermission() {
  // Log antes de solicitar el permiso
  console.log(
    '[RequestPermission] INFO: Solicitando permisos de notificación. Permiso actual:',
    Notification.permission,
    '. Hora:',
    new Date().toLocaleTimeString()
  )

  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
      .then((permission) => {
        // Log del resultado de la solicitud
        console.log(
          '[RequestPermission] INFO: Solicitud de permiso de notificación finalizada. Resultado:',
          permission,
          '. Hora:',
          new Date().toLocaleTimeString()
        )
      })
      .catch((error) => {
        // Captura errores en la promesa de requestPermission
        console.error(
          '[RequestPermission] ERROR: Fallo al solicitar permisos de notificación:',
          error.message,
          '. Hora:',
          new Date().toLocaleTimeString()
        )
      })
  } else {
    console.log(
      '[RequestPermission] INFO: Permisos de notificación ya están "granted". No se necesita solicitar. Hora:',
      new Date().toLocaleTimeString()
    )
  }
}

export function getNotificationPermission() {
  // Log al obtener el permiso actual
  console.log(
    '[GetPermission] INFO: Obteniendo permiso actual de notificación. Permiso:',
    Notification.permission,
    '. Hora:',
    new Date().toLocaleTimeString()
  )
  return Notification.permission
}
