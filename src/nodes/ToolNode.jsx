import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TerminalIcon } from '../components/Icons';

function ToolNode({ data, selected }) {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
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
        {data.command && (
          <div className="node-field">
            <div className="node-label">Command</div>
            <div className="node-value" style={{ fontFamily: 'monospace' }}>{data.command}</div>
          </div>
        )}
        {data.description && (
          <div className="node-field">
            <div className="node-label">Description</div>
            <div className="node-value">{data.description}</div>
          </div>
        )}
        {data.version && (
          <div className="node-field">
            <div className="node-label">Version</div>
            <div className="node-value">{data.version}</div>
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

export default memo(ToolNode);
