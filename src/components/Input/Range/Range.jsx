import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack
} from 'react-aria-components'
import './Range.scss'

export function Range({
  name,
  label = 'Label',
  defaultValue = false,
  range = '0-100',
  step = 1,
  unit = '',
  onChange,
  disabled = false
}) {
  function handleChange(value) {
    onChange(value, name)
  }

  const [min, max] = range.split('-').map(Number)
  defaultValue = !defaultValue ? (defaultValue = min + max / 2) : defaultValue

  return (
    <Slider
      name={name}
      defaultValue={defaultValue}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={handleChange}
      className="range"
      isDisabled={disabled}
    >
      <div className="range__header">
        <Label className="range__label">{label}</Label>
      </div>
      <SliderTrack className="range__track-wrapper">
        {({ state }) => (
          <>
            <div className="range__track-bg" />
            <div
              className="range__track-fill"
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <SliderThumb className="range__thumb" />
          </>
        )}
      </SliderTrack>
      <div className="range__range-box">
        <small className="min-value">
          {min} {unit}
        </small>
        <small className="current-value">
          <SliderOutput className="range__output" /> {unit}
        </small>
        <small className="max-value">
          {max} {unit}
        </small>
      </div>
    </Slider>
  )
}
