// timerWorker.js

let timerIntervalId = null
let startTime = 0
let elapsedTime = 0
let isRunning = false
// Experimental
let sessionDurationMs = null

function sendTimeUpdate() {
  postMessage({
    type: 'timeUpdate',
    payload: elapsedTime
  })
}

// Experimental
function sendSessionEnd() {
  postMessage({
    type: 'sessionEnd'
  })
}

function startTimer() {
  if (isRunning) {
    return
  }

  isRunning = true
  startTime = Date.now() - elapsedTime

  timerIntervalId = setInterval(() => {
    elapsedTime = Date.now() - startTime
    sendTimeUpdate()

    // Experimental
    if (sessionDurationMs !== null && elapsedTime >= sessionDurationMs) {
      pauseTimer()
      sendSessionEnd()
    }
  }, 100)
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
      console.warn('[WORKER] Tipo de mensaje desconocido:', type)
  }
}

// Se envía el tiempo inicial al cargar el worker para que el hook tenga un valor por defecto.
sendTimeUpdate()
console.log('[WORKER] Iniciado y esperando mensajes.')
