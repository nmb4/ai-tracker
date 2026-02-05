import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { WrenchIcon, StarIcon } from '../components/Icons';
import { FreshnessIndicator } from '../components/FreshnessIndicator';

function BuilderNode({ data, selected }) {
  const getPricingLabel = () => {
    if (data.pricingType === 'free') return 'Free';
    if (data.pricingType === 'freemium') return 'Freemium';
    if (data.pricingType === 'subscription' && data.price) return data.price;
    if (data.pricingType === 'subscription') return 'Subscription';
    if (data.pricingType === 'pay-per-use') return 'Pay-per-use';
    return 'Freemium';
  };

  const pricingLabel = getPricingLabel();
  const pricingType = data.pricingType || 'freemium';

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      {data.starred && (
        <div className="node-star">
          <StarIcon size={14} fill="currentColor" />
        </div>
      )}
      <div className="node-header">
        <div className="node-icon builder">
          <WrenchIcon size={18} />
        </div>
        <div>
          <div className="node-title">{data.name || 'Builder'}</div>
          <div className="node-type">Builder</div>
        </div>
      </div>
      <div className="node-body">
        <div className="node-field">
          <span className="node-label">Pricing</span>
          <span className="node-value" style={{
            color: pricingType === 'free' ? 'var(--success)' :
                   pricingType === 'freemium' ? 'var(--warning)' :
                   'var(--text-primary)',
            fontWeight: 500
          }}>
            {pricingLabel}
          </span>
        </div>

        {data.features && (
          <div className="node-field node-field-long">
            <span className="node-label">Features</span>
            <span className="node-value">{data.features}</span>
          </div>
        )}

        {data.exportFormats && (
          <div className="node-field">
            <span className="node-label">Exports</span>
            <span className="node-value">{data.exportFormats}</span>
          </div>
        )}

        {data.website && (
          <div className="node-field">
            <span className="node-label">Website</span>
            <span className="node-value" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              {data.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </span>
          </div>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="node-tags">
            {data.tags.map((tag, i) => (
              <span key={i} className="node-tag">{tag}</span>
            ))}
          </div>
        )}
        {data.lastUpdated && data.showFreshness !== false && (
          <FreshnessIndicator
            lastUpdated={data.lastUpdated}
            threshold={data.decayThreshold || 30}
          />
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(BuilderNode);
