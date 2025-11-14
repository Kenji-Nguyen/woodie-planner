"use client";

import { useCabinetStoreCompat } from "@/store/cabinet-store";
import { useStockStore } from "@/store/stock-store";
import { checkStockSufficiency } from "@/lib/optimizer";

export default function OptimizationSettings() {
  const { cutList } = useCabinetStoreCompat();
  const stockPieces = useStockStore((state) => state.stockPieces);
  const optimizationMode = useStockStore((state) => state.optimizationMode);
  const isOptimizing = useStockStore((state) => state.isOptimizing);
  const totalWastePercentage = useStockStore(
    (state) => state.totalWastePercentage
  );
  const optimizationResults = useStockStore(
    (state) => state.optimizationResults
  );
  const unmatchedPieces = useStockStore((state) => state.unmatchedPieces);

  const setOptimizationMode = useStockStore(
    (state) => state.setOptimizationMode
  );
  const runOptimization = useStockStore((state) => state.runOptimization);
  const clearOptimization = useStockStore((state) => state.clearOptimization);

  const handleRunOptimization = () => {
    if (cutList.length === 0 || stockPieces.length === 0) return;
    runOptimization(cutList);
  };

  const handleClearOptimization = () => {
    clearOptimization();
  };

  // Check if we have the required data
  const hasCutList = cutList.length > 0;
  const hasStock = stockPieces.length > 0;
  const canOptimize = hasCutList && hasStock;

  // Check stock sufficiency
  const sufficiency = hasCutList
    ? checkStockSufficiency(cutList, stockPieces)
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Optimization Settings
      </h2>

      {/* Optimization Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Optimization Mode
        </label>
        <div className="space-y-3">
          {/* Minimize Waste Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="minimize-waste"
              checked={optimizationMode === "minimize-waste"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Minimize Waste</div>
              <div className="text-sm text-gray-600">
                Best material utilization. Pieces may be rotated 90° for tighter
                packing.
              </div>
            </div>
          </label>

          {/* Simplify Cuts Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="simplify-cuts"
              checked={optimizationMode === "simplify-cuts"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Simplify Cuts</div>
              <div className="text-sm text-gray-600">
                Easier cutting patterns with fewer operations. No rotation, cleaner
                layouts.
              </div>
            </div>
          </label>

          {/* Grain Direction Priority Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="grain-direction"
              checked={optimizationMode === "grain-direction"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Grain Direction Priority</div>
              <div className="text-sm text-gray-600">
                Keeps all pieces in same orientation to respect wood grain. No rotation for better appearance.
              </div>
            </div>
          </label>

          {/* Minimize Stock Sheets Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="minimize-sheets"
              checked={optimizationMode === "minimize-sheets"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Minimize Stock Sheets</div>
              <div className="text-sm text-gray-600">
                Uses fewer stock pieces even if it means slightly more waste. Saves money on sheet costs.
              </div>
            </div>
          </label>

          {/* Largest First Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="largest-first"
              checked={optimizationMode === "largest-first"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Largest First</div>
              <div className="text-sm text-gray-600">
                Prioritizes fitting largest pieces first, then fills gaps with smaller ones. Good general-purpose strategy.
              </div>
            </div>
          </label>

          {/* Edge Alignment Option */}
          <label className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="optimizationMode"
              value="edge-alignment"
              checked={optimizationMode === "edge-alignment"}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Edge Alignment</div>
              <div className="text-sm text-gray-600">
                Aligns pieces to stock edges when possible. Makes cutting easier with cleaner, straighter cuts.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Stock Sufficiency Warning */}
      {sufficiency && !sufficiency.isSufficient && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Insufficient Stock
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                You need {Math.round(sufficiency.shortfall / 1000000).toFixed(2)} m²
                more material. Some pieces may not fit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Check */}
      {!hasCutList && (
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
          ⚠️ Please generate a cut list first
        </div>
      )}
      {!hasStock && (
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
          ⚠️ Please add stock pieces to your inventory
        </div>
      )}

      {/* Run Optimization Button */}
      <button
        onClick={handleRunOptimization}
        disabled={!canOptimize || isOptimizing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
      >
        {isOptimizing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Optimizing...
          </>
        ) : (
          "Run Optimization"
        )}
      </button>

      {/* Clear Optimization Button */}
      {optimizationResults && (
        <button
          onClick={handleClearOptimization}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Clear Results
        </button>
      )}

      {/* Results Summary */}
      {optimizationResults && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Optimization Results
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Waste:</span>
              <span
                className={`font-medium ${
                  totalWastePercentage < 15
                    ? "text-green-600"
                    : totalWastePercentage < 30
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {totalWastePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stock Pieces Used:</span>
              <span className="font-medium text-gray-900">
                {optimizationResults.length}
              </span>
            </div>
            {unmatchedPieces.length > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-800">
                  {unmatchedPieces.length} piece(s) don't fit
                </p>
                <p className="text-xs text-red-700 mt-1">
                  You need additional or larger stock pieces
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
