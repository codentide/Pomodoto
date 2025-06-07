import { useContext } from "react"
import "./ShortcutTable.scss"
import { SettingsContext } from "../../context"

const shortcuts = [
  { title: "start / pause", keyName: "SPACE" },
  { title: "next session", keyName: "→" },
  { title: "reset timer", keyName: "←" },
  { title: "reset pomodoro count", keyName: "R" },
  { title: "select pomodoro", keyName: "P" },
  { title: "select short", keyName: "S" },
  { title: "select long", keyName: "L" }
]

export const ShortcutTable = () => {
  const { settings } = useContext(SettingsContext)

  if (!settings.showShortcuts) return

  return (
    <div className="shortcut-table">
      <ul>
        {
          shortcuts.map(({title, keyName}, index ) => 
            <Shortcut key={index} title={title} keyName={keyName}/>
          )
        }
      </ul>
    </div>
  )
}

const Shortcut = ({title = "action", keyName = "key"}) => {
  return (
    <div className="shortcut-item">
      <p>{title}</p> 
      <kbd>{keyName}</kbd>
    </div>
  )
}