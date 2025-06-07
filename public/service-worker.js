// public/workers/service-worker.js
// Este script se ejecutará en un hilo separado del navegador.
// Lo primero que hay que entender es que este archivo no se ejecuta dentro de tu React,
// sino que el navegador lo carga y lo mantiene vivo por aparte.

// ----------------------------------------------------
// Ingrediente 1: Un nombre para la caché (como la etiqueta de un tupper)
const CACHE_NAME = 'pomodoro-v1' // Puedes cambiar la versión si actualizas la caché
// Esto es para cuando quieras que tu app funcione offline. Por ahora, es como una caja vacía.

// ----------------------------------------------------
// Ingrediente 2: El evento 'install' (Cuando el cocinero llega a la cocina por primera vez)
// Se dispara cuando el Service Worker se instala por primera vez en el navegador del usuario.
// Aquí se suele "preparar" lo básico, como guardar archivos esenciales en caché.
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker instalado. Hora:', new Date().toLocaleTimeString())
  // 'event.waitUntil()' le dice al navegador: "¡Espera! No termines de instalarme hasta que esto esté listo."
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // 'caches.open()' es para abrir o crear una "caja de caché" con el nombre que le dimos.
        // Aquí podrías guardar archivos importantes para que la app funcione sin internet.
        // Por ahora, solo es una promesa que se resuelve de una.
        return Promise.resolve() // Resolviendo la promesa inmediatamente si no hay nada que cachear por ahora.
      })
      .catch((error) => {
        // Por si algo sale mal al intentar abrir la caché.
        console.error('[SW] Error en la instalación del Service Worker:', error)
      })
  )
  // 'self.skipWaiting();' (opcional): Haría que el SW se active de inmediato, sin esperar.
  // Es útil en desarrollo para ver los cambios sin recargar dos veces.
})

// ----------------------------------------------------
// Ingrediente 3: El evento 'activate' (Cuando el cocinero se pone el delantal y empieza a trabajar)
// Se dispara cuando el Service Worker se activa, es decir, cuando ya está listo para controlar las páginas.
// Aquí se suele "limpiar" lo viejo, como cachés de versiones anteriores.
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activado. Hora:', new Date().toLocaleTimeString())
  // 'clients.claim()' es clave aquí. Hace que el SW tome control de todas las pestañas
  // abiertas de tu aplicación, incluso las que ya estaban cargadas antes de que el SW se activara.
  // Sin esto, tendrías que recargar la página para que el SW la controlara.
  event.waitUntil(clients.claim())
})

// ----------------------------------------------------
// Ingrediente 4: El evento 'message' (El teléfono de la cocina que recibe pedidos)
// Este es el evento más importante para tu caso. Se dispara cuando tu aplicación de React
// (desde `useTimer.js`) le envía un mensaje al Service Worker.
self.addEventListener('message', (event) => {
  // 'event.data' contiene lo que tu aplicación le envió al SW.
  console.log('[SW] Mensaje recibido del cliente:', event.data, '. Hora:', new Date().toLocaleTimeString())

  // Verificamos si el mensaje es el que esperamos para una notificación de fin de sesión.
  if (event.data && event.data.type === 'END_SESSION_NOTIFICATION') {
    // Extraemos la información que enviamos desde `useTimer.js`.
    const { mode, title } = event.data.payload
    let body = '' // El cuerpo de la notificación

    // Dependiendo del 'mode' (pomo, short, long), cambiamos el cuerpo de la notificación.
    switch (mode) {
      case 'pomo':
        body = 'Time for a Break'
        break
      case 'short':
        body = 'Back to Focus'
        break
      case 'long':
        body = 'Long break over'
        break
    }

    // Opciones para la notificación (cómo se va a ver y comportar)
    const options = {
      body: body,
      icon: '/favicon.png', // La ruta a un icono que se mostrará en la notificación
      tag: 'pomodoro-session-end', // Una etiqueta para agrupar notificaciones. Si llega una nueva con el mismo tag, actualiza la anterior en vez de crear una nueva.
      renotify: true, // Si hay una notificación con el mismo tag, la actualiza y vuelve a sonar/vibrar.
      silent: false // Intentar que suene el sonido por defecto del sistema operativo.
      // 'badge': '/path/to/badge.png' // Opcional: para el icono pequeño en Android
    }

    // ¡Aquí es donde la magia de la notificación ocurre, mor!
    // 'self.registration.showNotification()' es la forma estándar de mostrar una notificación
    // desde un Service Worker. Esto es lo que permite que funcione en segundo plano.
    self.registration
      .showNotification(title, options)
      .then(() => {
        // Si la notificación se muestra correctamente.
        console.log(`[SW] Notificación "${title}" mostrada con éxito. Hora:`, new Date().toLocaleTimeString())
      })
      .catch((error) => {
        // Si hay algún problema al mostrar la notificación (ej. permisos).
        console.error('[SW] Error al mostrar la notificación:', error, '. Hora:', new Date().toLocaleTimeString())
      })
  }
})

// ----------------------------------------------------
// Ingrediente 5: El evento 'notificationclick' (Cuando el cliente toca la notificación)
// Se dispara cuando el usuario hace clic en la notificación que tu Service Worker envió.
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificación clickeada. Hora:', new Date().toLocaleTimeString())
  event.notification.close() // Siempre cerramos la notificación después de que se hace clic.

  // 'event.waitUntil()' espera a que esta lógica se complete antes de que el navegador termine de manejar el clic.
  event.waitUntil(
    // 'clients.matchAll()' busca todas las ventanas (pestañas) de tu aplicación abiertas.
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        // Si ya hay una pestaña abierta, la enfoca (la trae al frente).
        return clientList[0].focus()
      } else {
        // Si no hay ninguna pestaña abierta, abre una nueva con la URL de tu app.
        return clients.openWindow('/') // Abre la raíz de tu aplicación
      }
    })
  )
})

// ----------------------------------------------------
// Ingrediente 6: El evento 'notificationclose' (Cuando la notificación se quita sin click)
// Se dispara cuando el usuario cierra la notificación sin hacer clic en ella.
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notificación cerrada. Hora:', new Date().toLocaleTimeString())
})
