import { useContext, useEffect, useRef } from 'react'
import { PomodoroContext } from '../context'
import { Range, Switch, Select } from '../components'
import { minutesToSeconds, secondsToMinutes } from '../tools'
import { alarmTracks, tickingTracks } from '../constants/tracks'
import { useAlarm } from '../hooks/useAlarm'

// [ ]: Si la persona niega el recibir notificaciones el switch de notificaciones se deberá apagar
// [ ]: Si la persona tiene negadas las notificaciones y prender el switch de notificaciones
// [x]: Cuando se cambie un sonido reproducirlo

export function Settings({ className }) {
  const { playAlarm, stopAlarm } = useAlarm()
  const { settings, updateSettings } = useContext(PomodoroContext)
  const { sessionValues, notification } = settings
  const { track, volume } = notification.sound

  const debounceTimeoutRef = useRef(null)

  useEffect(() => {
    playAlarm()

    return () => {
      stopAlarm()
    }
  }, [track])

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      playAlarm(track, volume)
    }, 100)

    return () => {
      stopAlarm()
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [volume])

  const onInputChange = (value, name, type) => {
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
      <form>
        <fieldset>
          <legend>Pomodoro</legend>
          <Range
            name="sessionValues.pomo"
            label="Pomodoro duration"
            range="5-60"
            unit="min"
            defaultValue={secondsToMinutes(sessionValues.pomo)}
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
          <legend>Auto Start</legend>
          <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
            <Switch
              name="autoStartPomodoro"
              label="Pomodoro"
              defaultValue={settings.autoStartPomodoro}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            />
            <Switch
              name="autoStartBreak"
              label="Break"
              defaultValue={settings.autoStartBreak}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            />
          </div>
        </fieldset>
        <hr />
        <fieldset>
          <legend>Notifications</legend>
          <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
            <Switch
              name="notification.isActive"
              label="Active"
              defaultValue={settings.notification.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
            <Switch
              name="notification.sound.isActive"
              label="Sound"
              defaultValue={settings.notification.sound.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
          </div>
          <Range
            name="notification.sound.volume"
            label="Volume"
            range="0-100"
            unit="%"
            disabled={!settings.notification.sound.isActive}
            defaultValue={settings.notification.sound.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
          <Select
            label="Track"
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
          <Switch
            name="ticking.isActive"
            label="Active ticking sound"
            defaultValue={settings.ticking.isActive}
            disabled={true}
            onChange={(value, name) => onInputChange(value, name, 'boolean')}
          ></Switch>
          <Range
            name="ticking.volume"
            disabled={!settings.ticking.isActive}
            label="Ticking volume"
            range="0-100"
            unit="%"
            defaultValue={settings.ticking.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
          <Select
            label="Ticking tone"
            name={'ticking.track'}
            items={tickingTracks}
            defaultValue={settings.ticking.track}
            disabled={!settings.ticking.isActive}
            onChange={({ value, name }) => onInputChange(value, name, 'string')}
          ></Select>
        </fieldset>
      </form>
    </section>
  )
}
