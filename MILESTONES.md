# Furniture Cut List Calculator - Milestones & Tasks

## Project Status

**Current State**: ✅ Milestone 3 Complete! Visual canvas with color-coded pieces, zoom controls, and responsive design is functional.

**Key Decisions**:
- ✅ Bin Packing Library: `binpackingjs`
- ✅ Testing: Skip for MVP (focus on features)
- ✅ Deployment: Handle separately/later
- ✅ Rotation: Include in Milestone 4 for better optimization

**Timeline**: 5-6 weeks to production-ready MVP (Weeks 1-3 complete)

---

## Milestone 1: Foundation + Basic Calculator (Week 1)

**Goal**: User can input cabinet dimensions and see accurate cut list

### Tasks:

#### 1.1 Dependency Setup
- [x] Install zustand (state management)
- [x] Install react-konva + konva + @types/react-konva (visualization)
- [x] Install binpackingjs (bin packing algorithm)
- [x] Update next.config.ts with webpack configuration for react-konva (Canvas support)
- [x] Verify all dependencies install correctly

#### 1.2 Project Structure
- [x] Create `/components` directory
- [x] Create `/lib` directory
- [x] Create `/store` directory
- [x] Create `/app/cabinet-calculator` directory

#### 1.3 Type Definitions
- [x] Create `lib/types.ts` with all TypeScript interfaces:
  - CabinetConfig
  - CutPiece
  - StockPiece
  - CutLayout
  - PlacedPiece
  - Helper types

#### 1.4 Cabinet Calculation Logic
- [x] Build `lib/cabinet-generator.ts`:
  - Implement butt-joint construction calculations
  - Generate cut list from cabinet dimensions (W × D × H)
  - Handle thickness adjustments (12mm, 15mm, 18mm)
  - Support optional back panel
  - Edge case handling
- [x] Build `lib/utils.ts` for helper functions:
  - Dimension formatters
  - Area calculations
  - Validation helpers

#### 1.5 State Management
- [x] Create `store/cabinet-store.ts` (Zustand):
  - Cabinet configuration state
  - Generated cut list state
  - Actions: `setCabinetConfig`, `generateCutList`, `resetCabinet`
  - State persistence logic

#### 1.6 UI Components - Cabinet Form
- [x] Build `components/CabinetForm.tsx`:
  - Input fields for width, depth, height (mm)
  - Material thickness dropdown (12/15/18mm)
  - "Include back panel" checkbox
  - Input validation (positive numbers, realistic sizes: 100-5000mm)
  - "Generate Cut List" button
  - Error messages and user feedback
  - Responsive design

#### 1.7 UI Components - Cut List Display
- [x] Build `components/CutList.tsx`:
  - Table display with columns: Part Name | Dimensions | Quantity
  - Summary section: total pieces, total area needed
  - Clean, readable table design with Tailwind styling
  - Empty state (no cut list generated yet)
  - Responsive table design

#### 1.8 Cabinet Calculator Page
- [x] Create `app/cabinet-calculator/page.tsx`:
  - Page layout structure
  - Integrate CabinetForm component
  - Integrate CutList component
  - Wire up Zustand store connections
  - Page metadata and SEO

#### 1.9 Landing Page Update
- [x] Update `app/page.tsx`:
  - Project description and value proposition
  - Feature highlights
  - Call-to-action link to `/cabinet-calculator`
  - Clean, professional design
  - Remove default Next.js boilerplate

### Deliverable: ✅ Working calculator that generates accurate cut lists from cabinet dimensions

---

## Milestone 2: Stock Management (Week 2)

**Goal**: User can manage stock inventory with localStorage persistence

### Tasks:

#### 2.1 Stock State Management
- [x] Create `store/stock-store.ts` (Zustand):
  - Stock inventory array state
  - Actions: `addStock`, `removeStock`, `updateStock`, `clearStock`
  - localStorage persistence middleware
  - Load from localStorage on initialization
  - Handle localStorage errors gracefully

