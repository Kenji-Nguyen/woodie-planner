import type { CutPiece } from "./types";

export interface LayoutPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  category: CutPiece["category"];
  thickness: number; // Material thickness in mm
}

/**
 * Simple grid layout algorithm for visualizing cut pieces
 * This is a temporary layout for preview mode (not optimized cutting)
 *
 * @param pieces - Array of cut pieces to layout
 * @param maxWidth - Maximum width of the canvas/container
 * @param spacing - Space between pieces (default: 20)
 * @returns Array of positioned pieces with x, y coordinates
 */
export function createSimpleLayout(
  pieces: CutPiece[],
  maxWidth: number = 1200,
  spacing: number = 20
): LayoutPosition[] {
  const positions: LayoutPosition[] = [];
  let currentX = spacing;
  let currentY = spacing;
  let rowHeight = 0;

  pieces.forEach((piece) => {
    // For pieces with quantity > 1, create multiple positions
    for (let i = 0; i < piece.quantity; i++) {
      const pieceWidth = piece.width;
      const pieceHeight = piece.height;

      // Check if piece fits in current row
      if (currentX + pieceWidth > maxWidth && currentX > spacing) {
        // Move to next row
        currentX = spacing;
        currentY += rowHeight + spacing;
        rowHeight = 0;
      }

      // Add piece position
      positions.push({
        id: `${piece.id}_${i}`,
        x: currentX,
        y: currentY,
        width: pieceWidth,
        height: pieceHeight,
        category: piece.category,
        thickness: piece.thickness,
      });

      // Update position for next piece
      currentX += pieceWidth + spacing;
      rowHeight = Math.max(rowHeight, pieceHeight);
    }
  });

  return positions;
}

/**
 * Calculate the bounding box of all positioned pieces
 * Useful for determining canvas size and zoom-to-fit
 *
 * @param positions - Array of positioned pieces
 * @param padding - Extra padding around the bounding box (default: 40)
 * @returns Object with width and height of the bounding box
 */
export function calculateBoundingBox(
  positions: LayoutPosition[],
  padding: number = 40
): { width: number; height: number } {
  if (positions.length === 0) {
    return { width: 800, height: 600 };
  }

  let maxX = 0;
  let maxY = 0;

  positions.forEach((pos) => {
    maxX = Math.max(maxX, pos.x + pos.width);
    maxY = Math.max(maxY, pos.y + pos.height);
  });

  return {
    width: maxX + padding,
    height: maxY + padding,
  };
}

/**
 * Get color for a piece category
 * Color scheme for different cabinet/furniture parts
 */
export function getCategoryColor(category: CutPiece["category"]): string {
  const colors = {
    top: "#3B82F6", // blue
    bottom: "#3B82F6", // blue
    side: "#10B981", // green
    back: "#F59E0B", // amber
    shelf: "#8B5CF6", // purple
    door: "#EC4899", // pink
    "drawer-front": "#F97316", // orange
    tabletop: "#06B6D4", // cyan
  };

  return colors[category] || "#6B7280"; // gray as default
}

/**
 * Get color for a piece based on thickness
 * Color scheme for different material thicknesses
 *
 * @param thickness - Material thickness in mm
 * @returns Hex color code
 */
export function getThicknessColor(thickness: number): string {
  const colors: Record<number, string> = {
    12: "#EF4444", // red - 12mm
    15: "#F59E0B", // amber - 15mm
    16: "#8B5CF6", // purple - 16mm
    18: "#3B82F6", // blue - 18mm
  };

  return colors[thickness] || "#6B7280"; // gray as default
}

/**
 * Get a combined color that blends category and thickness information
 * Creates a darker shade for different thicknesses while maintaining category hue
 *
 * @param category - Piece category
 * @param thickness - Material thickness in mm
 * @returns Hex color code
 */
export function getCombinedColor(
  category: CutPiece["category"],
  thickness: number
): string {
  // Primary color based on category
  const baseColors = {
    top: { r: 59, g: 130, b: 246 }, // blue
    bottom: { r: 59, g: 130, b: 246 }, // blue
    side: { r: 16, g: 185, b: 129 }, // green
    back: { r: 245, g: 158, b: 11 }, // amber
    shelf: { r: 139, g: 92, b: 246 }, // purple
    door: { r: 236, g: 72, b: 153 }, // pink
    "drawer-front": { r: 249, g: 115, b: 22 }, // orange
    tabletop: { r: 6, g: 182, b: 212 }, // cyan
  };

  const base = baseColors[category] || { r: 107, g: 115, b: 128 }; // gray default

  // Adjust brightness based on thickness
  const thicknessMultipliers: Record<number, number> = {
    12: 1.1, // Lighter
    15: 1.0, // Normal
    16: 0.9, // Slightly darker
    18: 0.8, // Darker
  };

  const multiplier = thicknessMultipliers[thickness] || 1.0;

  const adjusted = {
    r: Math.min(255, Math.round(base.r * multiplier)),
    g: Math.min(255, Math.round(base.g * multiplier)),
    b: Math.min(255, Math.round(base.b * multiplier)),
  };

  return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
}

/**
 * Scale factor calculation for zoom-to-fit
 *
 * @param contentWidth - Width of the content to fit
 * @param contentHeight - Height of the content to fit
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @returns Scale factor to fit content in container
 */
export function calculateFitScale(
  contentWidth: number,
  contentHeight: number,
  containerWidth: number,
  containerHeight: number
): number {
  const scaleX = containerWidth / contentWidth;
  const scaleY = containerHeight / contentHeight;

  // Use the smaller scale to ensure content fits in both dimensions
  return Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
}
