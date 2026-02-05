import { useState, useEffect } from 'react';
import { PlusIcon, XIcon } from './Icons';

export function EditNodeModal({ node, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (node) {
      const data = { ...node.data };
      if (data.tags && Array.isArray(data.tags)) {
        data.tags = data.tags.join(', ');
      }
      if (!data.fields) {
        data.fields = [];
      }
      setFormData(data);
    }
  }, [node]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (index, key, value) => {
    setFormData(prev => {
      const fields = [...(prev.fields || [])];
      fields[index] = { ...fields[index], [key]: value };
      return { ...prev, fields };
    });
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), { label: '', value: '' }]
    }));
  };

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    const data = { ...formData };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (data.fields) {
      data.fields = data.fields.filter(f => f.label.trim() && f.value.trim());
    }
    
    onSave(node.id, data);
  };

  const type = node?.type;

  const titles = {
    model: 'Edit AI Model',
    provider: 'Edit Provider',
    tool: 'Edit CLI Tool',
    blank: 'Edit Custom Note',
    section: 'Edit Section',
  };

  if (!node) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{titles[type]}</h2>
          <button className="modal-close" onClick={onClose}>
            <XIcon size={16} />
          </button>
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
                <div className="form-group">
                  <label className="form-label">Speed (0-100%)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.speed || ''}
                    onChange={e => handleChange('speed', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tokens Per Second (TPS)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={formData.tps || ''}
                    onChange={e => handleChange('tps', parseInt(e.target.value))}
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
                <div className="form-group">
                  <label className="form-label">Payment Type</label>
                  <select 
                    className="form-input"
                    value={formData.paymentType || 'pay-per-token'}
                    onChange={e => handleChange('paymentType', e.target.value)}
                  >
                    <option value="pay-per-token">Pay-per-token</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                {formData.paymentType === 'subscription' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input
                        className="form-input"
                        type="text"
                        value={formData.price || ''}
                        onChange={e => handleChange('price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subscription Status</label>
                      <input
                        className="form-input"
                        type="text"
                        value={formData.subStatus || ''}
                        onChange={e => handleChange('subStatus', e.target.value)}
                      />
                    </div>
                  </>
                )}
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

            {type === 'blank' && (
              <>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Any notes or ideas..."
                    value={formData.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Custom Fields</label>
                    <button type="button" className="add-field-btn" onClick={addField}>
                      <PlusIcon size={14} />
                      <span>Add Field</span>
                    </button>
                  </div>
                  
                  {(formData.fields || []).map((field, index) => (
                    <div key={index} className="custom-field-row">
                      <input
                        className="form-input field-label-input"
                        type="text"
                        placeholder="Label"
                        value={field.label}
                        onChange={e => handleFieldChange(index, 'label', e.target.value)}
                      />
                      <input
                        className="form-input field-value-input"
                        type="text"
                        placeholder="Value"
                        value={field.value}
                        onChange={e => handleFieldChange(index, 'value', e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="remove-field-btn"
                        onClick={() => removeField(index)}
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  ))}
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

            {(type === 'model' || type === 'tool') && (
              <>
                <div className="form-group checkbox-group">
                  <label className="form-label">Show Freshness Indicator</label>
                  <div 
                    className={`theme-toggle-switch ${formData.showFreshness !== false ? 'active' : ''}`}
                    onClick={() => handleChange('showFreshness', formData.showFreshness === false)}
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Last Updated</label>
                    <input
                      className="form-input"
                      type="date"
                      value={formData.lastUpdated || ''}
                      onChange={e => handleChange('lastUpdated', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Freshness Limit (Days)</label>
                    <input
                      className="form-input"
                      type="number"
                      min="1"
                      value={formData.decayThreshold || 30}
                      onChange={e => handleChange('decayThreshold', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}
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
