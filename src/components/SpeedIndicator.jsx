import { getSpeedDescription } from '../utils/speed';

export function SpeedIndicator({ speed, tps }) {
  // speed is 0-100, tps is tokens per second
  const displayValue = (speed !== undefined && !isNaN(speed)) ? speed : 
                       (tps !== undefined && !isNaN(tps)) ? Math.min(100, tps / 2) : null;
  
  if (displayValue == null) return null;
  
  const valueLabel = tps !== undefined && !isNaN(tps) ? `${tps} TPS` : `${speed}%`;
  const description = getSpeedDescription(displayValue);
  
  // Color based on speed
  let colorClass;
  if (displayValue >= 60) {
    colorClass = 'speed-fast';
  } else if (displayValue >= 40) {
    colorClass = 'speed-medium';
  } else if (displayValue >= 20) {
    colorClass = 'speed-slow';
  } else {
    colorClass = 'speed-very-slow';
  }
  
  return (
    <div className="speed-indicator" title={`Exact Speed: ${valueLabel}`}>
      <div className="speed-header">
        <span className="speed-label">SPEED: {description}</span>
      </div>
      <div className="speed-bar-container">
        <div 
          className={`speed-bar-fill ${colorClass}`} 
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
