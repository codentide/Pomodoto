import { PomoTimer } from '../Pomotimer/PomoTimer'
import './Pomolist.scss'

export const Pomolist = () => {
  return (
    <div className="pomolist">
      <div className="pomolist__header">
        <div className="info">
          <p className="info__title">Pomolist</p>
          <small className="info__subtitle">
            Here you can create your todos
          </small>
        </div>
        <div className="filter">
          <div className="filter__btn-box">
            <button className="filter__status">Status</button>
            <button className="filter__status">Status</button>
          </div>
          <button className="filter__create">Create</button>
        </div>
      </div>
      <ul className="pomolist__list">
        <li className="item">Create a new todo</li>
        <li className="item">Create a new todo</li>
        <li className="item">Create a new todo</li>

        {/* mapear los items */}
      </ul>
    </div>
  )
}

/* 
Creación de PomoCards: Este componente se encargará de crear las tarjetas de pomodoro (PomoCards).
Ajuste del Temporizador: Basado en la PomoCard seleccionada, el temporizador se ajustará automáticamente.
Progreso del Pomodoro: Al completar un pomodoro, se mostrará el progreso, por ejemplo, 1/4 pomodoros completados.
Ciclo de Pomodoros: Al finalizar un ciclo completo de pomodoros, la tarea se marcará como terminada. El usuario tendrá la opción de desmarcarla y asignar más pomodoros si es necesario.
*/
