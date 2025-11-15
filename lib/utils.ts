/**
 * Utility functions for the Furniture Cut List Calculator
 */

import type { CabinetConfig, ValidationResult, ManualShelf } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui class name utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
export function calculateArea(width: number, height: number): string {
  const area = width * height;
  // Convert to m² if large enough
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(2)}m²`;
  }
  return `${area.toLocaleString()}mm²`;
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
  } else if (![12, 15, 16, 18].includes(config.thickness)) {
    errors.push("Thickness must be 12mm, 15mm, 16mm, or 18mm");
  }

  // Validate shelf configuration
  if (config.shelfMode === "auto" && config.autoShelfCount) {
    if (config.autoShelfCount < 0 || config.autoShelfCount > 20) {
      errors.push("Number of shelves must be between 0 and 20");
    }
    // Validate auto shelf thickness if specified
    if (config.autoShelfThickness && ![12, 15, 16, 18].includes(config.autoShelfThickness)) {
      errors.push("Auto shelf thickness must be 12mm, 15mm, 16mm, or 18mm");
    }
  }

  if (config.shelfMode === "manual" && config.manualShelves) {
    const shelfValidation = validateShelfPositions(
      config.manualShelves,
      config.height || 0
    );
    if (!shelfValidation.isValid) {
      errors.push(...shelfValidation.errors);
    }
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
 * Validate shelf positions for manual shelf mode
 * @param shelves - array of manual shelves to validate
 * @param cabinetHeight - total height of cabinet in mm
 * @returns validation result with errors if any
 */
export function validateShelfPositions(
  shelves: ManualShelf[],
  cabinetHeight: number
): ValidationResult {
  const errors: string[] = [];

  // Validate each shelf
  shelves.forEach((shelf, index) => {
    const shelfNum = index + 1;

    // Check thickness is valid
    if (![12, 15, 16, 18].includes(shelf.thickness)) {
      errors.push(`Shelf ${shelfNum}: Thickness must be 12mm, 15mm, 16mm, or 18mm`);
    }

    // Check position is within cabinet height
    if (shelf.position < 0) {
      errors.push(`Shelf ${shelfNum}: Position cannot be negative`);
    } else if (shelf.position > cabinetHeight) {
      errors.push(
        `Shelf ${shelfNum}: Position (${shelf.position}mm) exceeds cabinet height (${cabinetHeight}mm)`
      );
    }

    // Check position is reasonable (at least one thickness from bottom)
    if (shelf.position < shelf.thickness) {
      errors.push(
        `Shelf ${shelfNum}: Position too low - must be at least ${shelf.thickness}mm from bottom`
      );
    }
  });

  // Check for overlapping shelves
  const sortedShelves = [...shelves].sort((a, b) => a.position - b.position);
  for (let i = 0; i < sortedShelves.length - 1; i++) {
    const current = sortedShelves[i];
    const next = sortedShelves[i + 1];
    const currentIndex = shelves.indexOf(current) + 1;
    const nextIndex = shelves.indexOf(next) + 1;

    // Check if shelves overlap (position + thickness)
    if (current.position + current.thickness > next.position) {
      errors.push(
        `Shelves ${currentIndex} and ${nextIndex} overlap - ensure at least ${current.thickness}mm spacing`
      );
    }
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
