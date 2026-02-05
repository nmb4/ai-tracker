import { BrainIcon, CloudIcon, TerminalIcon, NoteIcon, SunIcon } from './Icons';

export function Sidebar({ nodes, onAddNode, onClear, onExport, onImport, onExportView, onExportAll, darkMode, onToggleDarkMode }) {
  const modelCount = nodes.filter(n => n.type === 'model').length;
  const providerCount = nodes.filter(n => n.type === 'provider').length;
  const toolCount = nodes.filter(n => n.type === 'tool').length;
  const blankCount = nodes.filter(n => n.type === 'blank').length;

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <SunIcon size={24} />
          <span className="sidebar-title">AI Tracker</span>
        </div>
        <div className="sidebar-subtitle">Manage your AI stack</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Add Node</div>
        <button className="add-node-btn" onClick={() => onAddNode('model')}>
          <span className="icon model"><BrainIcon size={16} /></span>
          <span className="text">AI Model</span>
        </button>
        <button className="add-node-btn" onClick={() => onAddNode('provider')}>
          <span className="icon provider"><CloudIcon size={16} /></span>
          <span className="text">Provider</span>
        </button>
        <button className="add-node-btn" onClick={() => onAddNode('tool')}>
          <span className="icon tool"><TerminalIcon size={16} /></span>
          <span className="text">CLI Tool</span>
        </button>
        <button className="add-node-btn" onClick={() => onAddNode('blank')}>
          <span className="icon blank"><NoteIcon size={16} /></span>
          <span className="text">Custom Note</span>
        </button>
        <button className="add-node-btn" onClick={() => onAddNode('section')}>
          <span className="icon section">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <line x1="3" x2="21" y1="9" y2="9"/>
            </svg>
          </span>
          <span className="text">Section</span>
        </button>
      </div>

      <div className="sidebar-stats">
        <div className="sidebar-section-title">Overview</div>
        <div className="stat-item">
          <span className="stat-label">AI Models</span>
          <span className="stat-value">{modelCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Providers</span>
          <span className="stat-value">{providerCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">CLI Tools</span>
          <span className="stat-value">{toolCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Custom Notes</span>
          <span className="stat-value">{blankCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Nodes</span>
          <span className="stat-value">{nodes.length}</span>
        </div>
        
        <div className="theme-toggle">
          <span className="theme-toggle-label">Dark Mode</span>
          <div 
            className={`theme-toggle-switch ${darkMode ? 'active' : ''}`}
            onClick={onToggleDarkMode}
          />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="footer-btns">
          <button className="primary-btn" onClick={onExportView}>
            Export View
          </button>
          <button className="primary-btn" onClick={onExportAll}>
            Export All
          </button>
        </div>
        <div className="footer-btns">
          <button className="secondary-btn" onClick={onExport}>
            Export JSON
          </button>
          <button className="secondary-btn" onClick={handleImportClick}>
            Import JSON
          </button>
        </div>
        <button className="clear-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
    </div>
  );
}