#### 2.2 Stock Form Component
- [x] Build `components/StockForm.tsx`:
  - Input fields for width × height (mm)
  - "Add Stock" button
  - Validation (positive numbers, realistic sizes)
  - Clear form after successful submission
  - Success feedback message
  - Error handling and display

#### 2.3 Stock Inventory Component
- [x] Build `components/StockInventory.tsx`:
  - List all stock pieces with cards/rows
  - Display: dimensions, available/used status, ID
  - Edit button (inline editing or modal)
  - Delete button with confirmation dialog
  - "Clear All Stock" button with confirmation
  - Empty state message ("No stock pieces yet")
  - Count of total stock pieces

#### 2.4 Integration
- [x] Add stock management section to cabinet calculator page
- [x] Connect StockForm to Zustand store
- [x] Connect StockInventory to Zustand store
- [x] Test localStorage persistence:
  - Add stock pieces
  - Refresh page
  - Verify data persists

#### 2.5 UI/UX Polish
- [x] Responsive design for stock components (mobile, tablet, desktop)
- [x] Loading states (if needed)
- [x] Success/error feedback messages with toast or alerts
- [x] Keyboard accessibility (Tab navigation, Enter to submit)
- [x] Focus management
- [x] Visual polish (spacing, colors, borders)

### Deliverable: ✅ Full CRUD stock management with localStorage persistence

---

## Milestone 3: Visualization (Week 3)

**Goal**: User can see visual representations of cut pieces on canvas

### Tasks:

#### 3.1 Konva Setup
- [x] Create `components/CutVisualizer.tsx` base component
- [x] Set up Stage and Layer (react-konva primitives)
- [x] Handle responsive canvas sizing (fit parent container)
- [x] Configure canvas dimensions and scaling
- [x] Test basic rendering with simple shapes
- [x] Handle SSR issues (dynamic import if needed)

#### 3.2 Piece Rendering
- [x] Create rectangle components for pieces using react-konva
- [x] Add dimension labels to each piece (Text components)
- [x] Implement color coding system:
  - Top/Bottom: #3B82F6 (blue)
  - Sides: #10B981 (green)
  - Back: #F59E0B (amber)
  - Future shelves: #8B5CF6 (purple)
- [x] Add piece borders and shadows
- [x] Handle text sizing based on piece dimensions

#### 3.3 Layout Engine (Non-optimized)
- [x] Build `lib/layout-helper.ts`:
  - Simple grid layout algorithm (temporary, pre-optimization)
  - Arrange pieces in rows for visual preview
  - Calculate positions (x, y) for each piece
  - Add spacing between pieces
  - Center layout on canvas

#### 3.4 Canvas Controls
- [x] Zoom in button (+)
- [x] Zoom out button (-)
- [x] Fit to screen button (reset zoom)
- [x] Pan/drag canvas support (drag background)
- [x] Reset view button
- [x] Display current zoom level
- [x] Zoom limits (min/max)

#### 3.5 Visual Polish
- [x] Piece borders and styling (stroke, shadow)
- [x] Readable dimension text:
  - Font size based on zoom level
  - Contrast with background
  - Abbreviate if needed (e.g., "800×500")
- [x] Grid or background pattern (optional)
- [x] Legend showing color meanings
- [x] Canvas background color

#### 3.6 Integration
- [x] Connect CutVisualizer to cabinet store
- [x] Update visualization automatically when cut list changes
- [x] Add to cabinet calculator page layout (side-by-side with forms)
- [x] Handle empty state (no pieces to visualize)
- [x] Loading state during rendering

### Deliverable: ✅ Visual canvas showing cut pieces with zoom/pan controls and color-coded parts

---

## Milestone 4: Cut Optimization (Weeks 4-5)

**Goal**: User can optimize cuts with rotation, see layouts on stock, view waste metrics

### Tasks:

