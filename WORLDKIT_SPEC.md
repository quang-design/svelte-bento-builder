# WorldKit — Product Spec & Implementation Plan

> From bento builder to infinite canvas for building worlds.

---

## 1. Vision

WorldKit is an infinite-canvas tool where anyone can drag, drop, and connect _anything_ — links, images, videos, PDFs, 3D objects, code snippets, live web components, notes, forms — to build a **world**: a visual, spatial, interactive document that lives somewhere between are.na, Figma, a spreadsheet, and a circuit board.

A world is not a page. It has no fixed edges. Items can overlap, nest, connect, and behave. It is the native document format for the AI era — designed to be authored by humans, agents, or both.

---

## 2. Core Concepts

| Concept | Definition |
|---|---|
| **World** | An infinite 2D canvas containing nodes, connections, and spatial layout. The top-level document. |
| **Node** | Any item placed on the canvas. Has a position, size, type, and content. Nodes are the atoms of a world. |
| **Connection** | A visible or logical link between two nodes. Can carry data, represent a relationship, or just be a visual line. |
| **Region** | A named rectangular area that groups nodes. Like a frame in Figma or a section in a document. |
| **Viewport** | The user's current view into the infinite canvas — position + zoom level. |
| **Palette** | The sidebar/panel for browsing, searching, and dragging new nodes onto the canvas. |

---

## 3. Node Types

### 3.1 Content Nodes

| Type | Description | Render |
|---|---|---|
| `text` | Rich text block (markdown) | Rendered markdown with inline editing |
| `heading` | Large display text | Editable heading |
| `image` | Raster image (png, jpg, webp, gif) | `<img>` with fit modes (cover/contain/original) |
| `video` | Video file or embed (mp4, webm, YouTube, Vimeo) | `<video>` or iframe player |
| `audio` | Audio file or embed | Waveform player |
| `pdf` | PDF document | Page-by-page viewer with scroll |
| `link` | URL bookmark | Open-graph preview card (title, image, description) |
| `embed` | Generic iframe embed | Sandboxed `<iframe>` |
| `file` | Any file (download reference) | Icon + filename + size |
| `code` | Code snippet with syntax highlighting | Monaco / CodeMirror editor |
| `3d` | 3D model (glTF, GLB, OBJ) | Three.js / model-viewer |
| `animation` | Lottie / Rive / CSS animation | Respective runtime |
| `book` | Multi-page document (epub-like) | Paginated reader |

### 3.2 Functional Nodes

| Type | Description |
|---|---|
| `button` | Clickable button — triggers an action or navigates |
| `input` | Text input field — stores a value on the node |
| `form` | Group of inputs with a submit action |
| `toggle` | Boolean switch |
| `slider` | Numeric range input |
| `dropdown` | Select from options |
| `timer` | Countdown / stopwatch |
| `counter` | Increment/decrement number |
| `webhook` | Sends/receives HTTP requests |
| `llm-prompt` | Sends content to an LLM and displays the response |

### 3.3 Layout Nodes

| Type | Description |
|---|---|
| `region` | A named frame/group that contains other nodes |
| `stack` | Auto-layout container (horizontal or vertical) |
| `grid` | CSS-grid sub-layout within the canvas |
| `divider` | Visual separator line |
| `spacer` | Invisible spacing block |

### 3.4 Data Nodes

| Type | Description |
|---|---|
| `table` | Spreadsheet-like data grid |
| `chart` | Visualization (bar, line, pie, scatter) fed by a table or JSON |
| `json` | Raw JSON viewer/editor |
| `database` | Collection of records with schema — queryable |

---

## 4. Canvas System

### 4.1 Infinite Canvas

Replace the current fixed CSS Grid with a true infinite canvas:

- **Coordinate system**: World coordinates in pixels. Origin (0,0) at center of initial viewport.
- **Viewport**: Pan (middle-click drag, two-finger drag, space+drag) and zoom (scroll wheel, pinch).
- **Zoom range**: 5% – 3200%.
- **Rendering**: Only render nodes within the current viewport + a buffer margin. Virtualize off-screen nodes.
- **Background**: Optional dot grid, line grid, or blank. Configurable density and color.
- **Minimap**: Small overview of the entire world in a corner, showing viewport position.

### 4.2 Spatial Layout

