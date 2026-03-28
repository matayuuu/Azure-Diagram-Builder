import { getServiceById } from '../data/azureServices';
import { MousePointerClick } from 'lucide-react';

export default function PropertiesPanel({ selectedNode, onUpdateNode }) {
  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <h2>Properties</h2>
        <div className="no-selection">
          <MousePointerClick />
          <p>Select a node to<br />edit its properties</p>
        </div>
      </div>
    );
  }

  const service = getServiceById(selectedNode.data.serviceId);

  return (
    <div className="properties-panel">
      <h2>Properties</h2>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src={`/icons/${selectedNode.data.serviceId}.svg`} alt={service?.name} width={48} height={48} />
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {service?.name}
        </div>
      </div>
      <div className="property-field">
        <label>Label</label>
        <input
          type="text"
          value={selectedNode.data.label || ''}
          onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
        />
      </div>
      <div className="property-field">
        <label>Description</label>
        <textarea
          value={selectedNode.data.description || ''}
          onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
          placeholder="Add a description..."
        />
      </div>
      <div className="property-field">
        <label>Node ID</label>
        <input type="text" value={selectedNode.id} readOnly style={{ opacity: 0.5 }} />
      </div>
      <div className="property-field">
        <label>Position</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={`X: ${Math.round(selectedNode.position.x)}`} readOnly style={{ opacity: 0.5 }} />
          <input type="text" value={`Y: ${Math.round(selectedNode.position.y)}`} readOnly style={{ opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
