import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StockPiece } from "@/lib/types";

interface StockStore {
  // State
  stockPieces: StockPiece[];

  // Actions
  addStock: (width: number, height: number) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, width: number, height: number) => void;
  clearStock: () => void;
  toggleAvailability: (id: string) => void;
}

// Helper to generate unique IDs
const generateId = () => `stock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useStockStore = create<StockStore>()(
  persist(
    (set) => ({
      // Initial state
      stockPieces: [],

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
    }),
    {
      name: "woodie-stock-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Handle storage errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error loading stock from localStorage:", error);
        }
      },
    }
  )
);
