import type { CutPiece, StockPiece, CutLayout } from "./types";
import { packPiecesIntoStock, calculateCutSequence } from "./bin-packer";

/**
 * Stock Matcher - Matches cut pieces to available stock inventory
 * Uses bin packing algorithm to optimize material usage
 */

export interface MatchingResult {
  layouts: CutLayout[];
  unmatchedPieces: CutPiece[];
  totalWastePercentage: number;
  stockUsed: number;
}

/**
 * Match cut pieces to stock inventory using bin packing
 * Tries to pack pieces into available stock, prioritizing waste minimization
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @param allowRotation - Allow 90° rotation (default: true)
 * @returns MatchingResult with layouts and unmatched pieces
 */
export function matchPiecesToStock(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[],
  allowRotation: boolean = true
): MatchingResult {
  if (stockPieces.length === 0) {
    return {
      layouts: [],
      unmatchedPieces: cutPieces,
      totalWastePercentage: 0,
      stockUsed: 0,
    };
  }

  const layouts: CutLayout[] = [];
  let remainingPieces = [...cutPieces];
  const availableStock = stockPieces.filter((s) => s.available);

  // Sort stock by area (largest first) for better packing
  const sortedStock = [...availableStock].sort(
    (a, b) => b.width * b.height - a.width * a.height
  );

  // Try to pack pieces into each stock piece
  for (const stock of sortedStock) {
    if (remainingPieces.length === 0) break;

    // Attempt to pack remaining pieces into this stock
    const result = packPiecesIntoStock(remainingPieces, stock, allowRotation);

    if (result.packedPieces.length > 0) {
      // Add cut sequence
      const piecesWithSequence = calculateCutSequence(result.packedPieces);

      // Create layout for this stock piece
      layouts.push({
        stockPieceId: stock.id,
        cuts: piecesWithSequence,
        wastePercentage: result.wastePercentage,
      });

      // Update remaining pieces
      remainingPieces = result.unpackedPieces;
    }
  }

  // Calculate total waste percentage
  const totalWaste = layouts.reduce((sum, layout) => {
    // Get stock dimensions
    const stock = stockPieces.find((s) => s.id === layout.stockPieceId);
    if (!stock) return sum;

    const stockArea = stock.width * stock.height;
    const usedArea = layout.cuts.reduce(
      (acc, cut) => acc + cut.width * cut.height,
      0
    );
    const wasteArea = stockArea - usedArea;

    return sum + wasteArea;
  }, 0);

  const totalStockArea = layouts.reduce((sum, layout) => {
    const stock = stockPieces.find((s) => s.id === layout.stockPieceId);
    return sum + (stock ? stock.width * stock.height : 0);
  }, 0);

  const totalWastePercentage =
    totalStockArea > 0 ? (totalWaste / totalStockArea) * 100 : 0;

  return {
    layouts,
    unmatchedPieces: remainingPieces,
    totalWastePercentage,
    stockUsed: layouts.length,
  };
}

/**
 * Match pieces using "simplify cuts" mode
 * Prioritizes easier cutting patterns over waste minimization
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns MatchingResult with simpler cutting patterns
 */
export function matchPiecesSimpleCuts(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
): MatchingResult {
  // For simple cuts mode, disable rotation to make cuts easier
  // and sort pieces by size (largest first) for cleaner layouts
  const sortedPieces = [...cutPieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  return matchPiecesToStock(sortedPieces, stockPieces, false);
}

/**
 * Calculate detailed waste statistics for a layout
 *
 * @param layout - Cut layout to analyze
 * @param stock - Stock piece used
 * @returns Waste statistics object
 */
export function calculateWasteStats(layout: CutLayout, stock: StockPiece) {
  const stockArea = stock.width * stock.height;
  const usedArea = layout.cuts.reduce(
    (sum, cut) => sum + cut.width * cut.height,
    0
  );
  const wasteArea = stockArea - usedArea;

  return {
    stockArea,
    usedArea,
    wasteArea,
    wastePercentage: (wasteArea / stockArea) * 100,
    efficiency: (usedArea / stockArea) * 100,
  };
}
