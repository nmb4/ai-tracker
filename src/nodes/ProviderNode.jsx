import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CloudIcon } from '../components/Icons';

function ProviderNode({ data, selected }) {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <div className="node-icon provider">
          <CloudIcon size={18} />
        </div>
        <div>
          <div className="node-title">{data.name || 'Provider'}</div>
          <div className="node-type">Provider</div>
        </div>
      </div>
      <div className="node-body">
        {data.type && (
          <div className="node-field">
            <span className="node-label">Type</span>
            <span className="node-value">{data.type}</span>
          </div>
        )}
        {data.apiEndpoint && (
          <div className="node-field">
            <span className="node-label">Endpoint</span>
            <span className="node-value">{data.apiEndpoint}</span>
          </div>
        )}
        {data.status && (
          <div className="node-field">
            <span className="node-label">Status</span>
            <span className="node-value">{data.status}</span>
          </div>
        )}
        {data.tags && data.tags.length > 0 && (
          <div className="node-tags">
            {data.tags.map((tag, i) => (
              <span key={i} className="node-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(ProviderNode);
