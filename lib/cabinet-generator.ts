/**
 * Cabinet cut list generator
 *
 * Generates cut lists for cabinets based on dimensions and construction method.
 * Initial implementation uses butt-joint construction.
 */

import type { CabinetConfig, CutPiece } from "./types";
import { generateId } from "./utils";

/**
 * Generate cut list for a cabinet using butt-joint construction
 *
 * For a cabinet with dimensions W × D × H and thickness T:
 * - Top: W × D (qty: 1)
 * - Bottom: W × D (qty: 1)
 * - Left Side: D × (H - 2T) (qty: 1)
 * - Right Side: D × (H - 2T) (qty: 1)
 * - Back: (W - 2T) × (H - 2T) (qty: 1) [optional]
 * - Shelves: Based on mode (auto or manual)
 *
 * @param config - cabinet configuration
 * @returns array of cut pieces
 */
export function generateCutList(config: CabinetConfig): CutPiece[] {
  const {
    width,
    depth,
    height,
    thickness,
    includeBack,
    includeTop = true,
    includeDoors = false,
    doorCount = 1,
    shelfMode,
    manualShelves,
    autoShelfCount,
  } = config;
  const pieces: CutPiece[] = [];

  // Top piece (optional - can be omitted for open-top drawer/box)
  if (includeTop) {
    pieces.push({
      id: generateId(),
      name: "Top",
      width: width,
      height: depth,
      quantity: 1,
      category: "top",
      thickness: thickness,
    });
  }

  // Bottom piece
  pieces.push({
    id: generateId(),
    name: "Bottom",
    width: width,
    height: depth,
    quantity: 1,
    category: "bottom",
    thickness: thickness,
  });

  // Left side piece
  // Height is reduced by 2 × thickness (top and bottom)
  pieces.push({
    id: generateId(),
    name: "Left Side",
    width: depth,
    height: height - 2 * thickness,
    quantity: 1,
    category: "side",
    thickness: thickness,
  });

  // Right side piece
  pieces.push({
    id: generateId(),
    name: "Right Side",
    width: depth,
    height: height - 2 * thickness,
    quantity: 1,
    category: "side",
    thickness: thickness,
  });

  // Back piece (optional)
  if (includeBack) {
    pieces.push({
      id: generateId(),
      name: "Back",
      width: width - 2 * thickness,
      height: height - 2 * thickness,
      quantity: 1,
      category: "back",
      thickness: thickness,
    });
  }

  // Door pieces (optional)
  if (includeDoors) {
    const doorHeight = height - 2 * thickness; // Account for top and bottom
    const doorWidth = doorCount === 2
      ? (width - 2 * thickness - 2) / 2 // Split width for 2 doors with 2mm gap
      : width - 2 * thickness; // Full width for single door

    pieces.push({
      id: generateId(),
      name: doorCount === 2 ? "Door (Left)" : "Door",
      width: doorWidth,
      height: doorHeight,
      quantity: 1,
      category: "door",
      thickness: thickness,
    });

    if (doorCount === 2) {
      pieces.push({
        id: generateId(),
        name: "Door (Right)",
        width: doorWidth,
        height: doorHeight,
        quantity: 1,
        category: "door",
        thickness: thickness,
      });
    }
  }

  // Generate shelves based on mode
  if (shelfMode === "auto" && autoShelfCount && autoShelfCount > 0) {
    // Auto mode: evenly space shelves
    const shelfWidth = width - 2 * thickness; // Between sides
    const shelfDepth = includeBack ? depth - thickness : depth; // Account for back if present

    for (let i = 1; i <= autoShelfCount; i++) {
      pieces.push({
        id: generateId(),
        name: `Shelf ${i}`,
        width: shelfWidth,
        height: shelfDepth,
        quantity: 1,
        category: "shelf",
        thickness: thickness, // Default to cabinet thickness
      });
    }
  } else if (shelfMode === "manual" && manualShelves && manualShelves.length > 0) {
    // Manual mode: use specified shelves
    manualShelves.forEach((shelf, index) => {
      const shelfWidth = width - 2 * thickness; // Between sides
      const shelfDepth = includeBack ? depth - thickness : depth; // Account for back if present

      pieces.push({
        id: generateId(),
        name: `Shelf ${index + 1}`,
        width: shelfWidth,
        height: shelfDepth,
        quantity: 1,
        category: "shelf",
        thickness: shelf.thickness,
      });
    });
  }

  return pieces;
}

/**
 * Calculate total area needed for all pieces
 * @param pieces - array of cut pieces
 * @returns total area in mm²
 */
export function calculateTotalArea(pieces: CutPiece[]): number {
  return pieces.reduce((total, piece) => {
    return total + piece.width * piece.height * piece.quantity;
  }, 0);
}

/**
 * Count total number of pieces
 * @param pieces - array of cut pieces
 * @returns total count
 */
export function countPieces(pieces: CutPiece[]): number {
  return pieces.reduce((total, piece) => total + piece.quantity, 0);
}

/**
 * Get summary statistics for a cut list
 * @param pieces - array of cut pieces
 * @returns summary object
 */
export function getCutListSummary(pieces: CutPiece[]) {
  // Group pieces by thickness for area calculation
  const areaByThickness = pieces.reduce(
    (acc, piece) => {
      const area = piece.width * piece.height * piece.quantity;
      acc[piece.thickness] = (acc[piece.thickness] || 0) + area;
      return acc;
    },
    {} as Record<number, number>
  );

  return {
    totalPieces: countPieces(pieces),
    totalArea: calculateTotalArea(pieces),
    uniquePieces: pieces.length,
    piecesByCategory: pieces.reduce(
      (acc, piece) => {
        acc[piece.category] = (acc[piece.category] || 0) + piece.quantity;
        return acc;
      },
      {} as Record<string, number>
    ),
    areaByThickness, // Area needed for each thickness
  };
}
