import { getFreshnessInfo } from '../utils/freshness';

export function FreshnessIndicator({ lastUpdated, threshold }) {
  const info = getFreshnessInfo(lastUpdated, threshold);
  
  if (!info) return null;
  
  return (
    <div className={`freshness-indicator decay-${info.decay}`} title={`Last updated: ${info.label} (Threshold: ${threshold || 30} days)`}>
      <div className="freshness-dot" />
      <span className="freshness-label">{info.label}</span>
    </div>
  );
}
