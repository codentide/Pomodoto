import { useContext } from 'react'
import { PomodoroContext } from '../context'
import { minutesToSeconds, secondsToMinutes } from '../tools'

import { Range, InputRange } from '../components'

export function Settings({ className }) {
  const { settings, updateSettings } = useContext(PomodoroContext)
  const { sessionValues } = settings

  const onSubmit = (event) => {
    event.preventDefault()
  }

  const onInputChange = (name, value, type) => {
    switch (type) {
      case 'minute':
        updateSettings(name, minutesToSeconds(value))
        break
      case 'number':
        updateSettings(name, Number(value))
        break
      default:
        break
    }
  }

  return (
    <section className={`settings ${className}`}>
      <div className="heading">
        <h2>Settings</h2>
      </div>

      <form onSubmit={onSubmit}>
        <Range
          name="sessionValues.pomo"
          label="Pomo duration"
          defaultValue={secondsToMinutes(sessionValues.pomo)}
          range="5-60"
          unit="min"
          onChange={(name, value) => onInputChange(name, value, 'minute')}
        />
        <Range
          name={'sessionValues.long'}
          label="Long duration"
          range="5-45"
          unit="min"
          defaultValue={secondsToMinutes(sessionValues.long)}
          onChange={(name, value) => onInputChange(name, value, 'minute')}
        />
        <Range
          name={'sessionValues.short'}
          label="Short duration"
          range="1-30"
          unit="min"
          defaultValue={secondsToMinutes(sessionValues.short)}
          onChange={(name, value) => onInputChange(name, value, 'minute')}
        />

        <hr />

        <Range
          name={'longBreakInterval'}
          label="Long break interval"
          range="2-10"
          unit="rnd"
          defaultValue={settings.longBreakInterval}
          onChange={(name, value) => onInputChange(name, value, 'number')}
        />

        {/* <button>Submit</button> */}
      </form>
    </section>
  )
}
