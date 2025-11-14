// @ts-ignore - binpackingjs has no proper types
import * as BinPackingJS from "binpackingjs";
import type { CutPiece, StockPiece, PlacedPiece } from "./types";

// Extract classes from BP2D (2D bin packing)
const { Packer, Box, Bin } = (BinPackingJS as any).BP2D;

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
    const bin = new Bin(stock.width, stock.height);

    // Create boxes for each piece (considering quantity)
    // Note: Box constructor only takes (width, height), not a name
    const boxes: any[] = [];
    const boxMetadata: Array<{ id: string; piece: CutPiece }> = [];

    cutPieces.forEach((piece) => {
      for (let i = 0; i < piece.quantity; i++) {
        const boxId = `${piece.id}_${i}`;
        const box = new Box(piece.width, piece.height);
        boxes.push(box);
        boxMetadata.push({ id: boxId, piece });
      }
    });

    // Create packer and pack boxes into bin
    const packer = new Packer([bin]);

    // Pack the boxes (returns array of successfully packed boxes)
    const packedBoxes = packer.pack(boxes);

    // Process results from bin.boxes property
    const packedPieces: PlacedPiece[] = [];
    const packedIndices = new Set<number>();

    // Get packed boxes from the bin
    const packedBin = packer.bins[0];
    if (packedBin.boxes && packedBin.boxes.length > 0) {
      packedBin.boxes.forEach((box: any, seqIndex: number) => {
        // Find the original box index in our boxes array
        const boxIndex = boxes.findIndex((b, idx) => {
          return !packedIndices.has(idx) &&
                 b.width === box.width &&
                 b.height === box.height &&
                 Math.abs(b.x - box.x) < 0.1 &&
                 Math.abs(b.y - box.y) < 0.1;
        });

        if (boxIndex >= 0) {
          packedIndices.add(boxIndex);
          const metadata = boxMetadata[boxIndex];

          // Check if rotated by comparing dimensions
          const isRotated = box.width !== metadata.piece.width;

          packedPieces.push({
            cutPieceId: metadata.id,
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            rotated: isRotated,
            cutSequence: seqIndex + 1,
          });
        }
      });
    }

    // Identify unpacked pieces
    const unpackedBoxIds = new Set<string>();
    boxMetadata.forEach((metadata, index) => {
      if (!packedIndices.has(index)) {
        unpackedBoxIds.add(metadata.id);
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
