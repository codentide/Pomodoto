import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef también
import './SegmentBar.scss';

export const SegmentBar = ({ value = 0, limit = 1, showLabel = false, ...props }) => {
  const [activeBars, setActiveBars] = useState([]);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const newActiveBars = Array.from({ length: Number(limit) }).map((_, index) => {
      return index < Number(value);
    });

    console.log(newActiveBars);

    const updatedBars = newActiveBars.map((isActive, index) => {
      const previouslyActive = prevValueRef.current > index;

      if (isActive) {
        return 'active';
      } else {
        if (previouslyActive) {
          return 'unactive';
        } else {
          return '';
        }
      }
    });

    setActiveBars(updatedBars);
    prevValueRef.current = Number(value);
  }, [value, limit]);

  function renderBar() {
    return Array.from({ length: Number(limit) }).map((_, index) => {
      const className = activeBars[index] || '';

      return <div key={index} className={`bar ${className}`}></div>;
    });
  }

  return (
    <>
      <div className="segment-bar" {...props}>
        <div className="segment-bar__box">{renderBar()}</div>
        {showLabel && <small>{value === limit ? 'Completed' : `${value} of ${limit}`}</small>}
      </div>
    </>
  );
};