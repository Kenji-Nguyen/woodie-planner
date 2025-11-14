import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StockPiece, CutPiece, CutLayout } from "@/lib/types";
import { optimizeCuts, type OptimizationMode } from "@/lib/optimizer";

interface StockStore {
  // State
  stockPieces: StockPiece[];

  // Optimization state
  optimizationResults: CutLayout[] | null;
  unmatchedPieces: CutPiece[];
  optimizationMode: OptimizationMode;
  totalWastePercentage: number;
  isOptimizing: boolean;

  // Actions
  addStock: (width: number, height: number) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, width: number, height: number) => void;
  clearStock: () => void;
  toggleAvailability: (id: string) => void;

  // Optimization actions
  runOptimization: (cutPieces: CutPiece[]) => void;
  setOptimizationMode: (mode: OptimizationMode) => void;
  clearOptimization: () => void;
}

// Helper to generate unique IDs
const generateId = () => `stock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useStockStore = create<StockStore>()(
  persist(
    (set) => ({
      // Initial state
      stockPieces: [],

      // Optimization initial state
      optimizationResults: null,
      unmatchedPieces: [],
      optimizationMode: "minimize-waste",
      totalWastePercentage: 0,
      isOptimizing: false,

      // Add a new stock piece
      addStock: (width: number, height: number) => {
        const newPiece: StockPiece = {
          id: generateId(),
          width,
          height,
          available: true,
        };

        set((state) => ({
          stockPieces: [...state.stockPieces, newPiece],
        }));
      },

      // Remove a stock piece by ID
      removeStock: (id: string) => {
        set((state) => ({
          stockPieces: state.stockPieces.filter((piece) => piece.id !== id),
        }));
      },

      // Update dimensions of an existing stock piece
      updateStock: (id: string, width: number, height: number) => {
        set((state) => ({
          stockPieces: state.stockPieces.map((piece) =>
            piece.id === id ? { ...piece, width, height } : piece
          ),
        }));
      },

      // Clear all stock pieces
      clearStock: () => {
        set({ stockPieces: [] });
      },

      // Toggle availability status (used/available)
      toggleAvailability: (id: string) => {
        set((state) => ({
          stockPieces: state.stockPieces.map((piece) =>
            piece.id === id ? { ...piece, available: !piece.available } : piece
          ),
        }));
      },

      // Run optimization
      runOptimization: (cutPieces: CutPiece[]) => {
        set({ isOptimizing: true });

        // Small delay to show loading state
        setTimeout(() => {
          try {
            set((state) => {
              const result = optimizeCuts(cutPieces, state.stockPieces, {
                mode: state.optimizationMode,
                allowRotation: true,
              });

              return {
                optimizationResults: result.layouts,
                unmatchedPieces: result.unmatchedPieces,
                totalWastePercentage: result.totalWastePercentage,
                isOptimizing: false,
              };
            });
          } catch (error) {
            console.error("Optimization error:", error);
            set({
              isOptimizing: false,
              optimizationResults: null,
              unmatchedPieces: cutPieces,
              totalWastePercentage: 0,
            });
          }
        }, 100);
      },

      // Set optimization mode
      setOptimizationMode: (mode: OptimizationMode) => {
        set({ optimizationMode: mode });
      },

      // Clear optimization results
      clearOptimization: () => {
        set({
          optimizationResults: null,
          unmatchedPieces: [],
          totalWastePercentage: 0,
        });
      },
    }),
    {
      name: "woodie-stock-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Exclude isOptimizing from persistence (it should always start as false)
      partialize: (state) => ({
        stockPieces: state.stockPieces,
        optimizationResults: state.optimizationResults,
        unmatchedPieces: state.unmatchedPieces,
        optimizationMode: state.optimizationMode,
        totalWastePercentage: state.totalWastePercentage,
        // isOptimizing is intentionally excluded
      }),
      // Handle storage errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error loading stock from localStorage:", error);
        }
        // Always reset isOptimizing on rehydration
        if (state) {
          state.isOptimizing = false;
        }
      },
    }
  )
);
