export const loadFromLocalStorage = (key, fallback) => {
  try {
    const storedData = localStorage.getItem(key)
    if (storedData !== null) return JSON.parse(storedData)
  } catch (error) {
    console.error(`Error al cargar ${key} desde localStorage: `, error)
  }
  return fallback
}

export const saveInLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage: `, error)
  }
}
