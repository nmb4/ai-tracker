export function getSpeedDescription(value) {
  if (value === null || value === undefined) return '';
  
  if (value >= 100) return 'Crazy Fast';
  if (value >= 80) return 'Very Fast';
  if (value >= 60) return 'Fast';
  if (value >= 40) return 'Moderate';
  if (value >= 20) return 'Slow';
  return 'Very Slow';
}
