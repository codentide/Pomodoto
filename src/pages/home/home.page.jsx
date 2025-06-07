import { Pomolist, PomoTimer } from '../../components'
import { ShortcutTable } from '../../components/ShortcutTable/ShortcutTable'
import './home.page.scss'

export function Home({ className }) {
  return (
    <section className={`home ${className}`}>
      <PomoTimer />
      {/* <Pomolist /> */}
      <ShortcutTable/>
    </section>
  )
}
