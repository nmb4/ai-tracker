import { useState, useEffect } from 'react';

export function EditNodeModal({ node, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (node) {
      const data = { ...node.data };
      if (data.tags) {
        data.tags = data.tags.join(', ');
      }
      setFormData(data);
    }
  }, [node]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    const data = { ...formData };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    onSave(node.id, data);
  };

  const type = node?.type;

  const titles = {
    model: 'Edit AI Model',
    provider: 'Edit Provider',
    tool: 'Edit CLI Tool',
  };

  if (!node) return null;

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
                    value={formData.provider || ''}
                    onChange={e => handleChange('provider', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <input
                    className="form-input"
                    type="text"
                    value={formData.version || ''}
                    onChange={e => handleChange('version', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Context Window</label>
                  <input
                    className="form-input"
                    type="text"
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
                    value={formData.type || ''}
                    onChange={e => handleChange('type', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">API Endpoint</label>
                  <input
                    className="form-input"
                    type="text"
                    value={formData.apiEndpoint || ''}
                    onChange={e => handleChange('apiEndpoint', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input
                    className="form-input"
                    type="text"
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
                    value={formData.command || ''}
                    onChange={e => handleChange('command', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={formData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <input
                    className="form-input"
                    type="text"
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
