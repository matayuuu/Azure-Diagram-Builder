import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';
import {
  Save, FolderOpen, Download, Plus, Trash2, Image,
  LayoutDashboard, FileDown, Check, X, FileText, MessageSquare, Settings2,
} from 'lucide-react';

import AzureNode from './components/AzureNode';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import ChatPanel from './components/ChatPanel';
import { useDiagramStorage } from './hooks/useDiagramStorage';
import { useToast } from './hooks/useToast';
import { getServiceById } from './data/azureServices';

const nodeTypes = { azureNode: AzureNode };
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { strokeWidth: 2 },
};

let nodeIdCounter = 0;
function getNextNodeId() {
  return `node_${++nodeIdCounter}_${Date.now()}`;
}

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [diagramName, setDiagramName] = useState('Untitled Diagram');
  const [currentDiagramId, setCurrentDiagramId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [rightPanel, setRightPanel] = useState('chat'); // 'chat' | 'properties'

  const { savedDiagrams, saveDiagram, updateDiagram, deleteDiagram, getDiagram } = useDiagramStorage();
  const { toast, showToast } = useToast();

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Delete node handler passed to each node
  const deleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [setNodes, setEdges, selectedNodeId]);

  // Connect edges
  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, type: 'smoothstep' }, eds));
  }, [setEdges]);

  // Drop handler
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/azure-service');
    if (!data || !reactFlowInstance) return;

    const service = JSON.parse(data);
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: getNextNodeId(),
      type: 'azureNode',
      position,
      data: {
        serviceId: service.id,
        label: service.name,
        description: '',
        onDelete: deleteNode,
      },
    };

    setNodes(nds => [...nds, newNode]);
  }, [reactFlowInstance, setNodes, deleteNode]);

  // Ensure onDelete is always up to date on all nodes
  const nodesWithHandlers = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      data: { ...n.data, onDelete: deleteNode },
    }));
  }, [nodes, deleteNode]);

  // Highlight selected edge
  const styledEdges = useMemo(() => {
    return edges.map(e => ({
      ...e,
      style: {
        ...e.style,
        strokeWidth: e.id === selectedEdgeId ? 3 : 2,
        stroke: e.id === selectedEdgeId ? '#ef4444' : undefined,
      },
      animated: e.id === selectedEdgeId ? true : e.animated,
    }));
  }, [edges, selectedEdgeId]);

  // Node selection
  const onNodeClick = useCallback((_event, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  // Edge selection
  const onEdgeClick = useCallback((_event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  // Update node properties
  const onUpdateNode = useCallback((nodeId, updates) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  }, [setNodes]);

  // Save diagram
  const handleSave = useCallback(() => {
    // Strip onDelete from saved data
    const cleanNodes = nodes.map(n => ({
      ...n,
      data: { ...n.data, onDelete: undefined },
    }));
    if (currentDiagramId) {
      updateDiagram(currentDiagramId, diagramName, cleanNodes, edges);
      showToast('Diagram updated');
    } else {
      const diagram = saveDiagram(diagramName, cleanNodes, edges);
      setCurrentDiagramId(diagram.id);
      showToast('Diagram saved');
    }
  }, [nodes, edges, diagramName, currentDiagramId, saveDiagram, updateDiagram, showToast]);

  // Load diagram
  const handleLoad = useCallback((id) => {
    const diagram = getDiagram(id);
    if (!diagram) return;
    setDiagramName(diagram.name);
    setCurrentDiagramId(diagram.id);
    setNodes(diagram.nodes.map(n => ({
      ...n,
      data: { ...n.data, onDelete: deleteNode },
    })));
    setEdges(diagram.edges);
    setSelectedNodeId(null);
    setShowLoadModal(false);
    showToast('Diagram loaded');
  }, [getDiagram, setNodes, setEdges, deleteNode, showToast]);

  // New diagram
  const handleNew = useCallback(() => {
    setDiagramName('Untitled Diagram');
    setCurrentDiagramId(null);
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    showToast('New diagram created');
  }, [setNodes, setEdges, showToast]);

  // Export as PNG
  const handleExportPng = useCallback(() => {
    const el = document.querySelector('.react-flow__viewport');
    if (!el) return;
    toPng(el, {
      backgroundColor: '#0f172a',
      pixelRatio: 2,
    }).then((dataUrl) => {
      saveAs(dataUrl, `${diagramName.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
      showToast('Exported as PNG');
      setShowExportModal(false);
    }).catch(() => {
      showToast('Export failed', 'error');
    });
  }, [diagramName, showToast]);

  // Export as SVG
  const handleExportSvg = useCallback(() => {
    const el = document.querySelector('.react-flow__viewport');
    if (!el) return;
    toSvg(el, {
      backgroundColor: '#0f172a',
    }).then((dataUrl) => {
      saveAs(dataUrl, `${diagramName.replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`);
      showToast('Exported as SVG');
      setShowExportModal(false);
    }).catch(() => {
      showToast('Export failed', 'error');
    });
  }, [diagramName, showToast]);

  // Export as JSON
  const handleExportJson = useCallback(() => {
    const cleanNodes = nodes.map(n => ({
      ...n,
      data: { ...n.data, onDelete: undefined },
    }));
    const json = JSON.stringify({ name: diagramName, nodes: cleanNodes, edges }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${diagramName.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
    showToast('Exported as JSON');
    setShowExportModal(false);
  }, [nodes, edges, diagramName, showToast]);

  // Delete all nodes
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    showToast('Canvas cleared');
  }, [setNodes, setEdges, showToast]);

  // Keyboard shortcut for delete
  const onKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // Don't delete if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
      } else if (selectedEdgeId) {
        setEdges(eds => eds.filter(e => e.id !== selectedEdgeId));
        setSelectedEdgeId(null);
      }
    }
  }, [selectedNodeId, selectedEdgeId, deleteNode, setEdges]);

  // Chat: progressive diagram generation handler
  const handleGenerateDiagram = useCallback((event) => {
    if (event.type === 'addNode') {
      const node = {
        ...event.node,
        data: { ...event.node.data, onDelete: deleteNode },
        className: 'ai-generated',
      };
      setNodes(nds => [...nds, node]);

      // If last node, add all edges
      if (event.isLast && event.edges.length > 0) {
        setEdges(eds => [...eds, ...event.edges]);
        // Fit view after all nodes added
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.2, duration: 500 });
        }, 200);
      }
    }
  }, [deleteNode, setNodes, setEdges, reactFlowInstance]);

  // Chat: add a single node from chat
  const handleChatAddNode = useCallback((service) => {
    // Position near center-right of current viewport
    const bounds = reactFlowInstance?.getViewport();
    const position = reactFlowInstance
      ? reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        })
      : { x: 300 + Math.random() * 100, y: 300 + Math.random() * 100 };

    const newNode = {
      id: getNextNodeId(),
      type: 'azureNode',
      position,
      className: 'ai-generated',
      data: {
        serviceId: service.id,
        label: service.name,
        description: '',
        onDelete: deleteNode,
      },
    };
    setNodes(nds => [...nds, newNode]);
  }, [reactFlowInstance, setNodes, deleteNode]);

  // Chat: remove a node by serviceId from chat
  const handleChatRemoveNode = useCallback((serviceId) => {
    const node = nodes.find(n => n.data.serviceId === serviceId);
    if (!node) return false;
    deleteNode(node.id);
    return true;
  }, [nodes, deleteNode]);

  return (
    <div className="app-container" onKeyDown={onKeyDown} tabIndex={-1}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <LayoutDashboard size={22} />
            <h1>Azure Diagram Builder</h1>
          </div>
          <div className="header-divider" />
          <input
            className="diagram-name-input"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            placeholder="Diagram name..."
          />
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleNew} title="New diagram">
            <Plus size={15} /> New
          </button>
          <button className="btn btn-ghost" onClick={() => setShowLoadModal(true)} title="Open diagram">
            <FolderOpen size={15} /> Open
          </button>
          <button className="btn btn-primary" onClick={handleSave} title="Save diagram">
            <Save size={15} /> Save
          </button>
          <div className="header-divider" />
          <button className="btn btn-secondary" onClick={() => setShowExportModal(true)} title="Export diagram">
            <Download size={15} /> Export
          </button>
          <button className="btn btn-ghost btn-icon" onClick={handleClear} title="Clear canvas">
            <Trash2 size={15} />
          </button>
          <div className="header-divider" />
          <button
            className={`btn ${rightPanel === 'chat' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setRightPanel('chat')}
            title="AI Chat"
          >
            <MessageSquare size={15} /> Chat
          </button>
          <button
            className={`btn ${rightPanel === 'properties' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setRightPanel('properties')}
            title="Properties"
          >
            <Settings2 size={15} /> Properties
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        <Sidebar />

        <div className="canvas-wrapper" ref={reactFlowWrapper}>
          {nodes.length === 0 && (
            <div className="empty-state">
              <LayoutDashboard />
              <h3>Drag Azure services here</h3>
              <p>Drop services from the sidebar to start building your diagram</p>
            </div>
          )}
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView={false}
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode="Delete"
            connectionLineStyle={{ stroke: '#0078d4', strokeWidth: 2 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
            <Controls />
            <MiniMap
              nodeColor={() => '#0078d4'}
              maskColor="rgba(15, 23, 42, 0.8)"
            />
          </ReactFlow>
        </div>

        {rightPanel === 'properties' ? (
          <PropertiesPanel selectedNode={selectedNode} onUpdateNode={onUpdateNode} />
        ) : (
          <ChatPanel
            onGenerateDiagram={handleGenerateDiagram}
            onAddNode={handleChatAddNode}
            onRemoveNode={handleChatRemoveNode}
            existingNodes={nodes}
          />
        )}
      </div>

      {/* Load Modal */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Open Diagram</h3>
            {savedDiagrams.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
                No saved diagrams yet. Create and save a diagram first.
              </p>
            ) : (
              <div className="saved-list">
                {savedDiagrams.map(d => (
                  <div key={d.id} className="saved-item" onClick={() => handleLoad(d.id)}>
                    <div className="saved-item-info">
                      <h4>{d.name}</h4>
                      <p>{d.nodes.length} nodes · {new Date(d.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="saved-item-actions">
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={(e) => { e.stopPropagation(); deleteDiagram(d.id); }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLoadModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Export Diagram</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <button className="btn btn-secondary" onClick={handleExportPng} style={{ justifyContent: 'flex-start' }}>
                <Image size={16} /> Export as PNG
              </button>
              <button className="btn btn-secondary" onClick={handleExportSvg} style={{ justifyContent: 'flex-start' }}>
                <FileDown size={16} /> Export as SVG
              </button>
              <button className="btn btn-secondary" onClick={handleExportJson} style={{ justifyContent: 'flex-start' }}>
                <FileText size={16} /> Export as JSON
              </button>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