- Nodes have **absolute positions** (x, y) in world coordinates and **dimensions** (width, height) in pixels.
- **Snap to grid**: Optional. Configurable grid size (8px, 16px, 32px, etc.).
- **Smart guides**: Show alignment lines when moving/resizing near other nodes.
- **Collision**: Nodes can overlap freely. Z-order controlled by layer index.

### 4.3 Node Interactions

| Action | Trigger |
|---|---|
| Select | Click |
| Multi-select | Shift+click, or drag-select rectangle |
| Move | Drag selected node(s) |
| Resize | Drag corner/edge handles |
| Edit content | Double-click |
| Context menu | Right-click |
| Connect | Drag from connection port on node edge |
| Drop from outside | Drop file/URL from OS or palette |

---

## 5. Connections

Connections are first-class objects drawn between nodes.

- **Ports**: Each node exposes ports on its edges (top, right, bottom, left, or custom positions).
- **Wire rendering**: Bézier curves, straight lines, or step (right-angle) paths. User-configurable.
- **Data flow**: A connection can pass a value from an output port to an input port (e.g., a slider's value → a text node's font size).
- **Labels**: Connections can have a text label displayed on the wire.
- **Selection & deletion**: Click to select, delete key to remove.

---

## 6. Persistence & Data Model

### 6.1 World Document Schema (v1)

```typescript
interface World {
  id: string;               // uuid
  name: string;
  description?: string;
  createdAt: string;         // ISO 8601
  updatedAt: string;
  viewport: { x: number; y: number; zoom: number };
  background: {
    type: 'dots' | 'lines' | 'blank';
    color?: string;
    spacing?: number;
  };
  nodes: Node[];
  connections: Connection[];
  regions: Region[];
  metadata: Record<string, unknown>;
}

interface Node {
  id: string;                // uuid
  type: NodeType;            // union of all types from Section 3
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation?: number;         // degrees
  opacity?: number;          // 0-1
  locked?: boolean;
  visible?: boolean;
  style?: NodeStyle;
  content: NodeContent;      // type-specific payload
  ports?: Port[];
  metadata?: Record<string, unknown>;
}

interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
  style?: 'bezier' | 'straight' | 'step';
  label?: string;
  color?: string;
  animated?: boolean;
}

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  collapsed?: boolean;
}

interface NodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: string;
  padding?: number;
}

interface Port {
  id: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;          // 0-1 position along that side
  direction: 'in' | 'out' | 'both';
  dataType?: string;        // for type-checking connections
}
```

### 6.2 Storage Strategy

| Phase | Storage | Details |
|---|---|---|
| Phase 1 | **localStorage + IndexedDB** | JSON for world metadata in localStorage. Binary assets (images, files) in IndexedDB. |
| Phase 2 | **File-system** | Export/import as `.world` files (zip containing JSON + assets). |
| Phase 3 | **Cloud sync** | Supabase or equivalent. Real-time collaboration via CRDT (Yjs). |

---

## 7. AI & Agent Integration

### 7.1 AI-Assisted Authoring

- **Generate nodes**: "Add 5 images of brutalist architecture" → agent searches, creates image nodes.
- **Layout suggestions**: "Arrange these nodes in a timeline" → agent repositions nodes.
- **Content fill**: "Summarize this PDF into bullet points" → creates text node with summary.
- **Connection inference**: "Connect related concepts" → agent analyzes content and draws connections.

### 7.2 Agent Protocol

Agents interact with a world through a structured tool-call interface:

```typescript
interface WorldAgentTools {
  addNode(params: Partial<Node>): Node;
  updateNode(id: string, params: Partial<Node>): Node;
  removeNode(id: string): void;
  addConnection(from: string, to: string, opts?: Partial<Connection>): Connection;
  removeConnection(id: string): void;
  queryNodes(filter: { type?: NodeType; contains?: string; near?: { x: number; y: number; radius: number } }): Node[];
  getViewport(): Viewport;
  setViewport(v: Partial<Viewport>): void;
  exportRegion(regionId: string, format: 'png' | 'pdf' | 'json'): Blob;
}
```

### 7.3 LLM Node

A special node type that:
1. Takes input from connected nodes (text, data, images).
2. Sends a prompt to a configurable LLM (OpenAI, Anthropic, local).
3. Streams the response into its output port or displays it inline.
4. Can be chained: output of one LLM node → input of another.

---

## 8. Import / Export

