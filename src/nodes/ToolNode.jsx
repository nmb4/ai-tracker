import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TerminalIcon, StarIcon } from '../components/Icons';
import { FreshnessIndicator } from '../components/FreshnessIndicator';

function ToolNode({ data, selected }) {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      {data.starred && (
        <div className="node-star">
          <StarIcon size={14} fill="currentColor" />
        </div>
      )}
      <div className="node-header">
        <div className="node-icon tool">
          <TerminalIcon size={18} />
        </div>
        <div>
          <div className="node-title">{data.name || 'CLI Tool'}</div>
          <div className="node-type">Tool</div>
        </div>
      </div>
      <div className="node-body">
        <div className="node-properties">
          {data.command && (
            <div className="node-field">
              <span className="node-label">Command</span>
              <span className="node-value" style={{ fontFamily: 'monospace' }}>{data.command}</span>
            </div>
          )}
          {data.version && (
            <div className="node-field">
              <span className="node-label">Version</span>
              <span className="node-value">{data.version}</span>
            </div>
          )}
        </div>

        {data.description && (
          <div className="node-field node-field-long">
            <span className="node-label">Description</span>
            <span className="node-value">{data.description}</span>
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

export default memo(ToolNode);
