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
