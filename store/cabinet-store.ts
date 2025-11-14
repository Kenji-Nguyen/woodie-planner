/**
 * Cabinet state management store
 *
 * Manages cabinet configuration and generated cut list using Zustand
 */

import { create } from "zustand";
import type { CabinetConfig, CutPiece } from "@/lib/types";
import { generateCutList } from "@/lib/cabinet-generator";

interface CabinetState {
  // State
  config: CabinetConfig | null;
  cutList: CutPiece[];

  // Actions
  setCabinetConfig: (config: CabinetConfig) => void;
  generateCutList: () => void;
  resetCabinet: () => void;
}

/**
 * Default cabinet configuration
 */
const defaultConfig: CabinetConfig = {
  width: 800,
  depth: 500,
  height: 1000,
  thickness: 18,
  includeBack: true,
  constructionMethod: "butt-joint",
};

export const useCabinetStore = create<CabinetState>((set, get) => ({
  // Initial state
  config: null,
  cutList: [],

  // Set cabinet configuration
  setCabinetConfig: (config: CabinetConfig) => {
    set({ config });
  },

  // Generate cut list from current configuration
  generateCutList: () => {
    const { config } = get();
    if (!config) {
      console.warn("No cabinet configuration set");
      return;
    }

    const cutList = generateCutList(config);
    set({ cutList });
  },

  // Reset to initial state
  resetCabinet: () => {
    set({ config: null, cutList: [] });
  },
}));

// Export default config for use in forms
export { defaultConfig };
