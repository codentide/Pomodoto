import { useContext } from 'react'
import { DialogContext, PomodoroContext } from '../../../context'
import './PomoTabs.scss'

export const PomoTabs = () => {
  const { currentMode, updateCurrentMode, isRunning, updateIsRunning } = useContext(PomodoroContext)
  const { showDialog } = useContext(DialogContext)

  const handleClick = (event) => {
    const button = event.target
    const mode = button.getAttribute('data-tab')

    // [x]: Crear modal para manejar esto de mejor manera
    if (!isRunning) {
      updateCurrentMode(mode, true)
    } else {
      // Pausar mientras sale el aviso
      updateIsRunning(false)
      showDialog({
        title: 'Alert',
        message: 'Si cambias de sesión ahora, se perderá el progreso de la sesión actual, estas seguro?',
        confirmText: 'Cambiar',
        cancelText: 'Cancelar',
        // Si acepta cambia de sesión
        onConfirm: () => updateCurrentMode(mode, true),
        // Si declina cae el modal y reanuda el conteo
        onCancel: () => updateIsRunning(true)
      })
    }
  }

  return (
    <div className="tab-box">
      <button className={`tab-box__button ${currentMode === 'pomo' && 'active'}`} onClick={handleClick} data-tab="pomo">
        Pomodoro
      </button>
      <button
        className={`tab-box__button ${currentMode === 'short' && 'active'}`}
        onClick={handleClick}
        data-tab="short"
      >
        Short Break
      </button>
      <button className={`tab-box__button ${currentMode === 'long' && 'active'}`} onClick={handleClick} data-tab="long">
        Long Break
      </button>
    </div>
  )
}