#### 4.1 Bin Packing Integration
- [ ] Create `lib/bin-packer.ts`:
  - Wrap binpackingjs library API
  - Implement TypeScript types/interfaces for library
  - Handle rotation (90° piece rotation for better packing)
  - Convert library output to PlacedPiece objects
  - Calculate positions (x, y) for each placed piece
  - Handle pieces that don't fit
  - Add error handling

#### 4.2 Stock Matching Logic
- [ ] Build `lib/stock-matcher.ts`:
  - Match cut pieces to stock inventory
  - Try packing pieces into each stock piece
  - Track which pieces fit on which stock
  - Calculate waste percentage per stock piece
  - Return unmatched pieces (if any)
  - Prioritize stock usage intelligently

#### 4.3 Optimization Engine
- [ ] Build `lib/optimizer.ts`:
  - Implement two optimization modes:
    - **Minimize waste**: Best material utilization (pack tightly)
    - **Simplify cuts**: Fewer cut operations, easier execution
  - Generate CutLayout objects for each stock piece
  - Calculate cut sequences (guillotine cut order)
  - Implement cut sequencing algorithm
  - Handle edge cases (no stock, oversized pieces)
  - Performance optimization (<3 seconds for typical projects)

#### 4.4 Optimization State
- [ ] Update `store/stock-store.ts`:
  - Add `optimizationResults` state (array of CutLayout)
  - Add `optimizationMode` state ('minimize-waste' | 'simplify-cuts')
  - Add `unmatchedPieces` state (pieces that don't fit)
  - Actions: `runOptimization`, `setOptimizationMode`, `clearOptimization`
  - Handle optimization loading state

#### 4.5 Optimization Settings Component
- [ ] Build `components/OptimizationSettings.tsx`:
  - Radio buttons: "Minimize Waste" vs "Simplify Cuts"
  - Description of each mode
  - "Run Optimization" button (prominent CTA)
  - Display total waste percentage
  - Show pieces that don't fit (if any) with warning
  - Loading spinner during optimization
  - Success message after optimization

#### 4.6 Optimization Results Component
- [ ] Build `components/OptimizationResults.tsx`:
  - List of stock pieces used (cards or table)
  - For each stock display:
    - Stock dimensions
    - Pieces placed (count and list)
    - Waste percentage (with color coding)
    - Waste area (mm²)
  - Cut sequence details (numbered list)
  - Summary section:
    - Total waste across all stock
    - Total pieces placed
    - Stock pieces used (count)
  - Empty state (no optimization run yet)

#### 4.7 Update Visualizer for Optimization
- [ ] Enhance `components/CutVisualizer.tsx`:
  - Show stock pieces as large background rectangles
  - Show cut pieces positioned on stock (optimized layout)
  - Display cut sequence numbers on pieces (badges)
  - Show waste areas (different color/hatched pattern)
  - Add toggle: "Preview Mode" vs "Optimized Layout"
  - Support multiple stock pieces (tabs or scrollable)
  - Show which stock piece is currently displayed
  - Highlight pieces on hover
  - Show piece details tooltip on hover

#### 4.8 Integration & Testing
- [ ] Wire optimization to UI:
  - Connect "Run Optimization" button
  - Update visualizer when optimization runs
  - Show optimization results component
  - Handle edge cases:
    - No stock available (show warning)
    - Pieces too large for stock (show error)
    - No cabinet defined (disable button)
- [ ] Test various scenarios:
  - Small cabinet with large stock (high waste)
  - Large cabinet with small stock (pieces don't fit)
  - Multiple stock pieces required
  - Tight fit scenarios (low waste)
- [ ] Verify waste calculations are accurate
- [ ] Test rotation feature thoroughly (90° rotations)
- [ ] Performance testing (ensure <3s optimization time)

### Deliverable: ✅ Full optimization with rotation, visual layouts on stock, waste metrics, cut sequences

---

## Milestone 5: Polish & Production Ready (Week 6)

**Goal**: Production-ready, polished application ready for real-world use

### Tasks:

#### 5.1 Responsive Design
- [ ] Mobile layout adjustments:
  - Stack forms and visualizer vertically
  - Adjust canvas size for mobile screens
  - Touch-friendly buttons (larger tap targets)
  - Optimize table displays for narrow screens
- [ ] Tablet breakpoint optimizations (768px - 1024px)
- [ ] Desktop optimizations (1024px+)
- [ ] Test on multiple screen sizes (320px - 2560px)
- [ ] Test on actual devices (phone, tablet)

#### 5.2 Error Handling
- [ ] Input validation improvements:
  - Min values (e.g., 100mm)
  - Max values (e.g., 5000mm)
  - Realistic cabinet dimensions
  - Prevent negative numbers
  - Decimal precision (0 or 2 decimal places)
- [ ] Error boundaries for React components
- [ ] Graceful handling of localStorage errors:
  - Quota exceeded
  - Private browsing mode
  - Corrupted data
- [ ] User-friendly error messages (clear, actionable)
- [ ] Error toast/alert system

#### 5.3 Loading States & Feedback
- [ ] Loading spinner for optimization (if >500ms)
- [ ] Success notifications:
  - Stock piece added
  - Optimization complete
  - Cut list generated
- [ ] Progress indicators where appropriate
- [ ] Disabled states during operations (prevent double-clicks)
- [ ] Button loading states (spinner + "Processing...")

#### 5.4 Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support:
  - Tab through all controls
  - Enter to submit forms
  - Escape to close modals
  - Arrow keys for canvas zoom (optional)
- [ ] Focus management (visible focus indicators)
- [ ] Screen reader testing:
  - Announce dynamic content changes
  - Proper heading hierarchy
  - Form labels and descriptions
- [ ] Color contrast verification (WCAG AA):
  - Text vs backgrounds
  - Button states
  - Canvas piece colors

#### 5.5 Performance Optimization
- [ ] React optimizations:
  - Memoization for expensive calculations (React.memo, useMemo)
  - useCallback for event handlers
  - Avoid unnecessary re-renders
- [ ] Lazy loading for heavy components (CutVisualizer)
- [ ] Debounce input handlers (form inputs)
- [ ] Optimize canvas rendering:
  - Avoid re-rendering entire canvas on minor changes
  - Use Konva layer caching
  - Optimize large stock piece counts
- [ ] Bundle size analysis (next bundle-analyzer)
- [ ] Lighthouse performance audit (aim for 90+ score)

#### 5.6 UX Refinements
- [ ] Onboarding hints/tooltips:
  - First-time user help
  - Tooltips on complex features
  - "?" info icons with explanations
- [ ] Empty states:
  - No cut list generated (show guide)
  - No stock pieces (prompt to add)
  - No optimization results (prompt to run)
- [ ] Confirmation dialogs:
  - Delete stock piece
  - Clear all stock
  - Reset cabinet configuration
- [ ] Undo/reset functionality:
  - Reset cabinet form
  - Clear optimization
  - Reset stock to previous state (optional)
- [ ] Help text and explanations:
  - What is "butt joint construction"?
  - What does "minimize waste" mean?
  - How to read the cut sequence

#### 5.7 Documentation
- [ ] Update README.md with:
  - Project description and purpose
  - Screenshots of key features
  - Installation instructions (npm/pnpm/yarn)
  - Usage guide (step-by-step)
  - Development setup (local dev, building)
  - Technology stack
  - Project structure overview
  - Contributing guidelines (if open source)
  - License
- [ ] Inline code comments:
  - Complex algorithms (bin packing, optimization)
  - Non-obvious logic
  - Magic numbers explained
- [ ] JSDoc comments:
  - All public functions
  - Parameters and return types
  - Usage examples for key functions

#### 5.8 Final Testing
- [ ] Cross-browser testing:
  - Chrome (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest 2 versions)
- [ ] User acceptance testing:
  - Real woodworking scenarios
  - Test with actual cabinet dimensions
  - Verify cut lists are accurate
  - Validate optimization results
- [ ] Bug fixes from testing
- [ ] Performance verification:
  - Page load < 2 seconds
  - Cut list generation < 100ms
  - Optimization < 3 seconds
  - Canvas rendering < 500ms
  - Smooth 60fps interactions
- [ ] Final QA checklist review

### Deliverable: ✅ Production-ready application with excellent UX, ready for deployment

---

## Success Metrics

### Technical Success:
- ✅ Cut list calculations are mathematically accurate
- ✅ Optimization completes in < 3 seconds for typical projects (20-50 pieces)
- ✅ Canvas renders smoothly at 60fps
- ✅ Works on all major browsers
- ✅ Mobile responsive (320px - 2560px)
- ✅ Lighthouse score 90+ (Performance, Accessibility)

### User Success:
- ✅ User can create accurate cut list in < 2 minutes
- ✅ User can visualize cuts clearly
- ✅ User understands optimization results
- ✅ User can manage stock inventory easily
- ✅ User finds interface intuitive (minimal learning curve)

### Business Success:
- ✅ MVP ready for beta testing with real woodworkers
- ✅ Codebase maintainable and extensible for future features
- ✅ No critical bugs or blockers
- ✅ Ready for deployment to production

---

## Future Enhancements (Post-MVP)

### Phase 2 Features (Prioritized):
1. **Shelves and Dividers**: Add internal shelves to cabinets
2. **Multiple Cabinets**: Manage multiple cabinets in one project
3. **Save/Load Projects**: Export/import project JSON
4. **PDF Export**: Print-friendly cut diagrams
5. **Material Cost Estimation**: Calculate costs based on material prices
6. **Kerf Compensation**: Account for saw blade width
7. **Grain Direction**: Consider wood grain in optimization
8. **Cabinet Templates**: Pre-defined common cabinet sizes
9. **Edge Banding**: Track edge banding requirements
10. **Shopping List**: Auto-generate material shopping list

### Nice-to-Have Features:
- Hardware calculator (hinges, screws, handles)
- Integration with wood suppliers
- Mobile app version
- Multi-user/cloud sync
- Advanced joint types (dado, rabbet, etc.)
- 3D visualization (Three.js)
- CNC machine integration (G-code export)

---

## Notes & Considerations

### Algorithm Choice Rationale:
- **binpackingjs**: Simple, proven, well-documented. Good for MVP. Can swap later if needed.
- Rotation included from start for better optimization results.
- Guillotine cuts constraint makes implementation realistic for woodworking.

### State Management Rationale:
- **Zustand**: Lightweight, simple API, great TypeScript support, no boilerplate.
- Separate stores (cabinet vs stock) for better separation of concerns.
- localStorage middleware for persistence without complexity.

### Visualization Rationale:
- **react-konva**: Declarative React API for Canvas, performant, good for 2D layouts.
- Better than pure SVG for complex layouts with many pieces.
- Easier to add interactivity (hover, click, drag) than raw Canvas API.

### Testing Strategy:
- Manual testing prioritized for MVP (per user preference).
- Focus on real-world scenarios with actual cabinet dimensions.
- Cross-browser testing is critical for production readiness.

---

## Risk Mitigation

### Potential Risks:

1. **Bin Packing Performance**: If binpackingjs is slow with many pieces
   - **Mitigation**: Optimize early, add loading states, consider Web Workers if needed

2. **Canvas Performance**: Large stock pieces or many pieces may cause lag
   - **Mitigation**: Konva layer caching, limit zoom levels, lazy rendering

3. **Complexity Creep**: Feature requests may expand scope beyond MVP
   - **Mitigation**: Strict adherence to milestone plan, defer features to Phase 2

4. **Browser Compatibility**: Canvas/Konva may have browser-specific issues
   - **Mitigation**: Test early and often across browsers, polyfills if needed

5. **localStorage Limits**: Large projects may exceed 5MB quota
   - **Mitigation**: Data compression, warn user of storage limits, offer export/import

---

**Document Version**: 1.0
**Created**: 2025-11-14
**Status**: Ready to execute Milestone 1

**Next Step**: Begin Milestone 1, Task 1.1 (Dependency Setup)
