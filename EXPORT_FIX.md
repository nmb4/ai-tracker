# Fix for Missing Connections in Exported Images

## Problem
When exporting the React Flow canvas to PNG images, the edge connections (lines between nodes) were not appearing in the exported images, even though they were clearly visible on screen.

## Root Cause
The edge connections in React Flow are rendered as SVG elements. Several popular DOM-to-image libraries have issues capturing SVG elements correctly, especially when using the `filter` option to exclude certain elements (like controls).

## Libraries That Did NOT Work

### 1. `html-to-image` (original)
- **Version tested:** 1.11.13
- **Issues:**
  - Filter function filters out SVG edges unintentionally
  - Cannot handle React Flow's SVG edge structure properly
  - SVG elements are lost during the clone/serialization process

### 2. `dom-to-image-more`
- **Version tested:** Latest
- **Issues:**
  - Similar SVG handling problems
  - Edges still not captured despite working with the actual DOM

### 3. `html2canvas-pro`
- **Version tested:** Latest
- **Issues:**
  - Does not render the full export correctly
  - Incomplete rendering of the canvas
  - Poor support for modern React SVG structures

## Solution: `modern-screenshot`

**Library:** `modern-screenshot`
**Version:** Latest

This library properly handles SVG elements and doesn't suffer from the filter issues that affected the other libraries.

### Implementation

```javascript
import { domToPng } from 'modern-screenshot';

const handleExportView = async () => {
  if (nodes.length === 0) return;

  const element = document.querySelector('.react-flow');
  if (!element) return;

  const bgColor = darkMode ? '#1A1A1A' : '#FAF9F7';

  // Hide controls temporarily (manual approach)
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
      // Do NOT use filter - it causes SVG edges to be lost
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
      // Do NOT use filter - it causes SVG edges to be lost
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
```

## Key Insights

1. **Avoid `filter` option:** The filter function in most libraries causes SVG elements to be excluded from the capture, even when the filter is only targeting specific elements like controls.

2. **Manual control hiding:** Instead of using `filter`, manually hide controls by setting `style.display = 'none'` before capture and restoring after.

3. **`requestAnimationFrame`:** Always wait for the DOM to update after making style changes before capturing.

4. **React Flow DOM structure:** The edges are SVG paths inside a `<div class="react-flow__edges">` which contains a `<svg>` element. The edges are represented as `<g>` elements with `<path>` children.

## Installation

```bash
npm install modern-screenshot
```

## References

- [modern-screenshot documentation](https://github.com/qq15725/modern-screenshot)
- React Flow edge structure: Edges are SVG `<path>` elements inside a `<svg>` container with class `react-flow__edges`
