import { useEffect, useRef } from 'react';
import { EditIcon, CopyIcon, TrashIcon } from './Icons';

export function ContextMenu({ x, y, onEdit, onDuplicate, onHighlightConnected, onDelete, onClose }) {
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
      <div className="context-menu-item" onClick={onHighlightConnected}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
        <span>Highlight Connected</span>
      </div>
      <div className="context-menu-item danger" onClick={onDelete}>
        <TrashIcon size={14} />
        <span>Delete Node</span>
      </div>
    </div>
  );
}
