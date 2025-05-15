/**
 * Converts total seconds to a formatted time string "MM:SS"
 * @param {number} seconds - Total number of seconds
 * @returns {string} Formatted time string "MM:SS"
 */
export const secondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  // Pad both minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

export const timeToSeconds = (time) => {
  if (!time) return

  const parts = time.split(":").map(Number)

  if (parts.length === 2)  {
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }

  throw new Error('Formato de tiempo no válido. Usa mm:ss o hh:mm:ss')
}


export const secondsToMinutes = (seconds) => {
  return Math.floor(seconds / 60)
}

export const minutesToSeconds = (minutes) => {
  return minutes * 60
}