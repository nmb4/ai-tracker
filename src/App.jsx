import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes';
import { Sidebar } from './components/Sidebar';
import { NodeModal } from './components/NodeModal';
import { EditNodeModal } from './components/EditNodeModal';
import { ContextMenu } from './components/ContextMenu';
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
    setNodes((nds) => [...nds, newNode]);
    setContextMenu(null);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
    }
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

  return (
    <>
      <Sidebar 
        nodes={nodes} 
        onAddNode={handleAddNode} 
        onClear={handleClear}
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
          onEdit={() => {
            setEditingNode(contextMenu.node);
            setContextMenu(null);
          }}
          onDuplicate={() => handleDuplicateNode(contextMenu.node)}
          onDelete={() => handleDeleteNode(contextMenu.node.id)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

export default App;
