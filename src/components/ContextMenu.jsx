import { useEffect, useRef } from 'react';
import { EditIcon, CopyIcon, TrashIcon } from './Icons';

export function ContextMenu({ x, y, onEdit, onDuplicate, onDelete, onClose }) {
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
      <div className="context-menu-item danger" onClick={onDelete}>
        <TrashIcon size={14} />
        <span>Delete Node</span>
      </div>
    </div>
  );
}
