import { XIcon } from './Icons';

export function DetailPopup({ node, onClose, onSave }) {
  if (!node) return null;

  const typeLabels = {
    model: 'AI Model',
    provider: 'Provider',
    tool: 'CLI Tool',
    blank: 'Custom Note',
  };

  const handleNotesChange = (e) => {
    onSave(node.id, { ...node.data, detailNotes: e.target.value });
  };

  return (
    <div className="detail-popup-overlay" onClick={onClose}>
      <div className="detail-popup" onClick={e => e.stopPropagation()}>
        <div className="detail-popup-header">
          <div className="detail-popup-title-row">
            <span className={`detail-popup-badge ${node.type}`}>
              {typeLabels[node.type]}
            </span>
            <h2 className="detail-popup-title">{node.data.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <XIcon size={16} />
          </button>
        </div>
        
        <div className="detail-popup-body">
          <div className="detail-section">
            <h3 className="detail-section-title">Properties</h3>
            <div className="detail-properties">
              {node.type === 'model' && (
                <>
                  {node.data.provider && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">PROVIDER</span>
                      <span className="detail-prop-value">{node.data.provider}</span>
                    </div>
                  )}
                  {node.data.version && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">VERSION</span>
                      <span className="detail-prop-value">{node.data.version}</span>
                    </div>
                  )}
                  {node.data.context && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">CONTEXT</span>
                      <span className="detail-prop-value">{node.data.context}</span>
                    </div>
                  )}
                  {node.data.speed && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">SPEED</span>
                      <span className="detail-prop-value">{node.data.speed}%</span>
                    </div>
                  )}
                  {node.data.tps && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">TPS</span>
                      <span className="detail-prop-value">{node.data.tps} Tokens/sec</span>
                    </div>
                  )}
                  {node.data.lastUpdated && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">LAST UPDATED</span>
                      <span className="detail-prop-value">{new Date(node.data.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
              {node.type === 'provider' && (
                <>
                  {node.data.type && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">TYPE</span>
                      <span className="detail-prop-value">{node.data.type}</span>
                    </div>
                  )}
                  {node.data.apiEndpoint && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">ENDPOINT</span>
                      <span className="detail-prop-value">{node.data.apiEndpoint}</span>
                    </div>
                  )}
                  {node.data.status && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">STATUS</span>
                      <span className="detail-prop-value">{node.data.status}</span>
                    </div>
                  )}
                  {node.data.paymentType && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">PAYMENT</span>
                      <span className="detail-prop-value">{node.data.paymentType === 'subscription' ? 'Subscription' : 'Pay-per-token'}</span>
                    </div>
                  )}
                  {node.data.paymentType === 'subscription' && (
                    <>
                      {node.data.price && (
                        <div className="detail-prop-row">
                          <span className="detail-prop-label">PRICE</span>
                          <span className="detail-prop-value">{node.data.price}</span>
                        </div>
                      )}
                      {node.data.subStatus && (
                        <div className="detail-prop-row">
                          <span className="detail-prop-label">SUB STATUS</span>
                          <span className="detail-prop-value">{node.data.subStatus}</span>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {node.type === 'tool' && (
                <>
                  {node.data.command && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">COMMAND</span>
                      <span className="detail-prop-value" style={{ fontFamily: 'monospace' }}>{node.data.command}</span>
                    </div>
                  )}
                  {node.data.description && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">DESCRIPTION</span>
                      <span className="detail-prop-value">{node.data.description}</span>
                    </div>
                  )}
                  {node.data.version && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">VERSION</span>
                      <span className="detail-prop-value">{node.data.version}</span>
                    </div>
                  )}
                  {node.data.lastUpdated && (
                    <div className="detail-prop-row">
                      <span className="detail-prop-label">LAST UPDATED</span>
                      <span className="detail-prop-value">{new Date(node.data.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
              {node.type === 'blank' && node.data.fields?.map((field, i) => (
                <div key={i} className="detail-prop-row">
                  <span className="detail-prop-label">{field.label.toUpperCase()}</span>
                  <span className="detail-prop-value">{field.value}</span>
                </div>
              ))}
            </div>
            
            {node.data.tags?.length > 0 && (
              <div className="detail-tags">
                {node.data.tags.map((tag, i) => (
                  <span key={i} className="node-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">Notes & Changelog</h3>
            <textarea
              className="detail-notes-input"
              placeholder="Add detailed notes, usage descriptions, changelog entries..."
              value={node.data.detailNotes || ''}
              onChange={handleNotesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
