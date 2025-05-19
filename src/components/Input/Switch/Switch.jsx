import { Switch as AriaSwitch } from 'react-aria-components'
import './Switch.scss'

export function Switch({ name, label, onChange, defaultValue = false }) {
  function handleChange(value) {
    onChange(value, name)
  }

  return (
    <div className="switch-box">
      <span className="switch__label">{label}</span>
      <AriaSwitch
        name={name}
        className="switch"
        isSelected={defaultValue}
        onChange={handleChange}
      >
        {({ isSelected }) => (
          <span className="switch__thumb" data-selected={String(isSelected)} />
        )}
      </AriaSwitch>
    </div>
  )
}