| Format | Import | Export |
|---|---|---|
| `.world` (native) | Yes | Yes |
| PNG / JPG | Drop onto canvas | Export viewport or selection |
| PDF | Drop → PDF viewer node | Export world as PDF |
| SVG | Drop → image node | Export world as SVG |
| JSON | Drop → JSON node or load world | Export world data |
| Markdown | Drop → text node | Export all text nodes |
| HTML | Drop → embed node | Export world as static site |
| URL | Drop or paste → link node | Share world via URL |
| Figma (clipboard) | Paste → recreate layout | — |
| CSV / TSV | Drop → table node | Export table nodes |

---

## 9. Implementation Phases

### Phase 1 — Infinite Canvas Foundation (Weeks 1-3)

**Goal**: Replace fixed grid with a pannable, zoomable infinite canvas. Migrate existing nodes.

| Task | Details |
|---|---|
| 1.1 Canvas engine | Create `<InfiniteCanvas>` component with pan/zoom via CSS transforms on a world-container div. Track viewport state (x, y, zoom). |
| 1.2 Coordinate system | World coords ↔ screen coords conversion utilities. All nodes positioned absolutely in world space. |
| 1.3 Node container | Create `<CanvasNode>` wrapper that positions any node type at (x, y) with (width, height). Replace CSS Grid placement. |
| 1.4 Drag to move | Port existing drag logic to work in world coordinates. Account for zoom level in delta calculations. |
| 1.5 Resize handles | Port existing resize logic. Handles visible on select/hover. |
| 1.6 Selection system | Click to select, shift+click multi-select, rubber-band drag-select. Selection state as a Set of node IDs. |
| 1.7 Background grid | Render dot/line grid pattern that scales with zoom. Use CSS `background-image` with `repeating-linear-gradient` or SVG pattern. |
| 1.8 Minimap | Small canvas in the corner rendering all nodes as colored rectangles. Click to navigate. |
| 1.9 Migrate data model | Replace `GridItem` with `Node`. Replace col/row/span with x/y/width/height. Update persistence. |
| 1.10 Keyboard shortcuts | Space+drag to pan. Cmd+0 to reset zoom. Delete to remove. Cmd+A to select all. Arrow keys to nudge. |

**Key files to create/modify:**
- `src/lib/components/infinite-canvas.svelte` (new)
- `src/lib/components/canvas-node.svelte` (new, replaces bento-card)
- `src/lib/canvas/viewport.ts` (new — pan/zoom math)
- `src/lib/canvas/coordinates.ts` (new — world↔screen conversion)
- `src/lib/canvas/selection.ts` (new — selection state management)
- `src/lib/types/world.ts` (new — replaces bento.ts)
- `src/routes/+page.svelte` (rewrite)

---

### Phase 2 — Rich Node Types (Weeks 4-6)

**Goal**: Support all content node types. Build the node renderer registry.

