import { useContext, useEffect } from 'react'
import { PageContext } from '../../context'

export function Link({ target, to, className, ...props }) {
  const { currentPath, navigate } = useContext(PageContext)


  const handleClick = (event) => {
    // Capturar si es un click primario
    const isMainEvent = event.button === 0
    // Capturar si es una variacion del evento
    const isModifiedEvent =
      event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
    const isManageableEvent = target === undefined || target == '_self'

    if (isMainEvent && isManageableEvent && !isModifiedEvent) {
      event.preventDefault()
      navigate(to)
    }
  }


  return <a className={`${className} ${currentPath === to && "active"}`} onClick={handleClick} href={to} target={target} {...props}></a>
}
