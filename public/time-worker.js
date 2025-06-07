// timerWorker.js

let timerIntervalId = null
let startTime = 0
let elapsedTime = 0
let isRunning = false
let sessionDurationMs = null

function sendTimeUpdate() {
  postMessage({
    type: 'timeUpdate',
    payload: elapsedTime
  })
}

function sendSessionEnd() {
  postMessage({
    type: 'sessionEnd'
  })
}

function startTimer() {
  // console.log('[WEB-WORKER] START: Inicio del timer. Hora:', new Date().toLocaleTimeString())

  if (isRunning) {
    // console.warn('[TIME-WORKER] WARN: Intentando iniciar timer, pero ya está corriendo.')
    return
  }

  isRunning = true
  startTime = Date.now() - elapsedTime

  timerIntervalId = setInterval(() => {
    elapsedTime = Date.now() - startTime
    sendTimeUpdate()

    if (sessionDurationMs !== null && elapsedTime >= sessionDurationMs) {
      pauseTimer()
      sendSessionEnd()
      console.log('[TIME-WORKER] INFO: Condición de fin de sesión cumplida. Procediendo a finalizar.')
    }
  }, 1000)

  console.log('[TIME-WORKER] INFO: Timer iniciado con éxito. Hora:', new Date().toLocaleTimeString())
}

function pauseTimer() {
  if (!isRunning) {
    return
  }

  isRunning = false
  clearInterval(timerIntervalId)
  timerIntervalId = null
}

function resetTimer() {
  pauseTimer()
  elapsedTime = 0
  sendTimeUpdate()
}

// Listener para los mensajes que vienen del hilo principal (su hook de React)
onmessage = function ({ data }) {
  const { type, payload } = data

  switch (type) {
    case 'start':
      startTimer()
      break
    case 'pause':
      pauseTimer()
      break
    case 'reset':
      resetTimer()
      break
    case 'setDuration':
      sessionDurationMs = payload * 1000
      console.log('[TIME-WORKER] INFO: Duración de sesión actualizada a:', sessionDurationMs, 'ms.')
      break
    case 'getInitialTime':
      sendTimeUpdate()
      break
    case 'terminate':
      clearInterval(timerIntervalId)
      timerIntervalId = null
      close()
      break
    default:
      console.warn('[TIME-WORKER] Tipo de mensaje desconocido:', type)
  }
}

// Se envía el tiempo inicial al cargar el worker para que el hook tenga un valor por defecto.
sendTimeUpdate()
// console.log('[TIME-WORKER] Successfully Created')
