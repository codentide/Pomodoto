import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const PageContext = createContext()

export const PageProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

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

  const displayPage = (path, Component) => {
    const isActive = path === currentPath
    const className = `page ${isActive ? 'page--visible' : 'page--hidden'}`
    return <Component key={path} className={className}></Component>
  }

  return (
    <PageContext.Provider value={{ currentPath, displayPage }}>
      {children}
    </PageContext.Provider>
  )
}
