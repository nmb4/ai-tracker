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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { domToPng } from 'modern-screenshot';

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

  // Save to localStorage and sanitize edges
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
    const connectedIds = new Set([nodeId]);
    let changed = true;
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

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: connectedIds.has(node.id),
      }))
    );
    
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

  const handleExportView = async () => {
    if (nodes.length === 0) return;

    const element = document.querySelector('.react-flow');
    if (!element) return;

    const bgColor = darkMode ? '#1A1A1A' : '#FAF9F7';

    // Hide controls temporarily
    const controls = element.querySelector('.react-flow__controls');
    const attribution = element.querySelector('.react-flow__attribution');
    const controlsDisplay = controls?.style?.display;
    const attributionDisplay = attribution?.style?.display;
    if (controls) controls.style.display = 'none';
    if (attribution) attribution.style.display = 'none';

    // Wait for next frame to ensure DOM is updated
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      const dataUrl = await domToPng(element, {
        backgroundColor: bgColor,
        scale: 3,
        // Don't use filter - just manually hide controls instead
      });

      const link = document.createElement('a');
      link.download = `ai-tracker-view-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export view failed:', err);
    } finally {
      // Restore controls
      if (controls) controls.style.display = controlsDisplay;
      if (attribution) attribution.style.display = attributionDisplay;
    }
  };

  const handleExportAll = async () => {
    if (nodes.length === 0) return;

    const nodesBounds = getNodesBounds(nodes);
    const element = document.querySelector('.react-flow');
    if (!element) return;

    const padding = 100;
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;
    const bgColor = darkMode ? '#1A1A1A' : '#FAF9F7';

    // Get viewport and store original transform
    const viewport = element.querySelector('.react-flow__viewport');
    const originalTransform = viewport?.style?.transform;

    // Hide controls
    const controls = element.querySelector('.react-flow__controls');
    const attribution = element.querySelector('.react-flow__attribution');
    const controlsDisplay = controls?.style?.display;
    const attributionDisplay = attribution?.style?.display;
    if (controls) controls.style.display = 'none';
    if (attribution) attribution.style.display = 'none';

    // Temporarily set transform to frame all nodes
    if (viewport) {
      viewport.style.transform = `translate(${-nodesBounds.x + padding}px, ${-nodesBounds.y + padding}px) scale(1)`;
    }

    // Wait for next frame
    await new Promise(resolve => requestAnimationFrame(resolve));

    try {
      const dataUrl = await domToPng(element, {
        backgroundColor: bgColor,
        width: width,
        height: height,
        scale: 3,
      });
      const link = document.createElement('a');
      link.download = `ai-tracker-full-canvas-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export all failed:', err);
    } finally {
      // Restore original transform and controls
      if (viewport) {
        viewport.style.transform = originalTransform;
      }
      if (controls) controls.style.display = controlsDisplay;
      if (attribution) attribution.style.display = attributionDisplay;
    }
  };

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  }, []);

  const onPaneClick = useCallback(() => setContextMenu(null), []);
  const onNodeDoubleClick = useCallback((event, node) => setDetailNode(node), []);

  const handleDetailSave = (nodeId, data) => {
    setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data } : node));
    setDetailNode(prev => prev && prev.id === nodeId ? { ...prev, data } : prev);
  };

  return (
    <>
      <Sidebar 
        nodes={nodes} 
        onAddNode={handleAddNode} 
        onExport={handleExport}
        onImport={handleImport}
        onExportView={handleExportView}
        onExportAll={handleExportAll}
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
          <Background variant="dots" gap={20} size={1} />
        </ReactFlow>
        {nodes.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><TargetIcon size={48} /></div>
            <div className="empty-state-title">No nodes yet</div>
            <div className="empty-state-text">Click the buttons in the sidebar to add AI models, providers, and CLI tools to your canvas.</div>
          </div>
        )}
      </div>
      {modalType && <NodeModal type={modalType} onClose={() => setModalType(null)} onSave={handleSaveNode} />}
      {editingNode && <EditNodeModal node={editingNode} onClose={() => setEditingNode(null)} onSave={handleUpdateNode} />}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onEdit={() => { setEditingNode(contextMenu.node); setContextMenu(null); }}
          onDuplicate={() => handleDuplicateNode(contextMenu.node)}
          onHighlightConnected={() => handleHighlightConnected(contextMenu.node.id)}
          onToggleStar={() => handleToggleStar(contextMenu.node.id)}
          onDelete={() => handleDeleteNode(contextMenu.node.id)}
          onClose={() => setContextMenu(null)}
        />
      )}
      {detailNode && <DetailPopup node={detailNode} onClose={() => setDetailNode(null)} onSave={handleDetailSave} />}
    </>
  );
}

export default App;
