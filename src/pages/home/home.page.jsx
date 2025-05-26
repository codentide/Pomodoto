import { Pomolist, PomoTimer } from '../../components'
import './home.page.scss'

export function Home({ className }) {
  return (
    <section className={`home ${className}`}>
      <PomoTimer />
      {/* <Pomolist /> */}
    </section>
  )
}
