# Woodie Planner - Furniture Cut List Calculator

A modern web application for woodworkers and furniture makers to calculate cut lists, manage stock inventory, and optimize cutting patterns for cabinet and furniture projects.

## Features

### Cabinet Calculator
- Input cabinet dimensions (Width × Depth × Height) in millimeters
- Select material thickness (12mm, 15mm, 18mm plywood)
- Optional back panel toggle
- Automatic generation of accurate cut lists with butt-joint construction
- Real-time validation and error handling

### Stock Inventory Management
- Add and manage available wood/plywood pieces
- Edit and delete stock items
- Persistent storage using browser localStorage
- Common sheet size references (4'×8', 5'×10')

### Cut Optimization
- Intelligent 2D bin packing algorithm (using binpackingjs)
- Two optimization modes:
  - **Minimize Waste**: Best material utilization with 90° rotation allowed
  - **Simplify Cuts**: Easier cutting patterns without rotation
- Real-time waste percentage calculation
- Automatic detection of insufficient stock
- Cut sequence numbering for execution order

### Visual Layout
- Interactive canvas-based visualization (react-konva)
- Zoom controls (in, out, reset, fit-to-screen)
- Color-coded pieces (top/bottom, sides, back)
- Dimension labels on each piece
- Cut sequence indicators
- Multiple stock piece navigation
- Responsive design for desktop and mobile

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Visualization**: react-konva (Canvas rendering)
- **Algorithm**: binpackingjs (2D bin packing)
- **Data Persistence**: localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd woodie-planner
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Usage Guide

### 1. Create a Cabinet Cut List

1. Navigate to the **Cabinet Calculator** page
2. Enter your cabinet dimensions:
   - **Width**: Cabinet width in mm (e.g., 800mm)
   - **Depth**: Cabinet depth in mm (e.g., 500mm)
   - **Height**: Cabinet height in mm (e.g., 1000mm)
3. Select **Material Thickness** (12mm, 15mm, or 18mm)
4. Toggle **Include back panel** if needed
5. Click **Generate Cut List**

The app will calculate all pieces needed with proper dimensions for butt-joint construction:
- Top and bottom pieces
- Left and right side pieces
- Optional back panel

### 2. Add Stock Inventory

1. Scroll to the **Stock Inventory** section
2. Enter the dimensions of your available plywood/wood sheets:
   - **Width** (mm)
   - **Height** (mm)
3. Click **Add Stock Piece**
4. Repeat for all available materials

**Common sheet sizes**:
- 1220×2440mm (4'×8')
- 1525×3050mm (5'×10')

### 3. Optimize Cutting Layout

1. Scroll to the **Cut Optimization & Visual Layout** section
2. Choose optimization mode:
   - **Minimize Waste**: Allows 90° rotation for tighter packing
   - **Simplify Cuts**: No rotation, cleaner layouts
3. Click **Run Optimization**

The visualizer will display:
- How pieces fit on your stock
- Waste percentage per stock piece
- Cut sequence numbers
- Rotated pieces (indicated with ↻)

### 4. Execute Cuts

1. View the optimized layout on the canvas
2. Follow the numbered cut sequence (1, 2, 3...)
3. Use zoom controls to examine details
4. Switch between multiple stock pieces using tabs

## Project Structure

```
woodie-planner/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── cabinet-calculator/       # Main calculator page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── CabinetForm.tsx           # Cabinet dimension input form
│   ├── CutList.tsx               # Display generated cut list
│   ├── CutVisualizer.tsx         # Canvas visualization
│   ├── StockForm.tsx             # Add stock pieces
│   ├── StockInventory.tsx        # Manage stock inventory
│   ├── OptimizationSettings.tsx  # Optimization controls
│   └── OptimizationResults.tsx   # Results display
├── lib/                          # Core business logic
│   ├── cabinet-generator.ts      # Generate pieces from dimensions
│   ├── bin-packer.ts             # Bin packing algorithm wrapper
│   ├── optimizer.ts              # Optimization logic
│   ├── stock-matcher.ts          # Match pieces to stock
│   ├── layout-helper.ts          # Visual layout utilities
│   ├── utils.ts                  # Helper functions
│   └── types.ts                  # TypeScript type definitions
├── store/                        # Zustand state management
│   ├── cabinet-store.ts          # Cabinet state
│   └── stock-store.ts            # Stock & optimization state
└── public/                       # Static assets
```

## Key Design Decisions

### Construction Method
- Currently supports **butt-joint** construction only
- Top and bottom span full width
- Sides fit between top and bottom
- Back fits inside all four sides
- Thickness adjustments are automatic

### Optimization Algorithm
- Uses **binpackingjs** library for 2D bin packing
- Implements guillotine cuts (straight edge-to-edge)
- Supports 90° rotation in minimize-waste mode
- First-Fit Decreasing heuristic for placement

### Data Persistence
- All data stored in browser localStorage
- No server-side storage or authentication
- Data persists across browser sessions
- Limited by 5MB localStorage quota

## Future Enhancements

Potential features for future versions:
- [ ] Multiple cabinets in one project
- [ ] Adjustable shelves and dividers
- [ ] Doors and drawer calculations
- [ ] Edge banding tracking
- [ ] Kerf (saw blade width) compensation
- [ ] Wood grain direction consideration
- [ ] Cabinet templates/presets
- [ ] PDF export of cut diagrams
- [ ] Material cost estimation
- [ ] Shopping list generation
- [ ] Cloud sync and project sharing

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Optimized for desktop but fully responsive for tablet and mobile devices.

## Contributing

This is currently a personal project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **binpackingjs** - 2D/3D bin packing algorithm library
- **react-konva** - React components for Konva canvas library
- **Zustand** - Lightweight state management
- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework

## Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with** ❤️ **for woodworkers and makers**
