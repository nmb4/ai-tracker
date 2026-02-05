# Project Todo List

Extracted features and improvements from brainstorming session (transkript.txt).

## Node Interactivity & Details
- [ ] **Detail Pop-up Cards**: Implement double-click action on nodes to open a pop-up card for detailed notes (e.g., usage descriptions, changelogs).
- [ ] **Context Menu - Highlight Connected**: Add a context menu option for nodes to "Highlight Connected".
    - [ ] Action should trace all connections and select/highlight related nodes (similar to Shift-drag selection).

## Visuals & Icons
- [ ] **Icon Styling Update**: 
    - [ ] Remove filled rounded rectangle backgrounds for icons.
    - [ ] Render icons as colored shapes directly on the note background for better visibility.
- [ ] **Divider Styling**: Change the separator line between Node Header and Fields to a **dashed line** (was solid) for a lighter visual weight.

## Node Content & Fields
- [ ] **Key-Value Field Styling**:
    - [ ] Layout: Field Name aligned Left, Value aligned Right (on the same line).
    - [ ] Typography: Field Names in ALL CAPS and slightly grayed out; Values in white normal text.
    - [ ] Visual Aid: Add a very subtle connecting line between Name and Value (color slightly lighter than background) to assist reading.

## Indicators & Metrics
- [ ] **Update Frequency/Freshness Indicator**:
    - [ ] Add visual indicator for Tools and Models showing "Last Updated" or "Update Frequency".
    - [ ] Implement visual decay over time (fading or color change, not the full node tho, only an indicator) to represent age.
- [ ] **Model Speed Indicator**:
    - [ ] Add a progress bar/visualizer for Model nodes to show speed.
    - [ ] Support manual value input (0-100) or TPS (Tokens Per Second).
- [ ] **Provider Payment Details**:
    - [ ] Add field for Payment Type: "Pay-per-token" vs "Subscription-based".
    - [ ] If Subscription: Add status indicator ("Active" vs "Inactive") and monthly price

## System Features
- [ ] **Import/Export**: Implement functionality to export the graph state to a file and import it back (extending current Local Storage persistence).
