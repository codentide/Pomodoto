import { createPortal } from 'react-dom'
import { useContext } from 'react'
import { DialogContext } from '../../context'
import './Dialog.scss'

export const Dialog = () => {
  const { dialogState, closeDialog } = useContext(DialogContext)
  const { isOpen, title, message, confirmText, cancelText, onConfirm, onCancel } = dialogState

  function acceptHandle() {
    // console.log('aceptado')
    onConfirm()
    closeDialog()
  }

  function cancelHandle() {
    // console.log('cancelado')
    onCancel()
    closeDialog()
  }

  const modalRoot = document.getElementById('dialog-root')
  return createPortal(
    <div className={`overlay ${isOpen ? 'opened' : 'closed'}`}>
      <div className="dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div>
          <button onClick={cancelHandle}>{cancelText}</button>
          <button onClick={acceptHandle}>{confirmText}</button>
        </div>
      </div>
    </div>,
    modalRoot
  )
}

/**
 
          showDialog({
            title: 'Alert',
            message: 'El valor de los pomodoros es mayor a Long Break Invertal, desea resetearlo?',
            confirmText: 'Yes',
            cancelText: 'No',
            onCancel: () => updateSettings('longBreakInterval', Number(temporalEndedPomodoros)),
            onConfirm: () => resetPomodoroCount()
          })
 */
