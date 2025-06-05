import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const DialogContext = createContext(null)
export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Accept',
    cancelText: 'Cancel',
    onCancel: () => {},
    onConfirm: () => {}
  })

  useEffect(() => {
    // console.log(dialogState.isOpen)
  }, [dialogState.isOpen])

  function showDialog(options) {
    setDialogState((prev) => {
      return { ...prev, ...options, isOpen: true }
    })
  }

  function closeDialog() {
    setDialogState((prev) => {
      return { ...prev, isOpen: false }
    })
  }

  return <DialogContext.Provider value={{ showDialog, closeDialog, dialogState }}>{children}</DialogContext.Provider>
}
