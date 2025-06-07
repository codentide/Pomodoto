import { useContext, useEffect, useRef } from 'react'
import { DialogContext, PomodoroContext, SettingsContext } from '../../context'
import { Range, Switch, Select, Dialog } from '../../components'
import { minutesToSeconds, secondsToMinutes } from '../../tools'
import { alarmTracks, tickingTracks } from '../../constants/tracks'
import { useAlarm } from '../../hooks/useAlarm'

import './settings.page.scss'

export function Settings({ className }) {
  const { playAlarm, stopAlarm } = useAlarm()
  const { endedPomodoros, resetPomodoroCount } = useContext(PomodoroContext)
  const { settings, updateSettings, resetSettings } = useContext(SettingsContext)
  const { showDialog } = useContext(DialogContext)
  const { sessionValues, notification, longBreakInterval } = settings
  const { track, volume } = notification.sound

  const debounceTimeoutRef = useRef(null)

  // Efectos para manejar el sonido

  useEffect(() => {
    playAlarm(track, 100)
    return () => stopAlarm()
  }, [track])

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      playAlarm()
    }, 100)

    return () => {
      stopAlarm()
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
    }
  }, [volume])

  // Efecto para manejar el longBreakInterval
  useEffect(() => {
    if (longBreakInterval < endedPomodoros) {
      // Guardo el valor con el que entró para reasignarlo cuando salga del modal
      const temporalEndedPomodoros = endedPomodoros

      showDialog({
        title: 'Alert',
        message:
          'El valor de los pomodoros terminados (' +
          endedPomodoros +
          ') es mayor a Long Break Interval (' +
          longBreakInterval +
          '), desea resetearlo?',
        confirmText: 'Yes',
        cancelText: 'No',
        onCancel: () => updateSettings('longBreakInterval', Number(temporalEndedPomodoros)),
        onConfirm: () => resetPomodoroCount()
      })
    }
  }, [longBreakInterval, endedPomodoros])

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

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <section className={`settings ${className}`}>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Pomodoro</legend>
          <Range
            name="sessionValues.pomo"
            label="Pomodoro duration"
            range="5-60"
            unit="min"
            value={secondsToMinutes(sessionValues.pomo)}
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="sessionValues.long"
            label="Long duration"
            range="5-45"
            unit="min"
            value={secondsToMinutes(sessionValues.long)}
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="sessionValues.short"
            label="Short duration"
            range="1-30"
            unit="min"
            value={secondsToMinutes(sessionValues.short)}
            onChange={(value, name) => onInputChange(value, name, 'minute')}
          />
          <Range
            name="longBreakInterval"
            label="Long break interval"
            range={`2-10`}
            unit="rnd"
            value={settings.longBreakInterval}
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
              value={settings.autoStartPomodoro}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            />
            <Switch
              name="autoStartBreak"
              label="Break"
              value={settings.autoStartBreak}
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
              value={settings.notification.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
            <Switch
              name="notification.sound.isActive"
              label="Sound"
              value={settings.notification.sound.isActive}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
          </div>
          <Range
            name="notification.sound.volume"
            label="Volume"
            range="0-100"
            unit="%"
            disabled={!settings.notification.sound.isActive}
            value={settings.notification.sound.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
          <Select
            label="Track"
            name={'notification.sound.track'}
            items={alarmTracks}
            value={settings.notification.sound.track}
            disabled={!settings.notification.sound.isActive}
            onChange={({ value, name }) => onInputChange(value, name, 'string')}
          ></Select>
        </fieldset>

        <hr />
          <fieldset>
            <legend>Shortcuts</legend>
            <Switch
              label="Show Shortcuts"
              name="showShortcuts"
              value={settings.showShortcuts}
              onChange={(value, name) => onInputChange(value, name, 'boolean')}
            ></Switch>
          </fieldset>

        {/* <fieldset>
          <legend>Ticking</legend>
          <Switch
            name="ticking.isActive"
            label="Active ticking sound"
            value={settings.ticking.isActive}
            disabled={true}
            onChange={(value, name) => onInputChange(value, name, 'boolean')}
          ></Switch>
          <Range
            name="ticking.volume"
            disabled={!settings.ticking.isActive}
            label="Ticking volume"
            range="0-100"
            unit="%"
            value={settings.ticking.volume}
            onChange={(value, name) => onInputChange(value, name, 'number')}
          />
          <Select
            label="Ticking tone"
            name={'ticking.track'}
            items={tickingTracks}
            value={settings.ticking.track}
            disabled={!settings.ticking.isActive}
            onChange={({ value, name }) => onInputChange(value, name, 'string')}
          ></Select>
        </fieldset> */}
        <button className="reset-btn" onClick={resetSettings} title="Reset to default pomodoro values">
          <svg viewBox="0 0 24 24">
            <path d="M1.611,12c.759,0,1.375,.57,1.485,1.32,.641,4.339,4.389,7.68,8.903,7.68,5.476,0,9.827-4.917,8.867-10.569-.453-2.665-2.148-5.023-4.523-6.313-3.506-1.903-7.48-1.253-10.18,1.045l1.13,1.13c.63,.63,.184,1.707-.707,1.707H2c-.552,0-1-.448-1-1V2.414c0-.891,1.077-1.337,1.707-.707l1.332,1.332C7.6-.115,12.921-1.068,17.637,1.408c3.32,1.743,5.664,5.027,6.223,8.735,1.122,7.437-4.633,13.857-11.86,13.857-6.021,0-11.021-4.457-11.872-10.246-.135-.92,.553-1.754,1.483-1.754Z" />
          </svg>
        </button>
      </form>
    </section>
  )
}
