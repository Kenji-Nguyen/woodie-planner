# Furniture Cut List Calculator - Requirements Document

## Project Overview

A web-based tool to help calculate cut lists for wood furniture (initially cabinets), optimize cutting patterns from available stock, and visualize the cutting layout.

---

## Core Features

### 1. Cabinet Calculator

- **Input**: Cabinet dimensions (Width × Depth × Height) in millimeters
- **Material Selection**: Choose plywood thickness (12mm, 15mm, 18mm)
- **Construction Method**: Option to select construction style (can be added later as advanced feature)
  - Initially support simple butt joints
  - Future: flush edges, custom methods
- **Back Panel**: Toggle option to include/exclude back panel
- **Output**: Automatic generation of cut list with piece names, dimensions, and quantities

**Example Output:**

```
Cabinet: 800mm (W) × 500mm (D) × 1000mm (H) - 18mm thickness
- Top: 800 × 500mm (qty: 1)
- Bottom: 800 × 500mm (qty: 1)
- Left Side: 500 × 964mm (qty: 1)
- Right Side: 500 × 964mm (qty: 1)
- Back: 764 × 964mm (qty: 1)
```

### 2. Stock Inventory Management

- **Add Stock**: Input available wood pieces (Length × Width in mm)
- **View Inventory**: Display all available stock pieces
- **Edit/Delete**: Manage stock pieces
- **Persistence**: Save inventory to localStorage

### 3. Cut Optimization

- **Match Pieces to Stock**: Determine which pieces can be cut from available inventory
- **Optimization Modes**:
  - Minimize waste (best material utilization)
  - Simplest cuts (easiest to execute, fewer saw operations)
- **Algorithm**: 2D bin packing using guillotine cuts
- **Output**:
  - Visual layout showing where to cut
  - Cut sequence (numbered steps)
  - Waste percentage
  - List of which pieces come from which stock

### 4. Visual Layout

- **Display**: Interactive canvas showing cut layouts
- **Features**:
  - Each piece shown as rectangle with dimensions labeled
  - Color coding for different cabinet parts
  - Cut lines clearly marked
  - Cut sequence numbers
  - Scale controls to zoom/fit screen
- **Export**: Ability to view/download cutting diagrams

---

## Technical Requirements

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Visualization**: react-konva (Canvas-based rendering)
- **Data Persistence**: localStorage
- **Algorithm Libraries**:
  - Option 1: `binpackingjs` (npm package)
  - Option 2: `stock-cutting` by ccorcos (TypeScript)
  - Option 3: Custom implementation of First-Fit Decreasing or MAXRECTS

### Architecture

```
/app
  /page.tsx                      # Landing/home page
  /cabinet-calculator/
    /page.tsx                    # Main calculator page
  /layout.tsx

/components
  /CabinetForm.tsx               # Input form for cabinet dimensions
  /CutList.tsx                   # Display generated cut list (table)
  /StockInventory.tsx            # Manage available wood stock
  /StockForm.tsx                 # Add new stock pieces
  /CutVisualizer.tsx             # Canvas visualization (react-konva)
  /OptimizationResults.tsx       # Show optimization results
  /OptimizationSettings.tsx      # Settings for optimization mode

/lib
  /cabinet-generator.ts          # Core logic: generate pieces from dimensions
  /bin-packer.ts                 # Bin packing algorithm integration
  /optimizer.ts                  # Optimization logic wrapper
  /stock-matcher.ts              # Match pieces to stock inventory
  /types.ts                      # TypeScript type definitions
  /utils.ts                      # Helper functions

/store
  /cabinet-store.ts              # Zustand store for cabinet state
  /stock-store.ts                # Zustand store for inventory
```

---

## Functional Specifications

### Construction Logic (Initial - Butt Joint)

For a cabinet with dimensions W × D × H and thickness T:

**Standard 5-piece cabinet:**

- Top: W × D (qty: 1)
- Bottom: W × D (qty: 1)
- Left Side: D × (H - 2T) (qty: 1)
- Right Side: D × (H - 2T) (qty: 1)
- Back: (W - 2T) × (H - 2T) (qty: 1)

**Note**: Construction method option can be added later to support different joint types.

### Data Models

```typescript
interface CabinetConfig {
  width: number; // mm
  depth: number; // mm
  height: number; // mm
  thickness: number; // 12, 15, or 18 mm
  includeBack: boolean;
  constructionMethod?: "butt-joint" | "flush-edges" | "custom";
}

interface CutPiece {
  id: string;
  name: string; // "Top", "Left Side", etc.
  width: number; // mm
  height: number; // mm
  quantity: number;
  category: "top" | "bottom" | "side" | "back" | "shelf";
}

interface StockPiece {
  id: string;
  width: number; // mm
  height: number; // mm
  available: boolean; // false if fully used
}

interface CutLayout {
  stockPieceId: string;
  cuts: PlacedPiece[];
  wastePercentage: number;
}

interface PlacedPiece {
  cutPieceId: string;
  x: number; // position on stock
  y: number; // position on stock
  width: number;
  height: number;
  rotated: boolean; // if piece was rotated 90°
  cutSequence: number; // order of cuts
}
```

