export function navigate(href) {
  window.history.pushState({}, '', href)
  const navigationEvent = new Event('pushstate')
  window.dispatchEvent(navigationEvent)
}

export function Link({ target, to, ...props }) {
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

  return <a onClick={handleClick} href={to} target={target} {...props}></a>
}
