import './InputRange.scss'

export function InputRange({
  props,
  name,
  range = '0-100',
  value,
  unit,
  children,
  onChange = (e) => console.log(e.value)
}) {
  const [min, max] = range.split('-').map(Number)

  return (
    <div className="input-box">
      <label className="input-box__label" htmlFor={name}>
        {children}
      </label>
      <input
        className="input-box__range"
        type="range"
        name={name}
        onChange={onChange}
        {...props}
        min={min}
        max={max}
        value={value}
      />
      <div className="range-box">
        <small className="min-value">
          {min} {unit}
        </small>
        <small className="current-value">
          {value} {unit}
        </small>
        <small className="max-value">
          {max} {unit}
        </small>
      </div>
    </div>
  )
}