| Task | Details |
|---|---|
| 2.1 Node type registry | A map from `NodeType` → Svelte component. Each node type is a standalone component that receives `NodeContent` as props. |
| 2.2 Text node | Markdown editing with [Tiptap](https://tiptap.dev/) or [Milkdown](https://milkdown.dev/). Rich text, headings, lists, inline code. |
| 2.3 Image node | Paste, drop, or upload. Fit modes. Lightbox on double-click. Lazy loading. |
| 2.4 Video node | File upload or URL embed. Custom player controls. Thumbnail preview when paused. |
| 2.5 Link node | Paste URL → fetch Open Graph data server-side → render preview card. |
| 2.6 PDF node | [PDF.js](https://mozilla.github.io/pdf.js/) based renderer. Page navigation. |
| 2.7 Code node | [CodeMirror 6](https://codemirror.net/) with language detection and syntax highlighting. |
| 2.8 Embed node | Sandboxed iframe. URL input. Resize-aware. |
| 2.9 File node | Generic file drop → store in IndexedDB → show icon + name. Download on click. |
| 2.10 3D node | [model-viewer](https://modelviewer.dev/) web component for GLB/glTF. Orbit controls inside the node. |
| 2.11 Audio node | Waveform visualization with [wavesurfer.js](https://wavesurfer.xyz/). Play/pause/seek. |

**Key files to create:**
- `src/lib/nodes/` directory with one `.svelte` file per node type
- `src/lib/nodes/registry.ts` — type → component map
- `src/lib/nodes/node-renderer.svelte` — dynamic renderer using registry

---

### Phase 3 — Connections & Ports (Weeks 7-8)

**Goal**: Nodes can be connected with visible wires. Connections carry data.

| Task | Details |
|---|---|
| 3.1 Port rendering | Render small circles on node edges. Show on hover/select. Configurable per node type. |
| 3.2 Wire drawing | Drag from port → draw temporary wire → drop on another port to create connection. SVG overlay layer for wires. |
| 3.3 Wire routing | Bézier curve math for smooth paths. Control points derived from port positions and directions. |
| 3.4 Connection state | Store connections in world state. Reactive updates when nodes move. |
| 3.5 Data flow | When a source node's output changes, propagate value to connected input nodes. Topological sort to determine evaluation order. Cycle detection. |
| 3.6 Wire interaction | Click to select wire. Delete key to remove. Hover to highlight connected nodes. |

**Key files:**
- `src/lib/connections/port.svelte`
- `src/lib/connections/wire.svelte`
- `src/lib/connections/wire-layer.svelte` (SVG overlay)
- `src/lib/connections/data-flow.ts` (graph evaluation engine)

---

### Phase 4 — Palette, Drag-from-Outside & Commands (Weeks 9-10)

**Goal**: Sidebar palette for browsing/adding nodes. OS file drop. Command palette.

| Task | Details |
|---|---|
| 4.1 Palette panel | Slide-out sidebar listing all node types grouped by category. Search/filter. |
| 4.2 Drag from palette | Drag a node type from palette onto canvas → create node at drop position. |
| 4.3 OS file drop | Handle `dragover`/`drop` events on canvas. Detect file type → create appropriate node. Upload to IndexedDB. |
| 4.4 URL drop/paste | Detect URL in paste or drop → create link node → fetch OG data. |
| 4.5 Clipboard paste | Handle `Cmd+V`. Detect content type (image, text, URL, files) and create nodes. |
| 4.6 Command palette | `Cmd+K` opens a searchable command list. Actions: add node, change background, export, zoom to fit, etc. |
| 4.7 Context menu | Right-click on canvas → "Add node here". Right-click on node → type-specific actions (duplicate, lock, change type, etc.). |

**Key files:**
- `src/lib/components/palette.svelte`
- `src/lib/components/command-palette.svelte`
- `src/lib/components/context-menu.svelte`
- `src/lib/canvas/drop-handler.ts`
- `src/lib/canvas/clipboard.ts`

---

### Phase 5 — Functional Nodes & Interactions (Weeks 11-12)

**Goal**: Interactive/functional node types. Build the "circuit board" capability.

| Task | Details |
|---|---|
| 5.1 Button node | Configurable label + action (navigate URL, trigger connected nodes, run JS snippet). |
| 5.2 Input / form nodes | Text input, dropdown, toggle, slider. Each stores a value and exposes it via output port. |
| 5.3 Timer / counter | Functional state nodes. Timer emits on interval. Counter increments on trigger. |
| 5.4 Webhook node | Configure URL + method + headers. Fires on trigger. Response displayed or passed to output port. |
| 5.5 LLM node | Prompt template with variable slots. Connected inputs fill slots. Calls LLM API. Streams response. |
| 5.6 Table node | Spreadsheet grid with formula support (basic). Import from CSV. Expose rows/cells via ports. |
| 5.7 Chart node | Takes data from table/JSON node via connection. Renders chart with [Chart.js](https://www.chartjs.org/) or [Observable Plot](https://observablehq.com/plot/). |

**Key files:**
- `src/lib/nodes/functional/` directory
- `src/lib/nodes/data/` directory
- `src/lib/engine/evaluation.ts` — node evaluation engine

---

### Phase 6 — Persistence, Undo & Collaboration (Weeks 13-15)

**Goal**: Save/load worlds. Undo/redo. Prepare for multiplayer.

| Task | Details |
|---|---|
| 6.1 Auto-save | Debounced save to localStorage/IndexedDB on every state change. |
| 6.2 World file format | `.world` = zip containing `world.json` + `assets/` folder. Export and import. |
| 6.3 Undo/redo | Command pattern. Every state mutation is a reversible command pushed to a history stack. `Cmd+Z` / `Cmd+Shift+Z`. |
| 6.4 World browser | Home screen listing saved worlds. Thumbnail preview. Create / duplicate / delete. |
| 6.5 Version snapshots | Manual "save version" that creates a named snapshot. Browse and restore. |
| 6.6 CRDT foundation | Integrate [Yjs](https://yjs.dev/) for shared document state. Each node and connection is a Y.Map inside a Y.Array. |
| 6.7 Real-time sync | WebSocket provider for Yjs. Multiple cursors. Presence indicators. |

**Key files:**
- `src/lib/persistence/local-store.ts`
- `src/lib/persistence/world-file.ts`
- `src/lib/persistence/undo.ts`
- `src/lib/collaboration/yjs-provider.ts`
- `src/routes/+page.svelte` (world browser home)
- `src/routes/world/[id]/+page.svelte` (individual world editor)

---

### Phase 7 — AI & Agent Layer (Weeks 16-18)

**Goal**: LLM-powered features. Agent tool interface. Natural language commands.

| Task | Details |
|---|---|
| 7.1 Agent SDK | Implement `WorldAgentTools` interface (Section 7.2). Expose as a JS API that agents can call. |
| 7.2 Natural language bar | Chat-style input: "arrange these in a grid", "summarize the PDFs", "connect all images to the mood board". Parse intent → call agent tools. |
| 7.3 Auto-layout | Algorithms: force-directed, grid pack, timeline, radial. Agent or user triggers layout on selection. |
| 7.4 Content generation | "Fill this region with X" → agent creates nodes with generated/fetched content. |
| 7.5 Smart connections | Analyze node contents → suggest or auto-create connections based on semantic similarity. |
| 7.6 MCP server | Expose WorldKit as an [MCP](https://modelcontextprotocol.io/) server so external AI tools can read/write worlds. |

**Key files:**
- `src/lib/agent/tools.ts`
- `src/lib/agent/natural-language.ts`
- `src/lib/agent/layout-algorithms.ts`
- `src/lib/agent/mcp-server.ts`

---

### Phase 8 — Polish, Performance & Publish (Weeks 19-21)

| Task | Details |
|---|---|
| 8.1 Virtualization | Only render nodes in viewport. Use spatial index (R-tree) for fast viewport queries. |
| 8.2 Asset optimization | Thumbnail generation for images/videos. Progressive loading. Lazy load heavy node types (3D, PDF). |
| 8.3 Keyboard accessibility | Full keyboard navigation. Tab between nodes. Enter to edit. Escape to deselect. |
| 8.4 Mobile/touch | Touch-optimized pan/zoom. Touch-friendly resize handles. Mobile palette. |
| 8.5 Theming | Light/dark/custom themes. Per-world theme overrides. |
| 8.6 Export as site | Export a world as a standalone static HTML page with embedded assets. |
| 8.7 Share via URL | Generate a shareable link. View-only or editable. |
| 8.8 PWA | Service worker for offline. Install as app. |

---

## 10. Tech Stack Additions

| Concern | Library | Reason |
|---|---|---|
| Rich text editing | Tiptap 2 / ProseMirror | Best rich-text editor for Svelte; extensible |
| Code editing | CodeMirror 6 | Lightweight, fast, great language support |
| PDF rendering | PDF.js | Mozilla's PDF renderer, battle-tested |
| 3D rendering | `<model-viewer>` | Google's web component, zero-config for GLB |
| Charts | Observable Plot or Chart.js | Simple, declarative charting |
| Spatial index | rbush | Fast R-tree for viewport culling |
| CRDT collaboration | Yjs + y-websocket | Industry standard for real-time collab |
| File compression | fflate | Fast zip/unzip for .world files |
| Waveform audio | wavesurfer.js | Audio visualization |
| Drag & drop | Native HTML5 DnD API | No library needed; supplement with pointer events |
| UUID generation | `crypto.randomUUID()` | Built into browsers, no dependency |
| OG data fetching | SvelteKit server route | Server-side fetch to avoid CORS |

---

## 11. File Architecture (Target)

```
src/
├── app.css
├── app.html
├── lib/
│   ├── canvas/
│   │   ├── infinite-canvas.svelte       # Pan/zoom container
│   │   ├── canvas-node.svelte           # Node wrapper (position, resize, select)
│   │   ├── viewport.ts                  # Viewport state & math
│   │   ├── coordinates.ts              # World ↔ screen conversion
│   │   ├── selection.ts                # Multi-select state
│   │   ├── drop-handler.ts             # File/URL drop handling
│   │   ├── clipboard.ts               # Paste handling
│   │   ├── background.svelte           # Grid/dot background pattern
│   │   ├── minimap.svelte              # Overview minimap
│   │   └── snap.ts                     # Snap-to-grid & smart guides
│   ├── nodes/
│   │   ├── registry.ts                 # NodeType → Component map
│   │   ├── node-renderer.svelte        # Dynamic node renderer
│   │   ├── content/
│   │   │   ├── text-node.svelte
│   │   │   ├── image-node.svelte
│   │   │   ├── video-node.svelte
│   │   │   ├── audio-node.svelte
│   │   │   ├── pdf-node.svelte
│   │   │   ├── link-node.svelte
│   │   │   ├── code-node.svelte
│   │   │   ├── embed-node.svelte
│   │   │   ├── file-node.svelte
│   │   │   ├── 3d-node.svelte
│   │   │   └── animation-node.svelte
│   │   ├── functional/
│   │   │   ├── button-node.svelte
│   │   │   ├── input-node.svelte
│   │   │   ├── form-node.svelte
│   │   │   ├── toggle-node.svelte
│   │   │   ├── slider-node.svelte
│   │   │   ├── webhook-node.svelte
│   │   │   └── llm-node.svelte
│   │   ├── data/
│   │   │   ├── table-node.svelte
│   │   │   ├── chart-node.svelte
│   │   │   ├── json-node.svelte
│   │   │   └── database-node.svelte
│   │   └── layout/
│   │       ├── region-node.svelte
│   │       ├── stack-node.svelte
│   │       └── grid-node.svelte
│   ├── connections/
│   │   ├── port.svelte
│   │   ├── wire.svelte
│   │   ├── wire-layer.svelte
│   │   └── data-flow.ts
│   ├── persistence/
│   │   ├── local-store.ts
│   │   ├── world-file.ts
│   │   └── undo.ts
│   ├── collaboration/
│   │   └── yjs-provider.ts
│   ├── agent/
│   │   ├── tools.ts
│   │   ├── natural-language.ts
│   │   ├── layout-algorithms.ts
│   │   └── mcp-server.ts
│   ├── components/
│   │   ├── nav-bar.svelte
│   │   ├── palette.svelte
│   │   ├── command-palette.svelte
│   │   ├── context-menu.svelte
│   │   ├── toolbar.svelte
│   │   └── world-browser.svelte
│   └── types/
│       └── world.ts                    # All TypeScript interfaces
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte                    # World browser (home)
│   ├── world/
│   │   └── [id]/
│   │       └── +page.svelte            # World editor
│   └── api/
│       ├── og/+server.ts              # Open Graph data fetcher
│       └── ai/+server.ts             # LLM proxy endpoint
```

---

## 12. Migration Path from Current Codebase

The existing bento builder is not thrown away — it is evolved:

| Current | Becomes |
|---|---|
| `bento-grid.svelte` | `infinite-canvas.svelte` — fixed grid → infinite canvas |
| `bento-card.svelte` | `canvas-node.svelte` — grid-positioned card → absolutely-positioned node |
| `bento-grid-lines.svelte` | `background.svelte` — grid overlay → infinite dot/line pattern |
| `nav-bar.svelte` | `toolbar.svelte` + `palette.svelte` — settings bar → contextual toolbar + node palette |
| `GridItem` type | `Node` type — col/row/span → x/y/width/height |
| `bento.ts` types | `world.ts` — expanded type system |
| `+page.svelte` state | Split into world browser (home) + world editor (world/[id]) |
| Drag/resize logic | Ported to world-coordinate system with zoom-awareness |
| Responsive reflow | Removed (infinite canvas doesn't reflow — it zooms) |

**Step-by-step migration:**
1. Create `world.ts` types alongside existing `bento.ts`.
2. Build `infinite-canvas.svelte` as a new route (`/world/[id]`).
3. Port drag/resize logic from `bento-card.svelte` → `canvas-node.svelte`, adjusting for world coordinates.
4. Keep the bento grid working at `/` as a legacy view during migration.
5. Once canvas is stable, convert the home page to the world browser.
6. Remove old bento components.

---

## 13. Design Principles

1. **Everything is a node.** If it exists in a world, it's a node with a position, size, and type. No special cases.
2. **Drop anything.** Any file, URL, or clipboard content should become the right kind of node automatically.
3. **Connect everything.** Any node can connect to any other. Connections can be visual or carry data.
4. **Agents are first-class.** The AI can do anything the human can do, through the same tool interface.
5. **Local-first.** Works offline. Your data lives on your device. Cloud sync is opt-in.
6. **Performance by default.** Virtualize. Lazy-load. Only render what's visible.
7. **Composable.** Worlds can embed other worlds. Nodes can contain sub-canvases.

---

_This is a living document. Update it as the project evolves._
