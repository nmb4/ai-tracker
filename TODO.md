# Project Todo List

Extracted features and improvements from brainstorming session (transkript.txt).

## Node Interactivity & Details
- [x] **Detail Pop-up Cards**: Implement double-click action on nodes to open a pop-up card for detailed notes (e.g., usage descriptions, changelogs).
- [x] **Context Menu - Highlight Connected**: Add a context menu option for nodes to "Highlight Connected".
    - [x] Action should trace all connections and select/highlight related nodes (similar to Shift-drag selection).

## Visuals & Icons
- [x] **Icon Styling Update**: 
    - [x] Remove filled rounded rectangle backgrounds for icons.
    - [x] Render icons as colored shapes directly on the note background for better visibility.
- [x] **Divider Styling**: Change the separator line between Node Header and Fields to a **dashed line** (was solid) for a lighter visual weight.

## Node Content & Fields
- [x] **Key-Value Field Styling**:
    - [x] Layout: Field Name aligned Left, Value aligned Right (on the same line).
    - [x] Typography: Field Names in ALL CAPS and slightly grayed out; Values in white normal text.
    - [x] Visual Aid: Add a very subtle connecting line between Name and Value (color slightly lighter than background) to assist reading.

## Indicators & Metrics
- [x] **Update Frequency/Freshness Indicator**:
    - [x] Add visual indicator for Tools and Models showing "Last Updated" or "Update Frequency".
    - [x] Implement visual decay over time (fading or color change, not the full node tho, only an indicator) to represent age.
- [x] **Model Speed Indicator**:
    - [x] Add a progress bar/visualizer for Model nodes to show speed.
    - [x] Support manual value input (0-100) or TPS (Tokens Per Second).
- [x] **Provider Payment Details**:
    - [x] Add field for Payment Type: "Pay-per-token" vs "Subscription-based".
    - [x] If Subscription: Add status indicator ("Active" vs "Inactive") and monthly price

## System Features
- [x] **Import/Export**: Implement functionality to export the graph state to a file and import it back (extending current Local Storage persistence).
