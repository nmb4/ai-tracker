import { getFreshnessInfo } from '../utils/freshness';

export function FreshnessIndicator({ lastUpdated }) {
  const info = getFreshnessInfo(lastUpdated);
  
  if (!info) return null;
  
  return (
    <div className={`freshness-indicator decay-${info.decay}`} title={`Last updated: ${info.label}`}>
      <div className="freshness-dot" />
      <span className="freshness-label">{info.label}</span>
    </div>
  );
}
