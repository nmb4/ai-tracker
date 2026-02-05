import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NoteIcon } from '../components/Icons';

function BlankNode({ data, selected }) {
  const fields = data.fields || [];

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <div className="node-icon blank">
          <NoteIcon size={18} />
        </div>
        <div>
          <div className="node-title">{data.name || 'Note'}</div>
          <div className="node-type">Custom</div>
        </div>
      </div>
      <div className="node-body">
        {fields.map((field, index) => (
          <div key={index} className="node-field">
            <span className="node-label">{field.label}</span>
            <span className="node-value">{field.value}</span>
          </div>
        ))}
        {data.notes && (
          <div className="node-field node-field-notes">
            <span className="node-label">Notes</span>
            <span className="node-value node-notes">{data.notes}</span>
          </div>
        )}
        {fields.length === 0 && !data.notes && (
          <div className="node-empty-hint">
            Right-click to edit and add fields
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

export default memo(BlankNode);
