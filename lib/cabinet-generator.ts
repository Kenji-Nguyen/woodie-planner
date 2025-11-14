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
 *
 * @param config - cabinet configuration
 * @returns array of cut pieces
 */
export function generateCutList(config: CabinetConfig): CutPiece[] {
  const { width, depth, height, thickness, includeBack } = config;
  const pieces: CutPiece[] = [];

  // Top piece
  pieces.push({
    id: generateId(),
    name: "Top",
    width: width,
    height: depth,
    quantity: 1,
    category: "top",
  });

  // Bottom piece
  pieces.push({
    id: generateId(),
    name: "Bottom",
    width: width,
    height: depth,
    quantity: 1,
    category: "bottom",
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
  });

  // Right side piece
  pieces.push({
    id: generateId(),
    name: "Right Side",
    width: depth,
    height: height - 2 * thickness,
    quantity: 1,
    category: "side",
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
  };
}
