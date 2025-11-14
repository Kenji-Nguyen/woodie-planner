"use client";

import { useState } from "react";
import { useStockStore } from "@/store/stock-store";

export default function StockForm() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addStock = useStockStore((state) => state.addStock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);

    if (!width || !height) {
      setError("Please enter both width and height");
      return;
    }

    if (isNaN(widthNum) || isNaN(heightNum)) {
      setError("Please enter valid numbers");
      return;
    }

    if (widthNum <= 0 || heightNum <= 0) {
      setError("Dimensions must be positive numbers");
      return;
    }

    if (widthNum < 100 || heightNum < 100) {
      setError("Dimensions must be at least 100mm");
      return;
    }

    if (widthNum > 5000 || heightNum > 5000) {
      setError("Dimensions cannot exceed 5000mm");
      return;
    }

    // Add stock piece
    addStock(widthNum, heightNum);

    // Show success feedback
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    // Clear form
    setWidth("");
    setHeight("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Add Stock Piece
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Width Input */}
          <div>
            <label
              htmlFor="stock-width"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Width (mm)
            </label>
            <input
              id="stock-width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g., 1220"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
              max="5000"
              step="0.01"
            />
          </div>

          {/* Height Input */}
          <div>
            <label
              htmlFor="stock-height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (mm)
            </label>
            <input
              id="stock-height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 2440"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
              max="5000"
              step="0.01"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            Stock piece added successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Stock Piece
        </button>
      </form>

      {/* Helper Text */}
      <p className="mt-4 text-sm text-gray-500">
        Enter the dimensions of your available plywood or wood sheets. Common
        sizes: 1220×2440mm (4'×8'), 1525×3050mm (5'×10')
      </p>
    </div>
  );
}
