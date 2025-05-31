import './SegmentBar.scss'

export const SegmentBar = ({ value = 0, limit = 1, showLabel = false }) => {
  function renderBar() {
    return Array.from({ length: Number(limit) }).map((_, index) => {
      const isActive = index < Number(value)

      return <div key={index} className={`bar ${isActive && 'active'}`}></div>
    })
  }

  return (
    <>
      <div className="segment-bar">
        <div className="segment-bar__box">{renderBar()}</div>
        {showLabel && <small>{value === limit ? 'Completed' : `${value} of ${limit}`}</small>}
      </div>
    </>
  )
}
