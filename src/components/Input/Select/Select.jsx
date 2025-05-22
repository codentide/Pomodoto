import { Select as AriaSelect, Label, Button, Popover, SelectValue, ListBox, ListBoxItem } from 'react-aria-components'
import './Select.scss'
import { useState, useRef, useEffect } from 'react'

export function Select({
  name,
  label = 'Choose an option',
  placeholder = 'Choose an option',
  items = [],
  disabled,
  defaultValue,
  onChange = (value) => console.log(value)
}) {
  // HACK: Porque el componente bloquea el scroll del body, buscarle solucion

  // Estado para gestionar la apertura del elemento
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    // Cerrar el popover cuando se scrollee
    const onScroll = () => setIsOpen(false)
    // Añadir evento de scroll al contenedor del select
    const container = buttonRef.current?.closest('section.page')
    container?.addEventListener('scroll', onScroll, { passive: true })

    return () => container.removeEventListener('scroll', onScroll)
  }, [isOpen])

  function handleChange(value) {
    onChange({ value, name })
  }

  return (
    <AriaSelect
      className="select"
      name={name}
      placeholder={placeholder}
      defaultSelectedKey={defaultValue}
      isDisabled={disabled}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onSelectionChange={handleChange}
    >
      <Label className="select__label">{label}</Label>
      <Button className="select__button" ref={buttonRef}>
        <SelectValue className="select__value" />
        <span aria-hidden="true">
          <svg role="presentation" viewBox="0 0 64 64">
            <path
              d="M32 48.453 23.547 40l-3.762 3.762L32 56l12.238-12.238L40.453 40M32 15.547 40.453 24l3.762-3.762L32 8 19.762 20.238 23.547 24Zm0 0"
              fill="ghostwhite"
            />
          </svg>
        </span>
      </Button>
      <Popover className="select__popover" placement="bottom" offset={8}>
        <ListBox className="listbox">
          {items.map(({ label, value }) => (
            <ListBoxItem className="listbox__item" key={value} id={value}>
              {label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}
