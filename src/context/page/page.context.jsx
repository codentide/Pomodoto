import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const PageContext = createContext()

export const PageProvider = ({ children }) => {
  // Estado para manejar el pathing
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Maneja el estado y añade listener de evento pushstate & popstate
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('pushstate', onLocationChange)
    window.addEventListener('popstate', onLocationChange)

    return () => {
      window.removeEventListener('pushstate', onLocationChange)
      window.removeEventListener('popstate', onLocationChange)
    }
  }, [])

  // Cambia el path de la barra de navegacion sin recargar y emite evento "pushstate"
  const navigate = (href) => {
    window.history.pushState({}, '', href)
    const navigationEvent = new Event('pushstate')
    window.dispatchEvent(navigationEvent)
  }

  // Maneja la logica de mostrar y ocultar una page segun el path que se le de
  const displayPage = (path, Component) => {
    const isActive = path === currentPath
    const className = `page ${isActive ? 'page--visible' : 'page--hidden'}`
    return <Component key={path} className={className}></Component>
  }

  return (
    <PageContext.Provider value={{ currentPath, displayPage, navigate }}>
      {children}
    </PageContext.Provider>
  )
}
