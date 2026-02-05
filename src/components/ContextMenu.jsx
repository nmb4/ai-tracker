import { useEffect, useRef } from 'react';
import { EditIcon, CopyIcon, TrashIcon, StarIcon, HighlightIcon } from './Icons';

export function ContextMenu({ x, y, node, onEdit, onDuplicate, onHighlightConnected, onToggleStar, onDelete, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const canStar = node?.type === 'model' || node?.type === 'tool';
  const isStarred = node?.data?.starred;

  return (
    <div 
      ref={ref}
      className="context-menu" 
      style={{ left: x, top: y }}
    >
      <div className="context-menu-item" onClick={onEdit}>
        <EditIcon size={14} />
        <span>Edit Node</span>
      </div>
      <div className="context-menu-item" onClick={onDuplicate}>
        <CopyIcon size={14} />
        <span>Duplicate</span>
      </div>
      {canStar && (
        <div className="context-menu-item" onClick={onToggleStar}>
          <StarIcon size={14} fill={isStarred ? "currentColor" : "none"} />
          <span>{isStarred ? 'Unstar Node' : 'Star Node'}</span>
        </div>
      )}
      <div className="context-menu-item" onClick={onHighlightConnected}>
        <HighlightIcon size={14} />
        <span>Highlight Connected</span>
      </div>
      <div className="context-menu-item danger" onClick={onDelete}>
        <TrashIcon size={14} />
        <span>Delete Node</span>
      </div>
    </div>
  );
}

