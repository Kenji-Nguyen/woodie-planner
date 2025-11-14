// @ts-ignore - binpackingjs has no proper types
import BinPacking from "binpackingjs";
import type { CutPiece, StockPiece, PlacedPiece } from "./types";

// Extract classes from the default export
const { Packer, Box, Bin } = BinPacking as any;

/**
 * Bin Packing Wrapper using binpackingjs library
 * Handles packing cut pieces into stock pieces with rotation support
 */

export interface PackingResult {
  packedPieces: PlacedPiece[];
  unpackedPieces: CutPiece[];
  wastePercentage: number;
  totalArea: number;
  usedArea: number;
}

/**
 * Pack cut pieces into a single stock piece
 *
 * @param cutPieces - Array of pieces to pack
 * @param stock - Stock piece to pack into
 * @param allowRotation - Allow 90° rotation (default: true)
 * @returns PackingResult with placed and unpacked pieces
 */
export function packPiecesIntoStock(
  cutPieces: CutPiece[],
  stock: StockPiece,
  allowRotation: boolean = true
): PackingResult {
  try {
    // Create a bin representing the stock piece
    const bin = new Bin(stock.width, stock.height, Infinity);

    // Create boxes for each piece (considering quantity)
    const boxes: any[] = [];
    const pieceMap = new Map<string, CutPiece>();

    cutPieces.forEach((piece) => {
      for (let i = 0; i < piece.quantity; i++) {
        const boxId = `${piece.id}_${i}`;
        const box = new Box(boxId, piece.width, piece.height);
        boxes.push(box);
        pieceMap.set(boxId, piece);
      }
    });

    // Create packer and pack boxes into bin
    const packer = new Packer([bin]);

    // Pack with rotation option
    try {
      packer.pack(boxes, {
        allowRotation,
      });
    } catch (packError) {
      console.error("Packer.pack error:", packError);
      // Try packing without options as fallback
      packer.pack(boxes);
    }

    // Process results
    const packedPieces: PlacedPiece[] = [];
    const unpackedBoxIds = new Set<string>();

    // Get packed boxes from the bin
    const packedBin = packer.bins[0];
    if (packedBin.items) {
      packedBin.items.forEach((item: any, index: number) => {
        const piece = pieceMap.get(item.item.name);
        if (piece) {
          const isRotated = item.item.width !== piece.width;

          packedPieces.push({
            cutPieceId: item.item.name,
            x: item.x,
            y: item.y,
            width: item.item.width,
            height: item.item.height,
            rotated: isRotated,
            cutSequence: index + 1,
          });
        }
      });
    }

    // Identify unpacked pieces
    boxes.forEach((box) => {
      const isPacked = packedPieces.some((p) => p.cutPieceId === box.name);
      if (!isPacked) {
        unpackedBoxIds.add(box.name);
      }
    });

    // Group unpacked boxes back into pieces with quantities
    const unpackedPieces: CutPiece[] = [];
    const unpackedPieceCounts = new Map<string, number>();

    unpackedBoxIds.forEach((boxId) => {
      const originalPieceId = boxId.split("_")[0];
      unpackedPieceCounts.set(
        originalPieceId,
        (unpackedPieceCounts.get(originalPieceId) || 0) + 1
      );
    });

    unpackedPieceCounts.forEach((count, pieceId) => {
      const originalPiece = cutPieces.find((p) => p.id === pieceId);
      if (originalPiece) {
        unpackedPieces.push({
          ...originalPiece,
          quantity: count,
        });
      }
    });

    // Calculate waste
    const totalArea = stock.width * stock.height;
    const usedArea = packedPieces.reduce((sum, piece) => {
      return sum + piece.width * piece.height;
    }, 0);
    const wastePercentage = ((totalArea - usedArea) / totalArea) * 100;

    return {
      packedPieces,
      unpackedPieces,
      wastePercentage,
      totalArea,
      usedArea,
    };
  } catch (error) {
    console.error("Error in packPiecesIntoStock:", error);
    // Return empty result on error
    const totalArea = stock.width * stock.height;
    return {
      packedPieces: [],
      unpackedPieces: cutPieces,
      wastePercentage: 100,
      totalArea,
      usedArea: 0,
    };
  }
}

/**
 * Calculate guillotine cut sequence for packed pieces
 * Determines the order of cuts to minimize complexity
 *
 * @param pieces - Array of placed pieces
 * @returns Array of pieces with updated cut sequence
 */
export function calculateCutSequence(pieces: PlacedPiece[]): PlacedPiece[] {
  // Sort pieces by position (top-to-bottom, left-to-right)
  // This creates a natural cutting sequence
  const sorted = [...pieces].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 10) {
      // Same row (within 10mm tolerance)
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  // Assign sequence numbers
  return sorted.map((piece, index) => ({
    ...piece,
    cutSequence: index + 1,
  }));
}