### Algorithm Requirements

**2D Bin Packing with Guillotine Cuts:**

- Input: List of rectangular pieces to cut, list of available stock
- Constraint: Guillotine cuts only (straight edge-to-edge cuts)
- Optimization goal: Configurable (minimize waste OR simplify cuts)
- Output: Placement coordinates for each piece on stock
- Performance: Should handle ~50 pieces in < 2 seconds

**Key Considerations:**

- No rotation initially (grain direction not considered)
- No kerf (saw blade width) compensation needed initially
- Fixed orientations (no 45° cuts)
- Rectangular pieces only (no complex shapes)

---

## Out of Scope (Future Enhancements)

### Not Required for Initial Version:

- ❌ Shelves (adjustable or fixed) - Advanced feature for later
- ❌ Doors and drawers - Can be added later
- ❌ Edge banding tracking - Not needed initially
- ❌ Kerf (saw blade width) calculation - Can add later if needed
- ❌ Wood grain direction - Not considered initially
- ❌ Mixed thickness in same cabinet - Single thickness per project
- ❌ Leftover/scrap management - Not tracking remainders initially
- ❌ Cabinet presets/templates - Can add common sizes later
- ❌ Multi-user support - Single user, localStorage only
- ❌ Cloud sync/sharing - Local only for now
- ❌ PDF export - Visual display only initially (can add later)

### Potential Future Features:

- Multiple cabinets in one project
- Hardware calculations (hinges, handles, etc.)
- Cost estimation
- Shopping list generation (if stock insufficient)
- Import from CAD files
- Mobile app version
- Print-friendly cut diagrams
- Integration with online wood suppliers

---

## User Workflows

### Workflow A: "Can I build this cabinet?"

1. User enters cabinet dimensions (W × D × H)
2. User selects material thickness
3. System generates cut list
4. User inputs available stock pieces
5. System runs optimization
6. User sees visual layout + cut sequence
7. User can adjust optimization settings if needed

### Workflow B: "What do I need to buy?"

1. User enters cabinet dimensions (W × D × H)
2. User selects material thickness
3. System generates cut list
4. System shows total material needed
5. User can see optimal sheet sizes to purchase

---

## UI/UX Requirements

### Design Principles:

- **Clean and minimal** - Focus on functionality
- **Mobile-friendly** - Responsive design
- **Instant feedback** - Real-time calculations
- **Clear visualizations** - Easy to understand cut layouts
- **Professional** - Suitable for woodworking shops

### Key Screens:

**1. Cabinet Input Form**

- Large, clear input fields for dimensions
- Dropdown for thickness selection
- Checkbox for "include back panel"
- "Generate Cut List" button
- Real-time validation (positive numbers, realistic sizes)

**2. Cut List Display**

- Clean table with columns: Part Name | Dimensions | Quantity
- Summary: Total pieces, total area needed
- Edit/modify options
- "Add to Stock Matcher" button

**3. Stock Inventory**

- List of available stock pieces
- "Add Stock" button
- Each stock piece shows: dimensions, available/used status
- Delete/edit options

**4. Optimization Results**

- Side-by-side: Canvas visualization + Settings panel
- Canvas shows:
  - Stock pieces as large rectangles
  - Cut pieces as colored rectangles with labels
  - Dimensions displayed on each piece
  - Cut sequence numbers
  - Zoom/pan controls
- Settings panel:
  - Optimization mode toggle (waste vs simple)
  - Waste percentage display
  - "Re-optimize" button
  - List of cuts with details

---

## Performance Requirements

- Page load: < 2 seconds
- Cut list generation: Instant (< 100ms)
- Optimization calculation: < 3 seconds for typical projects
- Visualization rendering: < 500ms
- Smooth interactions: 60fps for canvas interactions

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## Development Phases

### Phase 1: Foundation (MVP)

**Goal**: Basic cabinet calculator with cut list generation

**Deliverables:**

- Next.js project setup
- Cabinet input form
- Cut list generator logic (butt joint construction)
- Display cut list as table
- Material thickness selection (12/15/18mm)

**Estimated Time**: 1 week

### Phase 2: Visualization

**Goal**: Visual representation of cut pieces

**Deliverables:**

- Integrate react-konva
- Display pieces as rectangles with dimensions
- Color coding for different parts
- Scale/zoom controls
- Basic layout (non-optimized placement)

**Estimated Time**: 1 week

### Phase 3: Stock Management

**Goal**: Inventory tracking and persistence

**Deliverables:**

- Stock input form
- Inventory list display
- localStorage integration
- CRUD operations for stock
- Stock state management (Zustand)

**Estimated Time**: 1 week

### Phase 4: Optimization

