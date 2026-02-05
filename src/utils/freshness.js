// Freshness indicator utility

export function getFreshnessInfo(lastUpdated, thresholdDays = 30) {
  if (!lastUpdated) return null;
  
  const now = Date.now();
  const updated = new Date(lastUpdated).getTime();
  const diffMs = now - updated;
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  let label;
  if (diffDays === 0) {
    label = 'Today';
  } else if (diffDays === 1) {
    label = 'Yesterday';
  } else if (diffDays < 7) {
    label = `${diffDays} days ago`;
  } else {
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      label = `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) {
        label = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
      } else {
        label = 'Over a year ago';
      }
    }
  }
  
  // Calculate decay level (0-4) based on the custom threshold
  // thresholdDays is the point where it becomes "Stale" (level 4)
  const ratio = diffDays / thresholdDays;
  let decay;
  
  if (ratio <= 0.2) {
    decay = 0; // Fresh
  } else if (ratio <= 0.4) {
    decay = 1; // Recent
  } else if (ratio <= 0.7) {
    decay = 2; // Aging
  } else if (ratio <= 1.0) {
    decay = 3; // Old
  } else {
    decay = 4; // Stale
  }
  
  return { label, decay, diffDays };
}
