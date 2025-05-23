import { Switch as AriaSwitch } from 'react-aria-components'
import './Switch.scss'

export function Switch({ name, label, onChange, value = false, disabled = false }) {
  function handleChange(value) {
    onChange(value, name)
  }

  return (
    <div className="switch-box" disabled={disabled}>
      <span className="switch-box__label">{label}</span>
      <AriaSwitch name={name} className="switch" isSelected={value} isDisabled={disabled} onChange={handleChange}>
        {({ isSelected }) => <span className="switch__thumb" data-selected={String(isSelected)} />}
      </AriaSwitch>
    </div>
  )
}
