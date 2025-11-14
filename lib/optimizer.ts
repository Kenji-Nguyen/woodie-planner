import type { CutPiece, StockPiece } from "./types";
import {
  matchPiecesToStock,
  matchPiecesSimpleCuts,
  matchPiecesGrainDirection,
  matchPiecesMinimizeSheets,
  matchPiecesLargestFirst,
  matchPiecesEdgeAlignment,
  type MatchingResult,
} from "./stock-matcher";

/**
 * Optimization Engine
 * High-level interface for cut optimization
 */

export type OptimizationMode =
  | "minimize-waste"
  | "simplify-cuts"
  | "grain-direction"
  | "minimize-sheets"
  | "largest-first"
  | "edge-alignment";

export interface OptimizationOptions {
  mode: OptimizationMode;
  allowRotation?: boolean;
}

/**
 * Run optimization to match cut pieces to stock inventory
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @param options - Optimization options (mode, rotation)
 * @returns MatchingResult with layouts and statistics
 */
export function optimizeCuts(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[],
  options: OptimizationOptions = { mode: "minimize-waste", allowRotation: true }
): MatchingResult {
  // Validate inputs
  if (cutPieces.length === 0) {
    return {
      layouts: [],
      unmatchedPieces: [],
      totalWastePercentage: 0,
      stockUsed: 0,
    };
  }

  if (stockPieces.length === 0) {
    return {
      layouts: [],
      unmatchedPieces: cutPieces,
      totalWastePercentage: 0,
      stockUsed: 0,
    };
  }

  // Run optimization based on mode
  switch (options.mode) {
    case "minimize-waste":
      return matchPiecesToStock(
        cutPieces,
        stockPieces,
        options.allowRotation ?? true
      );

    case "simplify-cuts":
      return matchPiecesSimpleCuts(cutPieces, stockPieces);

    case "grain-direction":
      return matchPiecesGrainDirection(cutPieces, stockPieces);

    case "minimize-sheets":
      return matchPiecesMinimizeSheets(cutPieces, stockPieces);

    case "largest-first":
      return matchPiecesLargestFirst(cutPieces, stockPieces);

    case "edge-alignment":
      return matchPiecesEdgeAlignment(cutPieces, stockPieces);

    default:
      // Default to minimize-waste
      return matchPiecesToStock(
        cutPieces,
        stockPieces,
        options.allowRotation ?? true
      );
  }
}

/**
 * Estimate material requirements
 * Calculates how much stock is needed for the cut pieces
 *
 * @param cutPieces - Array of pieces to cut
 * @returns Estimated total area needed
 */
export function estimateMaterialNeeded(cutPieces: CutPiece[]): {
  totalArea: number;
  pieceCount: number;
  largestPiece: { width: number; height: number };
} {
  let totalArea = 0;
  let pieceCount = 0;
  let largestPiece = { width: 0, height: 0 };

  cutPieces.forEach((piece) => {
    const pieceArea = piece.width * piece.height * piece.quantity;
    totalArea += pieceArea;
    pieceCount += piece.quantity;

    const currentArea = piece.width * piece.height;
    const largestArea = largestPiece.width * largestPiece.height;

    if (currentArea > largestArea) {
      largestPiece = { width: piece.width, height: piece.height };
    }
  });

  return {
    totalArea,
    pieceCount,
    largestPiece,
  };
}

/**
 * Check if stock inventory is sufficient for cut pieces
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns Object indicating if stock is sufficient and details
 */
export function checkStockSufficiency(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
): {
  isSufficient: boolean;
  availableArea: number;
  requiredArea: number;
  shortfall: number;
} {
  const { totalArea: requiredArea } = estimateMaterialNeeded(cutPieces);

  const availableArea = stockPieces
    .filter((s) => s.available)
    .reduce((sum, s) => sum + s.width * s.height, 0);

  const shortfall = Math.max(0, requiredArea - availableArea);

  return {
    isSufficient: shortfall === 0,
    availableArea,
    requiredArea,
    shortfall,
  };
}
