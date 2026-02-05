# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Tracker is a React-based visual tool for tracking and organizing AI models, providers, and CLI tools. It uses React Flow for interactive node-based diagrams with an Anthropic-inspired design aesthetic.

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Build Tool**: Vite 7.x
- **Framework**: React 19.x with hooks
- **Visualization**: @xyflow/react (React Flow 12.x)
- **Export**: html-to-image for PNG exports
- **Linting**: ESLint 9.x with flat config

### Directory Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Main app with React Flow canvas, state management
├── index.css             # Global styles (largest file, ~1200 lines)
├── nodes/                # Node type components for React Flow
│   ├── index.js          # Node type exports registry
│   ├── ModelNode.jsx     # AI model nodes (speed, freshness indicators)
│   ├── ProviderNode.jsx  # Service provider nodes
│   ├── ToolNode.jsx      # CLI tool nodes
│   ├── BlankNode.jsx     # Custom notes with dynamic fields
│   └── SectionNode.jsx   # Grouping zones (resizable, zIndex: -1)
├── components/           # UI components
│   ├── Sidebar.jsx       # Left sidebar for adding nodes
│   ├── NodeModal.jsx     # Node creation modal
│   ├── EditNodeModal.jsx # Node editing modal
│   ├── DetailPopup.jsx   # Double-click detail view
│   ├── ContextMenu.jsx   # Right-click menu
│   ├── Icons.jsx         # SVG icon components
│   ├── SpeedIndicator.jsx
│   └── FreshnessIndicator.jsx
└── utils/
    ├── freshness.js      # Age calculation logic
    └── speed.js          # Speed label mapping
```

### Key Architectural Patterns

**Node System**: Five node types registered in `src/nodes/index.js`. Each node is a React component wrapped with `memo()` for performance. Nodes support:
- Connection handles (source/target)
- Custom data properties (name, version, tags, etc.)
- Freshness indicators (color-coded age based on `lastUpdated`)
- Speed indicators (visual progress bars for TPS values)
- Starred state

**State Management**: Uses React Flow's `useNodesState` and `useEdgesState` hooks in `App.jsx`. All state changes flow through callbacks defined in App.

**Persistence**: LocalStorage with keys `ai-tracker-data` (nodes/edges) and `ai-tracker-theme` (dark mode). Auto-saves on state changes.

**Theming**: CSS custom properties in `index.css` with `data-theme` attribute. Light mode: warm beige (#FAF9F7), dark mode: deep charcoal (#1A1A1A).

**Export System**: Two export modes using `html-to-image` at 3x pixel density:
- `handleExportView`: Current viewport only
- `handleExportAll`: Full canvas bounds using `getNodesBounds()`

### Data Flow

1. **Adding Nodes**: Sidebar → `handleAddNode` → modal opens → `handleSaveNode` creates node with random position
2. **Editing**: Double-click or context menu → `EditNodeModal` → `handleUpdateNode`
3. **Connections**: React Flow's `onConnect` → `addEdge` with animated edges
4. **Context Menu**: Right-click on node → `ContextMenu` with edit/duplicate/highlight/star/delete actions
5. **Highlight Connected**: Recursive edge traversal from selected node, marks all connected nodes/edges as selected

### Node Data Schema

All nodes have:
- `id`, `type`, `position`, `data` (object)

Common data fields:
- `name`, `tags` (array), `notes`
- `starred` (boolean)
- `lastUpdated` (ISO date string)
- `showFreshness` (boolean, default true)
- `decayThreshold` (number, days)

Type-specific fields:
- **Model**: `provider`, `version`, `context`, `speed`, `tps`
- **Provider**: `paymentType` ('pay-per-token' | 'subscription'), `website`
- **Tool**: `command`, `install`, `docs`
- **Blank**: `fields` (array of {label, value}), `richText`
- **Section**: `label`, `width`, `height`

### Styling Conventions

- CSS classes use kebab-case
- Node types have specific icon colors: model (orange), provider (blue), tool (green), blank (gray), section (purple)
- All property labels are UPPERCASE in the UI
- Dashed divider lines between sections
- Icons rendered directly on node backgrounds without bounding boxes
