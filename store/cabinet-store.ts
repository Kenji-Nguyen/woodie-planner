/**
 * Cabinet state management store
 *
 * Manages multiple cabinets with configuration and generated cut lists using Zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CabinetConfig, CutPiece } from "@/lib/types";
import { generateCutList } from "@/lib/cabinet-generator";
import { generateId } from "@/lib/utils";

export interface Cabinet {
  id: string;
  name: string;
  config: CabinetConfig;
  cutList: CutPiece[];
  createdAt: number;
}

interface CabinetState {
  // State
  cabinets: Cabinet[];
  activeCabinetId: string | null;

  // Getters
  getActiveCabinet: () => Cabinet | null;
  getCabinetById: (id: string) => Cabinet | undefined;

  // Actions
  addCabinet: (name: string, config: CabinetConfig) => string;
  updateCabinet: (id: string, config: CabinetConfig) => void;
  deleteCabinet: (id: string) => void;
  setActiveCabinet: (id: string) => void;
  renameCabinet: (id: string, name: string) => void;
  generateCutListForCabinet: (id: string) => void;
  clearAll: () => void;
}

/**
 * Default cabinet configuration
 */
export const defaultConfig: CabinetConfig = {
  width: 800,
  depth: 500,
  height: 1000,
  thickness: 18,
  includeBack: true,
  constructionMethod: "butt-joint",
};

export const useCabinetStore = create<CabinetState>()(
  persist(
    (set, get) => ({
      // Initial state
      cabinets: [],
      activeCabinetId: null,

      // Get active cabinet
      getActiveCabinet: () => {
        const { cabinets, activeCabinetId } = get();
        return cabinets.find((c) => c.id === activeCabinetId) || null;
      },

      // Get cabinet by ID
      getCabinetById: (id: string) => {
        const { cabinets } = get();
        return cabinets.find((c) => c.id === id);
      },

      // Add a new cabinet
      addCabinet: (name: string, config: CabinetConfig) => {
        const id = generateId();
        const cutList = generateCutList(config);
        const cabinet: Cabinet = {
          id,
          name,
          config,
          cutList,
          createdAt: Date.now(),
        };

        set((state) => ({
          cabinets: [...state.cabinets, cabinet],
          activeCabinetId: id,
        }));

        return id;
      },

      // Update cabinet configuration
      updateCabinet: (id: string, config: CabinetConfig) => {
        set((state) => ({
          cabinets: state.cabinets.map((cabinet) =>
            cabinet.id === id
              ? {
                  ...cabinet,
                  config,
                  cutList: generateCutList(config),
                }
              : cabinet
          ),
        }));
      },

      // Delete cabinet
      deleteCabinet: (id: string) => {
        set((state) => {
          const newCabinets = state.cabinets.filter((c) => c.id !== id);
          const newActiveCabinetId =
            state.activeCabinetId === id
              ? newCabinets[0]?.id || null
              : state.activeCabinetId;

          return {
            cabinets: newCabinets,
            activeCabinetId: newActiveCabinetId,
          };
        });
      },

      // Set active cabinet
      setActiveCabinet: (id: string) => {
        set({ activeCabinetId: id });
      },

      // Rename cabinet
      renameCabinet: (id: string, name: string) => {
        set((state) => ({
          cabinets: state.cabinets.map((cabinet) =>
            cabinet.id === id ? { ...cabinet, name } : cabinet
          ),
        }));
      },

      // Generate cut list for specific cabinet
      generateCutListForCabinet: (id: string) => {
        set((state) => ({
          cabinets: state.cabinets.map((cabinet) =>
            cabinet.id === id
              ? {
                  ...cabinet,
                  cutList: generateCutList(cabinet.config),
                }
              : cabinet
          ),
        }));
      },

      // Clear all cabinets
      clearAll: () => {
        set({ cabinets: [], activeCabinetId: null });
      },
    }),
    {
      name: "cabinet-storage",
      // Only persist cabinets and activeCabinetId
      partialize: (state) => ({
        cabinets: state.cabinets,
        activeCabinetId: state.activeCabinetId,
      }),
    }
  )
);

// Compatibility exports for components that still use old API
export const useCabinetStoreCompat = () => {
  const store = useCabinetStore();
  const activeCabinet = store.getActiveCabinet();

  return {
    config: activeCabinet?.config || null,
    cutList: activeCabinet?.cutList || [],
    setCabinetConfig: (config: CabinetConfig) => {
      if (activeCabinet) {
        store.updateCabinet(activeCabinet.id, config);
      } else {
        // Create new cabinet if none exists
        store.addCabinet("Cabinet 1", config);
      }
    },
    updateConfig: (updates: Partial<CabinetConfig>) => {
      if (activeCabinet) {
        const newConfig = { ...activeCabinet.config, ...updates };
        store.updateCabinet(activeCabinet.id, newConfig);
      }
    },
    generateCutList: () => {
      if (activeCabinet) {
        store.generateCutListForCabinet(activeCabinet.id);
      }
    },
    resetCabinet: () => {
      if (activeCabinet) {
        store.deleteCabinet(activeCabinet.id);
      }
    },
  };
};
