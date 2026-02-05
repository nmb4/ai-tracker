# AI Tracker

A visual tool for tracking and organizing AI models, providers, and CLI tools using interactive node-based diagrams.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![React Flow](https://img.shields.io/badge/React_Flow-12-FF0072)

## Features

- **Visual Node-Based Interface** — Drag, drop, and connect nodes to map your AI infrastructure
- **5 Node Types** — Models, Providers, CLI Tools, Custom Notes, and Grouping Sections
- **Smart Indicators** — Freshness badges show how current your data is; speed bars visualize TPS
- **Relationship Mapping** — Connect nodes to show dependencies and relationships
- **Export Options** — Save as JSON for backup or PNG for sharing
- **Dark Mode** — Toggle between warm beige and deep charcoal themes
- **Persistent Storage** — Auto-saves to localStorage

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Adding Nodes
Click any button in the left sidebar to add a new node to the canvas.

### Editing
Double-click a node to open the detail view, or right-click for the context menu.

### Connecting
Drag from one node's handle to another to create connections.

### Exporting
Use the export buttons in the top-right to save your work as JSON or PNG.

## Node Types

| Type | Purpose | Key Fields |
|------|---------|------------|
| **Model** | AI models | Provider, Version, Context, TPS |
| **Provider** | API services | Payment type, Pricing, Status |
| **Tool** | CLI tools | Command, Install, Version |
| **Blank** | Custom notes | Dynamic fields, Rich text |
| **Section** | Grouping zones | Resizable boundaries |

## Tech Stack

- **Framework:** React 19 with hooks
- **Build Tool:** Vite 7
- **Visualization:** React Flow 12
- **Export:** html-to-image, modern-screenshot
- **Styling:** CSS custom properties with data-theme switching
