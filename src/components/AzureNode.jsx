import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getServiceById } from '../data/azureServices';

function AzureNode({ id, data, selected }) {
  const service = getServiceById(data.serviceId);

  const onDelete = useCallback((e) => {
    e.stopPropagation();
    data.onDelete?.(id);
  }, [id, data]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <div className={`azure-node${selected ? ' selected' : ''}`}>
        <button className="delete-btn" onClick={onDelete} title="Delete node">×</button>
        <div className="azure-node-icon">
          <img src={`/icons/${data.serviceId}.svg`} alt={service?.name || data.serviceId} width={40} height={40} />
        </div>
        <div className="azure-node-label">{data.label}</div>
        <div className="azure-node-type">{service?.name || data.serviceId}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(AzureNode);
