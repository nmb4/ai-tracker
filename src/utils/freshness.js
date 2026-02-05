// Freshness indicator utility

export function getFreshnessInfo(lastUpdated) {
  if (!lastUpdated) return null;
  
  const now = Date.now();
  const updated = new Date(lastUpdated).getTime();
  const diffMs = now - updated;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  let label;
  if (diffDays === 0) {
    label = 'Today';
  } else if (diffDays === 1) {
    label = 'Yesterday';
  } else if (diffDays < 7) {
    label = `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    label = `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else if (diffMonths < 12) {
    label = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    label = 'Over a year ago';
  }
  
  // Calculate decay level (0-4): 0 = fresh, 4 = stale
  let decay;
  if (diffDays <= 7) {
    decay = 0; // Fresh - green
  } else if (diffDays <= 30) {
    decay = 1; // Recent - yellow-green
  } else if (diffDays <= 90) {
    decay = 2; // Aging - yellow
  } else if (diffDays <= 180) {
    decay = 3; // Old - orange
  } else {
    decay = 4; // Stale - red
  }
  
  return { label, decay, diffDays };
}
