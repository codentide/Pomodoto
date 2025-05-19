import { useContext } from 'react'
import { PomodoroContext } from '../context'
import { Range, Switch, Select } from '../components'
import { minutesToSeconds, secondsToMinutes } from '../tools'

const alarmTracks = [
  { value: 'retro-game', label: 'Retro Game' }
  // { value: 'digital-beep', label: 'Digital Beep' },
  // { value: 'soft-bell', label: 'Soft Bell' },
  // { value: 'zen-gong', label: 'Zen Gong' }
]

const tickingTracks = [
  { value: 'tick', label: 'Tick' },
  { value: 'bell', label: 'Campana' },
  { value: 'soft-ding', label: 'Ding suave' }
]

export function Settings({ className }) {
  const { settings, updateSettings, updateIsRunning } =
    useContext(PomodoroContext)
  const { sessionValues } = settings

  const onInputChange = (value, name, type) => {
    updateIsRunning(false, true)

    switch (type) {
      case 'minute':
        updateSettings(name, minutesToSeconds(value))
        break
      case 'number':
        updateSettings(name, Number(value))
        break
      case 'boolean':
        updateSettings(name, Boolean(value))
        break
      case 'string':
        updateSettings(name, String(value))
        break
    }
  }

  return (
    <section className={`settings ${className}`}>
      <div className="heading">
        <h2>Settings</h2>
      </div>
      <form>
        <fieldset>
          <legend>Temporizador</legend>

          <Range
            name="sessionValues.pomo"
            label="Pomo duration"
            defaultValue={secondsToMinutes(sessionValues.pomo)}
            range="5-60"
            unit="min"
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="sessionValues.long"
            label="Long duration"
            range="5-45"
            unit="min"
            defaultValue={secondsToMinutes(sessionValues.long)}
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="sessionValues.short"
            label="Short duration"
            range="1-30"
            unit="min"
            defaultValue={secondsToMinutes(sessionValues.short)}
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="longBreakInterval"
            label="Long break interval"
            range="2-10"
            unit="rnd"
            defaultValue={settings.longBreakInterval}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
        </fieldset>

        <hr />

        <fieldset>
          <legend>Comportamiento Automatico</legend>
          <Switch
            name="autoStartBreak"
            label="Auto start breaks"
            defaultValue={settings.autoStartBreak}
            onChange={(value, name) => onInputChange(value, name, 'boolean')}
          />
          <Switch
            name="autoStartPomodoro"
            label="Auto start pomodoros"
            defaultValue={settings.autoStartPomodoro}
            onChange={(value, name) => onInputChange(value, name, 'boolean')}
          />
        </fieldset>

        <hr />

        <fieldset>
          <legend>Notificaciones</legend>

          <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
            <Switch
              name="notification.isActive"
              label="Active notifications"
              defaultValue={settings.notification.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
            <Switch
              name="notification.sound.isActive"
              label="Notification sound"
              defaultValue={settings.notification.sound.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
          </div>
          <Range
            name="notification.sound.volume"
            label="Alarm volume"
            range="0-100"
            unit="%"
            disabled={!settings.notification.sound.isActive}
            defaultValue={settings.notification.sound.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
          {/* <select
            disabled={!settings.notification.sound.isActive}
            name="notification.sound.track"
            value={settings.notification.sound.track}
            onChange={(e) =>
              onInputChange(
                e.target.value,
                'notification.sound.track',
                'string'
              )
            }
          >
            <option value="retro-game">Retro Game</option>
            <option value="bell">Campana</option>
            <option value="soft-ding">Ding suave</option>
          </select> */}

          <Select
            label="Alarm tone"
            name={'notification.sound.track'}
            items={alarmTracks}
            defaultValue={settings.notification.sound.track}
            disabled={!settings.notification.sound.isActive}
            onChange={({ value, name }) => onInputChange(value, name, 'string')}
          ></Select>
        </fieldset>

        <hr />

        <fieldset>
          <legend>Ticking</legend>
          <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
            <Switch
              name="ticking.isActive"
              label="Active ticking sound"
              defaultValue={settings.ticking.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
          </div>
          <Select
            label="Ticking tone"
            name={'ticking.track'}
            items={tickingTracks}
            defaultValue={settings.ticking.track}
            disabled={!settings.ticking.isActive}
            onChange={({ value, name }) => onInputChange(value, name, 'string')}
          ></Select>
          <Range
            name="ticking.volume"
            disabled={!settings.ticking.isActive}
            label="Ticking volume"
            range="0-100"
            unit="%"
            defaultValue={settings.ticking.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
        </fieldset>
      </form>
    </section>
  )
}