**Goal**: Intelligent cutting pattern generation

**Deliverables:**

- Integrate bin packing algorithm
- Match pieces to stock
- Show optimized layouts on stock
- Display waste percentage
- Cut sequence numbering
- Optimization mode settings

**Estimated Time**: 1-2 weeks

### Phase 5: Polish & Testing

**Goal**: Production-ready application

**Deliverables:**

- Responsive design refinements
- Error handling and validation
- User testing and feedback
- Performance optimization
- Documentation

**Estimated Time**: 1 week

---

## Open Questions / Decisions Needed

1. **Algorithm Selection**: Which library/implementation for bin packing?

   - `binpackingjs` (simple, proven)
   - `stock-cutting` (TypeScript, woodworking-focused)
   - Custom implementation (more control, more work)

2. **Construction Method**: Should we support multiple construction methods in Phase 1, or add later?

   - Recommendation: Start with butt joints only, add options later

3. **Rotation**: Allow pieces to be rotated 90° for better optimization?

   - Initial: No rotation (simpler)
   - Future: Add rotation toggle

4. **Units**: Support both mm and inches, or mm only?

   - Recommendation: mm only initially, add unit conversion later

5. **Export Format**: What format for saving/sharing projects?
   - Phase 1: localStorage (JSON)
   - Future: PDF export, sharing links

---

## Success Criteria

### Minimum Viable Product (MVP):

✅ User can input cabinet dimensions and get accurate cut list  
✅ User can see visual representation of pieces  
✅ User can add stock inventory  
✅ System can optimize cuts and show layout  
✅ Application is responsive and works on desktop browsers

### Stretch Goals:

⭐ Support for multiple cabinets in one project  
⭐ Print-friendly cut diagrams  
⭐ Cost estimation based on material prices  
⭐ Save/load projects  
⭐ Share projects via URL

---

## Technical Considerations

### Next.js 16 Specific:

- Use App Router (not Pages Router)
- Server components where appropriate
- Client components for interactive features (forms, canvas)
- Proper TypeScript setup with strict mode

### react-konva Integration:

- Requires webpack configuration in `next.config.js`:

```javascript
module.exports = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
};
```

- Use dynamic imports for canvas components (avoid SSR issues)

### State Management Strategy:

- **Zustand stores**:
  - `cabinet-store.ts` - Current cabinet config, generated cut list
  - `stock-store.ts` - Stock inventory, optimization results
- **localStorage sync** - Persist state automatically
- **Reset functionality** - Clear state for new projects

---

## Research References

### Algorithm Research:

- **2D Bin Packing Problem** - NP-hard optimization problem
- **Guillotine Cuts** - Constraint for realistic cutting patterns
- **First-Fit Decreasing (FFD)** - Simple, effective heuristic
- **MAXRECTS** - More sophisticated algorithm for better packing
- **Column Generation** - Advanced technique for large-scale problems

### JavaScript Libraries Found:

- `binpackingjs` - 2D/3D bin packing (tested, reliable)
- `bin-pack` (bryanburgers) - Simple binary tree algorithm
- `stock-cutting` (ccorcos) - TypeScript, woodworking-specific
- Jake Gordon's bin-packing - Educational, well-documented

### Visualization Options:

- **react-konva** ⭐ RECOMMENDED - Canvas-based, declarative React API
- **Fabric.js** - Feature-rich but heavier
- **Pure SVG** - Simple but more manual work
- **Pixi.js** - WebGL-based, overkill for this use case

### Existing Commercial Tools (for inspiration):

- CutList Plus (Windows, $90-500)
- MaxCut (commercial)
- Cut Optimizer (web-based)
- OptiCut (Python/web-based, open source)

---

## Glossary

- **Cabinet**: Box-like furniture piece with sides, top, bottom, and optionally back/shelves
- **Cut List**: List of all pieces needed with dimensions and quantities
- **Stock**: Raw material sheets/boards available for cutting
- **Bin Packing**: Algorithm problem of fitting rectangles into containers
- **Guillotine Cut**: Straight edge-to-edge cut across entire width/height
- **Kerf**: Width of material removed by saw blade (initially ignored)
- **Butt Joint**: Simple joint where pieces meet at right angles, edges touching
- **Grain Direction**: Orientation of wood fibers (initially ignored)
- **Waste**: Unused material after cutting (optimization target)

---

## Contact / Notes

**Project Type**: Web application (browser-based)  
**Target Users**: Woodworkers, furniture makers, DIY enthusiasts  
**Platform**: Desktop browsers (mobile support nice-to-have)  
**Deployment**: TBD (Vercel recommended for Next.js)

**Key Priorities**:

1. Accuracy of cut list calculations
2. Clear, useful visualizations
3. Fast, responsive user experience
4. Easy to understand and use

---

_Document Version: 1.0_  
_Last Updated: 2025-11-14_  
_Status: Requirements gathering complete, ready for development_
