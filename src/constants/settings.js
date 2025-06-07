export const DEFAULT_SESSION_VALUES = {
  pomo: 25 * 60,
  long: 15 * 60,
  short: 5 * 60
}
export const TEST_SESSION_VALUES = {
  pomo: 12,
  long: 8,
  short: 4
}

export const DEFAULT_SETTINGS = {
  sessionValues: DEFAULT_SESSION_VALUES,
  autoStartBreak: true,
  autoStartPomodoro: true,
  longBreakInterval: 4,
  showShortcuts: true,
  notification: {
    isActive: true,
    sound: {
      isActive: true,
      track: 'default-tone',
      volume: 50
    }
  },
  ticking: {
    isActive: false,
    track: 'tick',
    volume: 75
  }
}
