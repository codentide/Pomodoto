import { Pomolist, PomoTimer } from '../components'

export function Home({ className }) {
  return (
    <section className={`home ${className}`}>
      <PomoTimer />
      {/* <Pomolist /> */}
    </section>
  )
}
