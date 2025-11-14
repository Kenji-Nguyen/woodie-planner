/**
 * Type definitions for the Furniture Cut List Calculator
 */

/**
 * Cabinet configuration input
 */
export interface CabinetConfig {
  width: number; // mm
  depth: number; // mm
  height: number; // mm
  thickness: number; // 12, 15, or 18 mm
  includeBack: boolean;
  constructionMethod?: "butt-joint" | "flush-edges" | "custom";
}

/**
 * Category of cabinet piece
 */
export type PieceCategory = "top" | "bottom" | "side" | "back" | "shelf";

/**
 * A single piece that needs to be cut
 */
export interface CutPiece {
  id: string;
  name: string; // "Top", "Left Side", etc.
  width: number; // mm
  height: number; // mm
  quantity: number;
  category: PieceCategory;
}

/**
 * A piece of stock material available for cutting
 */
export interface StockPiece {
  id: string;
  width: number; // mm
  height: number; // mm
  available: boolean; // false if fully used
}

/**
 * A placed piece with position information
 */
export interface PlacedPiece {
  cutPieceId: string;
  x: number; // position on stock
  y: number; // position on stock
  width: number;
  height: number;
  rotated: boolean; // if piece was rotated 90°
  cutSequence: number; // order of cuts
}

/**
 * Layout of cuts on a single stock piece
 */
export interface CutLayout {
  stockPieceId: string;
  cuts: PlacedPiece[];
  wastePercentage: number;
}

/**
 * Optimization mode for cut planning
 */
export type OptimizationMode = "minimize-waste" | "simplify-cuts";

/**
 * Result of optimization process
 */
export interface OptimizationResult {
  layouts: CutLayout[];
  unmatchedPieces: CutPiece[];
  totalWastePercentage: number;
  mode: OptimizationMode;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
