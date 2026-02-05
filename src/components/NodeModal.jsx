import { useState } from 'react';
import { PlusIcon, XIcon } from './Icons';

export function NodeModal({ type, onClose, onSave }) {
  const [formData, setFormData] = useState({ fields: [] });

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

  const handleNumericChange = (field, value) => {
    const parsed = parseInt(value);
    setFormData(prev => ({ ...prev, [field]: isNaN(parsed) ? undefined : parsed }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    const data = { ...formData };
    if (data.tags && typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    // Filter out empty fields for blank nodes
    if (data.fields) {
      data.fields = data.fields.filter(f => f.label.trim() && f.value.trim());
    }
    
    // Set lastUpdated for Models, Tools, and Builders if not manually changed
    if ((type === 'model' || type === 'tool' || type === 'builder') && !data.lastUpdated) {
      data.lastUpdated = new Date().toISOString().split('T')[0];
    }

    if ((type === 'model' || type === 'tool' || type === 'builder') && data.showFreshness === undefined) {
      data.showFreshness = true;
    }
    
    onSave(data);
  };

  const titles = {
    model: 'Add AI Model',
    provider: 'Add Provider',
    tool: 'Add CLI Tool',
    builder: 'Add Builder',
    blank: 'Add Custom Note',
    section: 'Add Section',
  };

  const placeholders = {
    model: 'e.g., Claude 3.5 Sonnet',
    provider: 'e.g., Anthropic',
    tool: 'e.g., aider',
    builder: 'e.g., v0, Lovable, BoltAI',
    blank: 'e.g., My Ideas',
    section: 'e.g., Active Stack',
  };

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
                placeholder={placeholders[type]}
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
                <div className="form-group">
                  <label className="form-label">Speed (0-100%)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 85"
                    value={formData.speed === undefined ? '' : formData.speed}
                    onChange={e => handleNumericChange('speed', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tokens Per Second (TPS)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.tps === undefined ? '' : formData.tps}
                    onChange={e => handleNumericChange('tps', e.target.value)}
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
                        placeholder="e.g., $20/mo"
                        value={formData.price || ''}
                        onChange={e => handleChange('price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subscription Status</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="e.g., Active"
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

            {type === 'builder' && (
              <>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., v0.dev"
                    value={formData.website || ''}
                    onChange={e => handleChange('website', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pricing Type</label>
                  <select
                    className="form-input"
                    value={formData.pricingType || 'freemium'}
                    onChange={e => handleChange('pricingType', e.target.value)}
                  >
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="subscription">Subscription</option>
                    <option value="pay-per-use">Pay-per-use</option>
                  </select>
                </div>
                {formData.pricingType === 'subscription' && (
                  <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="e.g., $20/mo"
                      value={formData.price || ''}
                      onChange={e => handleChange('price', e.target.value)}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Features</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Key capabilities..."
                    value={formData.features || ''}
                    onChange={e => handleChange('features', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Export Formats</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., React, Next.js, Tailwind"
                    value={formData.exportFormats || ''}
                    onChange={e => handleChange('exportFormats', e.target.value)}
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
                placeholder="e.g., coding, chat, vision"
                value={formData.tags || ''}
                onChange={e => handleChange('tags', e.target.value)}
              />
            </div>

            {(type === 'model' || type === 'tool' || type === 'builder') && (
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
                      value={formData.lastUpdated || new Date().toISOString().split('T')[0]}
                      onChange={e => handleChange('lastUpdated', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Freshness Limit (Days)</label>
                    <input
                      className="form-input"
                      type="number"
                      min="1"
                      placeholder="e.g., 30"
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
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
