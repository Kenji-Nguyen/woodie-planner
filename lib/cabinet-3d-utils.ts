import { CabinetConfig, PieceCategory } from "./types";

/**
 * Represents a 3D panel with position and dimensions
 */
export interface Panel3D {
  category: PieceCategory;
  name: string;
  position: [number, number, number]; // [x, y, z] in mm
  dimensions: [number, number, number]; // [width, height, depth] in mm
  color: string;
}

/**
 * Color mapping for different panel categories
 * (Matching colors from CutVisualizer for consistency)
 */
export const PANEL_COLORS: Record<PieceCategory, string> = {
  top: "#3b82f6", // blue-500
  bottom: "#06b6d4", // cyan-500
  side: "#10b981", // emerald-500
  back: "#f59e0b", // amber-500
  shelf: "#8b5cf6", // violet-500
};

/**
 * Calculate 3D panel positions and dimensions for a cabinet
 * using butt-joint construction method
 *
 * Coordinate system:
 * - X axis: Width (left-right)
 * - Y axis: Height (bottom-top)
 * - Z axis: Depth (back-front)
 * - Origin: Center of cabinet
 *
 * @param config Cabinet configuration
 * @returns Array of Panel3D objects representing each panel
 */
export function calculatePanelPositions(config: CabinetConfig): Panel3D[] {
  const { width, depth, height, thickness, includeBack } = config;
  const panels: Panel3D[] = [];

  // Top panel: full width and depth, positioned at top
  // Center: (0, height/2 - thickness/2, 0)
  // Dimensions: width × thickness × depth
  panels.push({
    category: "top",
    name: "Top",
    position: [0, height / 2 - thickness / 2, 0],
    dimensions: [width, thickness, depth],
    color: PANEL_COLORS.top,
  });

  // Bottom panel: full width and depth, positioned at bottom
  // Center: (0, -height/2 + thickness/2, 0)
  // Dimensions: width × thickness × depth
  panels.push({
    category: "bottom",
    name: "Bottom",
    position: [0, -height / 2 + thickness / 2, 0],
    dimensions: [width, thickness, depth],
    color: PANEL_COLORS.bottom,
  });

  // Left side panel: fits between top and bottom
  // Center: (-width/2 + thickness/2, 0, 0)
  // Dimensions: thickness × (height - 2*thickness) × depth
  panels.push({
    category: "side",
    name: "Left Side",
    position: [-width / 2 + thickness / 2, 0, 0],
    dimensions: [thickness, height - 2 * thickness, depth],
    color: PANEL_COLORS.side,
  });

  // Right side panel: fits between top and bottom
  // Center: (width/2 - thickness/2, 0, 0)
  // Dimensions: thickness × (height - 2*thickness) × depth
  panels.push({
    category: "side",
    name: "Right Side",
    position: [width / 2 - thickness / 2, 0, 0],
    dimensions: [thickness, height - 2 * thickness, depth],
    color: PANEL_COLORS.side,
  });

  // Back panel: fits between left and right sides, and top and bottom
  // Center: (0, 0, -depth/2 + thickness/2)
  // Dimensions: (width - 2*thickness) × (height - 2*thickness) × thickness
  if (includeBack) {
    panels.push({
      category: "back",
      name: "Back",
      position: [0, 0, -depth / 2 + thickness / 2],
      dimensions: [width - 2 * thickness, height - 2 * thickness, thickness],
      color: PANEL_COLORS.back,
    });
  }

  return panels;
}

/**
 * Calculate optimal camera distance based on cabinet size
 * to ensure the entire cabinet is visible
 *
 * @param config Cabinet configuration
 * @returns Recommended camera distance in mm
 */
export function calculateCameraDistance(config: CabinetConfig): number {
  const { width, depth, height } = config;

  // Calculate the diagonal of the bounding box
  const diagonal = Math.sqrt(width ** 2 + height ** 2 + depth ** 2);

  // Camera distance should be ~1.5x the diagonal to fit everything in view
  // with some padding for comfortable viewing
  return diagonal * 1.5;
}

/**
 * Convert millimeters to Three.js units
 * (Using 1 unit = 1mm for simplicity, but scaling down for better rendering)
 *
 * @param mm Value in millimeters
 * @returns Value in Three.js units
 */
export function mmToUnits(mm: number): number {
  // Scale down by 100 for more manageable Three.js units
  // 1000mm (1m) = 10 units
  return mm / 100;
}

/**
 * Convert Three.js units back to millimeters
 *
 * @param units Value in Three.js units
 * @returns Value in millimeters
 */
export function unitsToMm(units: number): number {
  return units * 100;
}

/**
 * Format dimension for display (convert to meters if > 1000mm)
 *
 * @param mm Dimension in millimeters
 * @returns Formatted string
 */
export function formatDimension(mm: number): string {
  if (mm >= 1000) {
    return `${(mm / 1000).toFixed(2)}m`;
  }
  return `${mm}mm`;
}

/**
 * Get display dimensions in L × W × Thickness format
 * (thickness/depth always last)
 *
 * @param panel Panel3D object
 * @returns Array of [length, width, thickness] in mm
 */
export function getDisplayDimensions(panel: Panel3D): [number, number, number] {
  const [dim0, dim1, dim2] = panel.dimensions;

  switch (panel.category) {
    case "top":
    case "bottom":
      // dimensions: [width, thickness, depth] → display as [width, depth, thickness]
      return [dim0, dim2, dim1];

    case "side":
      // dimensions: [thickness, height, depth] → display as [depth, height, thickness]
      return [dim2, dim1, dim0];

    case "back":
    case "shelf":
    default:
      // dimensions: [width, height, thickness] → display as [width, height, thickness]
      return [dim0, dim1, dim2];
  }
}
