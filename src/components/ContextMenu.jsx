import { useEffect, useRef } from 'react';

export function ContextMenu({ x, y, onEdit, onDelete, onClose }) {
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
        ✏️ Edit Node
      </div>
      <div className="context-menu-item danger" onClick={onDelete}>
        🗑️ Delete Node
      </div>
    </div>
  );
}
