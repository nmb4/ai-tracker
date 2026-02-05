import { useState } from 'react';

export function NodeModal({ type, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    // Parse tags from comma-separated string
    const data = { ...formData };
    if (data.tags) {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    onSave(data);
  };

  const titles = {
    model: 'Add AI Model',
    provider: 'Add Provider',
    tool: 'Add CLI Tool',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{titles[type]}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                className="form-input"
                type="text"
                placeholder={type === 'model' ? 'e.g., Claude 3.5 Sonnet' : type === 'provider' ? 'e.g., Anthropic' : 'e.g., aider'}
                value={formData.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                autoFocus
              />
            </div>

            {type === 'model' && (
              <>
                <div className="form-group">
                  <label className="form-label">Provider</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., Anthropic, OpenAI"
                    value={formData.provider || ''}
                    onChange={e => handleChange('provider', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., 3.5, 4-turbo"
                    value={formData.version || ''}
                    onChange={e => handleChange('version', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Context Window</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., 200K tokens"
                    value={formData.context || ''}
                    onChange={e => handleChange('context', e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'provider' && (
              <>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., Cloud API, Local, Self-hosted"
                    value={formData.type || ''}
                    onChange={e => handleChange('type', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">API Endpoint</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., api.anthropic.com"
                    value={formData.apiEndpoint || ''}
                    onChange={e => handleChange('apiEndpoint', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., Active, Inactive"
                    value={formData.status || ''}
                    onChange={e => handleChange('status', e.target.value)}
                  />
                </div>
              </>
            )}

            {type === 'tool' && (
              <>
                <div className="form-group">
                  <label className="form-label">Command</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., aider, claude, cursor"
                    value={formData.command || ''}
                    onChange={e => handleChange('command', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Brief description of what this tool does..."
                    value={formData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., 1.2.0"
                    value={formData.version || ''}
                    onChange={e => handleChange('version', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., coding, chat, vision"
                value={formData.tags || ''}
                onChange={e => handleChange('tags', e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
