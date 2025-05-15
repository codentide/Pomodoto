export const playAlarm = (track, volume = 100) => {
  // Buscar el archivo en la carpeta publica
  const alarm = new Audio(`/audio/${track}.wav`)
  // Ajustar volumen, quizá no haga falta calcular entre 100
  alarm.volume = volume / 100
  // Reproducir alarma
  alarm.play()
}