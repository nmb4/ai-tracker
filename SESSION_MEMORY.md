# AI Tracker - Session Memory & Summary

## 🚀 Project Essence
We built a highly functional, visual AI & Agent tool tracker using **React Flow**. The application allows for mapping out an AI stack (Models, Providers, CLI Tools) with a design language strictly inspired by **Anthropic (Claude.ai)**—clean, minimal, sophisticated, and professional.

## 🎨 Design Philosophy
- **Anthropic Aesthetic**: Warm beige/cream backgrounds in light mode, deep charcoal grays in dark mode.
- **Iconography**: Clean SVG line icons rendered directly on the node backgrounds (no bounding boxes) with specific color coding per node type.
- **Typography**: Professional 'Inter' font stack, all-caps labels for property names, and clear visual hierarchy.
- **Lightweight Visuals**: Use of dashed lines for dividers and section boundaries to keep the canvas feeling "breathable" even with high density.

## 🛠️ Technical Highlights
- **Dynamic Node System**:
    - **Models**: Includes speed indicators (visual progress bars) with mapping to descriptive levels (e.g., "Crazy Fast" for 100%+ values).
    - **Providers**: Specialized fields for payment types (Pay-per-token vs Subscription) with visual badges.
    - **Freshness Indicator**: A "smart" decay system. Nodes show age via color-coded dots (Green → Red). Features include manual date setting and per-node custom decay thresholds (e.g., a "freshness limit" in days).
    - **Custom Notes**: Flexible nodes with dynamic field creation (label/value pairs) and rich text notes.
    - **Resizable Sections**: Low-zIndex "zones" for grouping nodes (e.g., Active vs Inactive), supporting custom labels and resizing.
- **Advanced UX**:
    - **Connection Highlighting**: Recursive tracing of all connected nodes via the context menu.
    - **Detail Pop-ups**: Double-click functionality to open deep-dive views for changelogs and extended properties.
    - **Persistence**: Hybrid approach with transparent Local Storage saving and manual JSON Import/Export.
    - **High-Res Export**: Custom logic using `html-to-image` at 3x pixel density, supporting both current view and "full-bounds" capture.

## 🤝 Workflow Essence (Teamwork)
The success of this project was driven by a highly **iterative and feedback-loop-driven approach**:
1.  **Iterative Refinement**: Instead of a "big bang" implementation, we built features one-by-one, allowing for styling corrections (like the dashed line frequency and icon alignment) in real-time.
2.  **Clear Visual Targets**: Using a specific reference (Anthropic) allowed for immediate alignment on UI decisions.
3.  **Proactive Problem Solving**: When issues arose (e.g., SVG rendering bugs or off-screen export problems), we identified the root cause and implemented robust technical fixes (e.g., 3x resolution, automated bounds calculation).
4.  **Balance of Manual/Automatic**: We shifted from hardcoded logic (like decay rates) to user-configurable settings based on the realization that "one size doesn't fit all."

## 📌 Future Reference for the AI
- **Prefer Function Calls**: For file operations, strictly use `write` and `edit` tools rather than bash `cat` or `sed`.
- **Aesthetic Priority**: Always default to clean, high-contrast, professional typography and subtle micro-interactions.
- **Performance**: High-resolution exports (3x pixel ratio) should be a standard for canvas-based apps.
- **User-Centric Flexibility**: Allow the user to toggle automatic indicators (like freshness) on a per-instance basis.

---
*Created on February 5, 2026, marking a successful 0-to-1 build of the AI Tool Tracker.*
