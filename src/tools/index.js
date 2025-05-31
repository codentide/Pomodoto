export * from './notification'
export * from './timeTools'
export * from './localStorage'

//
export function isDev() {
  return process.env.NODE_ENV === 'development'
}
