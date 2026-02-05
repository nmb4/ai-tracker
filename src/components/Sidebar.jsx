import { BrainIcon, CloudIcon, TerminalIcon, NoteIcon, SunIcon } from './Icons';

export function Sidebar({ nodes, onAddNode, onClear, darkMode, onToggleDarkMode }) {
  const modelCount = nodes.filter(n => n.type === 'model').length;
  const providerCount = nodes.filter(n => n.type === 'provider').length;
  const toolCount = nodes.filter(n => n.type === 'tool').length;
  const blankCount = nodes.filter(n => n.type === 'blank').length;

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
        <button className="clear-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
    </div>
  );
}
