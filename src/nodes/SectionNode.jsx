import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

function SectionNode({ data, selected }) {
  return (
    <div className={`section-node ${selected ? 'selected' : ''}`}>
      <NodeResizer 
        minWidth={200} 
        minHeight={100} 
        isVisible={selected} 
        lineClassName="section-resizer-line"
        handleClassName="section-resizer-handle"
      />
      <div className="section-header">
        <span className="section-title">{data.name || 'Section'}</span>
      </div>
      <div className="section-content" />
    </div>
  );
}

export default memo(SectionNode);
