"use client";

import { useState } from "react";
import { useStockStore } from "@/store/stock-store";
import { formatDimension, calculateArea } from "@/lib/utils";

export default function StockInventory() {
  const stockPieces = useStockStore((state) => state.stockPieces);
  const removeStock = useStockStore((state) => state.removeStock);
  const updateStock = useStockStore((state) => state.updateStock);
  const clearStock = useStockStore((state) => state.clearStock);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWidth, setEditWidth] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleEdit = (id: string, width: number, height: number) => {
    setEditingId(id);
    setEditWidth(width.toString());
    setEditHeight(height.toString());
  };

  const handleSaveEdit = (id: string) => {
    const widthNum = parseFloat(editWidth);
    const heightNum = parseFloat(editHeight);

    if (
      !isNaN(widthNum) &&
      !isNaN(heightNum) &&
      widthNum >= 100 &&
      heightNum >= 100 &&
      widthNum <= 5000 &&
      heightNum <= 5000
    ) {
      updateStock(id, widthNum, heightNum);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditWidth("");
    setEditHeight("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this stock piece?")) {
      removeStock(id);
    }
  };

  const handleClearAll = () => {
    clearStock();
    setShowClearConfirm(false);
  };

  if (stockPieces.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No stock pieces yet
        </h3>
        <p className="text-gray-500">
          Add your available wood pieces using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Stock Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {stockPieces.length} piece{stockPieces.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
        {stockPieces.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Clear All Confirmation */}
      {showClearConfirm && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to delete all stock pieces? This action cannot
            be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
            >
              Yes, Delete All
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stock List */}
      <div className="space-y-3">
        {stockPieces.map((piece) => (
          <div
            key={piece.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            {editingId === piece.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={editWidth}
                    onChange={(e) => setEditWidth(e.target.value)}
                    placeholder="Width (mm)"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="100"
                    max="5000"
                  />
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    placeholder="Height (mm)"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="100"
                    max="5000"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(piece.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {formatDimension(piece.width)} × {formatDimension(piece.height)} mm
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Area: {calculateArea(piece.width, piece.height)}
                    <span
                      className={`ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        piece.available
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {piece.available ? "Available" : "Used"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(piece.id, piece.width, piece.height)}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(piece.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
