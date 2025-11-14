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
  let allUnmatched: CutPiece[] = [];
  const availableStock = stockPieces.filter((s) => s.available);

  // Group cut pieces by thickness
  const piecesByThickness = cutPieces.reduce((acc, piece) => {
    if (!acc[piece.thickness]) {
      acc[piece.thickness] = [];
    }
    acc[piece.thickness].push(piece);
    return acc;
  }, {} as Record<number, CutPiece[]>);

  // Group stock by thickness
  const stockByThickness = availableStock.reduce((acc, stock) => {
    if (!acc[stock.thickness]) {
      acc[stock.thickness] = [];
    }
    acc[stock.thickness].push(stock);
    return acc;
  }, {} as Record<number, StockPiece[]>);

  // Process each thickness separately
  for (const thickness in piecesByThickness) {
    const piecesForThickness = piecesByThickness[thickness];
    const stockForThickness = stockByThickness[thickness] || [];

    if (stockForThickness.length === 0) {
      // No stock available for this thickness, add to unmatched
      allUnmatched.push(...piecesForThickness);
      continue;
    }

    let remainingPieces = [...piecesForThickness];

    // Sort stock by area (largest first) for better packing
    const sortedStock = [...stockForThickness].sort(
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

    // Add any remaining pieces for this thickness to unmatched
    allUnmatched.push(...remainingPieces);
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
    unmatchedPieces: allUnmatched,
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

/**
 * Match pieces with grain direction priority
 * Keeps all pieces in same orientation (no rotation) to respect wood grain
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns MatchingResult with all pieces in same orientation
 */
export function matchPiecesGrainDirection(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
): MatchingResult {
  // Disable rotation completely to preserve grain direction
  // Sort pieces by category to group similar pieces together
  const sortedPieces = [...cutPieces].sort((a, b) => {
    return a.category.localeCompare(b.category);
  });

  return matchPiecesToStock(sortedPieces, stockPieces, false);
}

/**
 * Match pieces to minimize number of stock sheets used
 * Tries to pack as many pieces as possible into each sheet
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns MatchingResult using fewer stock pieces
 */
export function matchPiecesMinimizeSheets(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
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

  // Sort stock by area (largest first) to use bigger sheets
  const sortedStock = [...availableStock].sort(
    (a, b) => b.width * b.height - a.width * a.height
  );

  // Sort pieces by area (largest first) for better packing
  remainingPieces.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  // Try multiple passes with rotation to pack more pieces per sheet
  for (const stock of sortedStock) {
    if (remainingPieces.length === 0) break;

    // Try packing with rotation first for maximum density
    const result = packPiecesIntoStock(remainingPieces, stock, true);

    if (result.packedPieces.length > 0) {
      const piecesWithSequence = calculateCutSequence(result.packedPieces);

      layouts.push({
        stockPieceId: stock.id,
        cuts: piecesWithSequence,
        wastePercentage: result.wastePercentage,
      });

      remainingPieces = result.unpackedPieces;
    }
  }

  // Calculate total waste
  const totalWaste = layouts.reduce((sum, layout) => {
    const stock = stockPieces.find((s) => s.id === layout.stockPieceId);
    if (!stock) return sum;

    const stockArea = stock.width * stock.height;
    const usedArea = layout.cuts.reduce(
      (acc, cut) => acc + cut.width * cut.height,
      0
    );
    return sum + (stockArea - usedArea);
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
 * Match pieces using largest-first strategy
 * Prioritizes fitting largest pieces first, then fills gaps with smaller ones
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns MatchingResult with largest pieces placed first
 */
export function matchPiecesLargestFirst(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
): MatchingResult {
  // Sort pieces by area (largest first)
  const sortedPieces = [...cutPieces].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  // Allow rotation for better space utilization
  return matchPiecesToStock(sortedPieces, stockPieces, true);
}

/**
 * Match pieces with edge alignment priority
 * Tries to align pieces to stock edges for cleaner, easier cuts
 *
 * @param cutPieces - Array of pieces to cut
 * @param stockPieces - Array of available stock pieces
 * @returns MatchingResult with edge-aligned pieces
 */
export function matchPiecesEdgeAlignment(
  cutPieces: CutPiece[],
  stockPieces: StockPiece[]
): MatchingResult {
  // Sort pieces by perimeter (longer perimeter pieces align better to edges)
  const sortedPieces = [...cutPieces].sort((a, b) => {
    const perimeterA = 2 * (a.width + a.height);
    const perimeterB = 2 * (b.width + b.height);
    return perimeterB - perimeterA;
  });

  // Disable rotation to keep pieces aligned to edges
  return matchPiecesToStock(sortedPieces, stockPieces, false);
}
