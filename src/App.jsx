import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

import { nodeTypes } from './nodes';
import { Sidebar } from './components/Sidebar';
import { NodeModal } from './components/NodeModal';
import { EditNodeModal } from './components/EditNodeModal';
import { ContextMenu } from './components/ContextMenu';
import { DetailPopup } from './components/DetailPopup';
import { TargetIcon } from './components/Icons';

const STORAGE_KEY = 'ai-tracker-data';
const THEME_KEY = 'ai-tracker-theme';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return { nodes: [], edges: [] };
}

function saveToStorage(nodes, edges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark';
  } catch (e) {
    return false;
  }
}

function saveTheme(isDark) {
  try {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

function App() {
  const initialData = loadFromStorage();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
  
  const [modalType, setModalType] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(loadTheme);
  const [detailNode, setDetailNode] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    saveTheme(darkMode);
  }, [darkMode]);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    saveToStorage(nodes, edges);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleAddNode = (type) => {
    setModalType(type);
  };

  const handleSaveNode = (data) => {
    const id = `${modalType}-${Date.now()}`;
    const newNode = {
      id,
      type: modalType,
      position: { 
        x: 100 + Math.random() * 200, 
        y: 100 + Math.random() * 200 
      },
      data,
    };

    if (modalType === 'section') {
      newNode.width = 400;
      newNode.height = 300;
      newNode.zIndex = -1;
    }

    setNodes((nds) => [...nds, newNode]);
    setModalType(null);
  };

  const handleUpdateNode = (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setContextMenu(null);
  };

  const handleDuplicateNode = (node) => {
    const newNode = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: { ...node.data },
      selected: false,
    };

    if (node.type === 'section') {
      newNode.width = node.width;
      newNode.height = node.height;
      newNode.zIndex = -1;
    }

    setNodes((nds) => [...nds, newNode]);
    setContextMenu(null);
  };

  const handleHighlightConnected = (nodeId) => {
    // Find all connected nodes by traversing edges
    const connectedIds = new Set([nodeId]);
    let changed = true;
    
    // Keep iterating until no new connections are found
    while (changed) {
      changed = false;
      edges.forEach((edge) => {
        if (connectedIds.has(edge.source) && !connectedIds.has(edge.target)) {
          connectedIds.add(edge.target);
          changed = true;
        }
        if (connectedIds.has(edge.target) && !connectedIds.has(edge.source)) {
          connectedIds.add(edge.source);
          changed = true;
        }
      });
    }

    // Select all connected nodes
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: connectedIds.has(node.id),
      }))
    );
    
    // Also highlight the connected edges
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: connectedIds.has(edge.source) && connectedIds.has(edge.target),
      }))
    );
    
    setContextMenu(null);
  };

  const handleToggleStar = (nodeId) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, starred: !node.data.starred } } : node
      )
    );
    setContextMenu(null);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleExport = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.nodes && Array.isArray(data.nodes) && data.edges && Array.isArray(data.edges)) {
          setNodes(data.nodes);
          setEdges(data.edges);
        } else {
          alert('Invalid file format. Please import a valid AI Tracker export.');
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to parse the file. Make sure it is a valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportImage = () => {
    if (nodes.length === 0) return;

    const element = document.querySelector('.react-flow');
    const controls = document.querySelector('.react-flow__controls');
    const minimap = document.querySelector('.react-flow__minimap');
    
    if (controls) controls.style.display = 'none';
    if (minimap) minimap.style.display = 'none';

    // Get the current background color and border color for the dots
    const bgColor = darkMode ? '#1A1A1A' : '#FAF9F7';
    const dotColor = darkMode ? '#333333' : '#E5E2DC';

    toPng(element, {
      backgroundColor: bgColor,
      pixelRatio: 3, // High resolution (3x)
      filter: (node) => {
        if (node?.classList?.contains('react-flow__controls') || 
            node?.classList?.contains('react-flow__minimap')) {
          return false;
        }
        return true;
      },
      // Force the dot color by injecting styles during capture
      style: {
        '--border-light': dotColor,
      }
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `ai-tracker-canvas-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      
      if (controls) controls.style.display = 'flex';
      if (minimap) minimap.style.display = 'block';
    }).catch((err) => {
      console.error('Export image failed:', err);
      if (controls) controls.style.display = 'flex';
      if (minimap) minimap.style.display = 'block';
    });
  };

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node,
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onNodeDoubleClick = useCallback((event, node) => {
    setDetailNode(node);
  }, []);

  const handleDetailSave = (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
    // Update detailNode to reflect changes
    setDetailNode(prev => prev && prev.id === nodeId ? { ...prev, data } : prev);
  };

  return (
    <>
      <Sidebar 
        nodes={nodes} 
        onAddNode={handleAddNode} 
        onClear={handleClear}
        onExport={handleExport}
        onImport={handleImport}
        onExportImage={handleExportImage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'model': return '#DA7756';
                case 'provider': return '#6B7FD7';
                case 'tool': return '#4CAF50';
                case 'blank': return '#9CA3AF';
                case 'section': return 'rgba(0,0,0,0.1)';
                default: return '#888';
              }
            }}
          />
          <Background variant="dots" gap={20} size={1} />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <TargetIcon size={48} />
            </div>
            <div className="empty-state-title">No nodes yet</div>
            <div className="empty-state-text">
              Click the buttons in the sidebar to add AI models, providers, and CLI tools to your canvas.
            </div>
          </div>
        )}
      </div>

      {modalType && (
        <NodeModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSave={handleSaveNode}
        />
      )}

      {editingNode && (
        <EditNodeModal
          node={editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleUpdateNode}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onEdit={() => {
            setEditingNode(contextMenu.node);
            setContextMenu(null);
          }}
          onDuplicate={() => handleDuplicateNode(contextMenu.node)}
          onHighlightConnected={() => handleHighlightConnected(contextMenu.node.id)}
          onToggleStar={() => handleToggleStar(contextMenu.node.id)}
          onDelete={() => handleDeleteNode(contextMenu.node.id)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {detailNode && (
        <DetailPopup
          node={detailNode}
          onClose={() => setDetailNode(null)}
          onSave={handleDetailSave}
        />
      )}
    </>
  );
}

export default App;
