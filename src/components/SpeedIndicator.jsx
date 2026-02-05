export function SpeedIndicator({ speed, tps }) {
  // speed is 0-100, tps is tokens per second
  const displayValue = speed ?? (tps ? Math.min(100, tps / 2) : null);
  
  if (displayValue === null && !tps) return null;
  
  const label = tps ? `${tps} TPS` : `${speed}%`;
  
  // Color based on speed
  let colorClass;
  if (displayValue >= 80) {
    colorClass = 'speed-fast';
  } else if (displayValue >= 50) {
    colorClass = 'speed-medium';
  } else if (displayValue >= 20) {
    colorClass = 'speed-slow';
  } else {
    colorClass = 'speed-very-slow';
  }
  
  return (
    <div className="speed-indicator" title={`Speed: ${label}`}>
      <div className="speed-bar-container">
        <div 
          className={`speed-bar-fill ${colorClass}`} 
          style={{ width: `${displayValue}%` }}
        />
      </div>
      <span className="speed-label">{label}</span>
    </div>
  );
}
