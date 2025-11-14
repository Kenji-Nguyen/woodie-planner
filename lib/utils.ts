/**
 * Utility functions for the Furniture Cut List Calculator
 */

import type { CabinetConfig, ValidationResult } from "./types";

/**
 * Format dimension in millimeters for display
 * @param mm - dimension in millimeters
 * @returns formatted string (e.g., "800mm")
 */
export function formatDimension(mm: number): string {
  return `${mm}mm`;
}

/**
 * Format dimensions as width × height
 * @param width - width in millimeters
 * @param height - height in millimeters
 * @returns formatted string (e.g., "800 × 500mm")
 */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}mm`;
}

/**
 * Calculate area in square millimeters
 * @param width - width in millimeters
 * @param height - height in millimeters
 * @returns area in mm²
 */
export function calculateArea(width: number, height: number): number {
  return width * height;
}

/**
 * Format area for display
 * @param area - area in mm²
 * @returns formatted string with appropriate unit
 */
export function formatArea(area: number): string {
  // Convert to m² if large enough
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(2)}m²`;
  }
  return `${area.toLocaleString()}mm²`;
}

/**
 * Format percentage for display
 * @param value - percentage value (0-100)
 * @returns formatted string (e.g., "12.5%")
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Generate unique ID
 * @returns unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate cabinet configuration
 * @param config - cabinet configuration to validate
 * @returns validation result with errors if any
 */
export function validateCabinetConfig(
  config: Partial<CabinetConfig>
): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!config.width) {
    errors.push("Width is required");
  } else if (config.width < 100 || config.width > 5000) {
    errors.push("Width must be between 100mm and 5000mm");
  }

  if (!config.depth) {
    errors.push("Depth is required");
  } else if (config.depth < 100 || config.depth > 5000) {
    errors.push("Depth must be between 100mm and 5000mm");
  }

  if (!config.height) {
    errors.push("Height is required");
  } else if (config.height < 100 || config.height > 5000) {
    errors.push("Height must be between 100mm and 5000mm");
  }

  if (!config.thickness) {
    errors.push("Thickness is required");
  } else if (![12, 15, 18].includes(config.thickness)) {
    errors.push("Thickness must be 12mm, 15mm, or 18mm");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate stock piece dimensions
 * @param width - width in millimeters
 * @param height - height in millimeters
 * @returns validation result with errors if any
 */
export function validateStockDimensions(
  width: number,
  height: number
): ValidationResult {
  const errors: string[] = [];

  if (!width || width <= 0) {
    errors.push("Width must be greater than 0");
  } else if (width < 100 || width > 5000) {
    errors.push("Width must be between 100mm and 5000mm");
  }

  if (!height || height <= 0) {
    errors.push("Height must be greater than 0");
  } else if (height < 100 || height > 5000) {
    errors.push("Height must be between 100mm and 5000mm");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a number is valid (positive and finite)
 * @param value - number to check
 * @returns true if valid
 */
export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === "number" && isFinite(value) && !isNaN(value) && value > 0
  );
}

/**
 * Clamp a number between min and max values
 * @param value - value to clamp
 * @param min - minimum value
 * @param max - maximum value
 * @returns clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
