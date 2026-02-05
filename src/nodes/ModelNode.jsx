import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { BrainIcon, StarIcon } from '../components/Icons';
import { FreshnessIndicator } from '../components/FreshnessIndicator';
import { SpeedIndicator } from '../components/SpeedIndicator';

function ModelNode({ data, selected }) {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      {data.starred && (
        <div className="node-star">
          <StarIcon size={14} fill="currentColor" />
        </div>
      )}
      <div className="node-header">
        <div className="node-icon model">
          <BrainIcon size={18} />
        </div>
        <div>
          <div className="node-title">{data.name || 'AI Model'}</div>
          <div className="node-type">Model</div>
        </div>
      </div>
      <div className="node-body">
        <div className="node-properties">
          {data.provider && (
            <div className="node-field">
              <span className="node-label">Provider</span>
              <span className="node-value">{data.provider}</span>
            </div>
          )}
          {data.version && (
            <div className="node-field">
              <span className="node-label">Version</span>
              <span className="node-value">{data.version}</span>
            </div>
          )}
          {data.context && (
            <div className="node-field">
              <span className="node-label">Context</span>
              <span className="node-value">{data.context}</span>
            </div>
          )}
        </div>
        
        {(data.speed !== undefined || data.tps !== undefined) && (
          <SpeedIndicator speed={data.speed} tps={data.tps} />
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

export default memo(ModelNode);
