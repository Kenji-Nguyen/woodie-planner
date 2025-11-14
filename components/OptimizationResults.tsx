"use client";

import { useStockStore } from "@/store/stock-store";
import { useCabinetStoreCompat } from "@/store/cabinet-store";
import { formatDimension, calculateArea } from "@/lib/utils";
import { calculateWasteStats } from "@/lib/stock-matcher";

export default function OptimizationResults() {
  const optimizationResults = useStockStore(
    (state) => state.optimizationResults
  );
  const stockPieces = useStockStore((state) => state.stockPieces);
  const { cutList } = useCabinetStoreCompat();

  if (!optimizationResults || optimizationResults.length === 0) {
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
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No optimization results yet
        </h3>
        <p className="text-gray-500">
          Run optimization to see detailed cutting layouts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Optimization Details
      </h2>

      <div className="space-y-6">
        {optimizationResults.map((layout, index) => {
          const stock = stockPieces.find((s) => s.id === layout.stockPieceId);
          if (!stock) return null;

          const stats = calculateWasteStats(layout, stock);

          return (
            <div
              key={layout.stockPieceId}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              {/* Stock Piece Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Stock Piece #{index + 1}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDimension(stock.width)} × {formatDimension(stock.height)} mm
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      layout.wastePercentage < 15
                        ? "text-green-600"
                        : layout.wastePercentage < 30
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {layout.wastePercentage.toFixed(1)}% waste
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {stats.efficiency.toFixed(1)}% efficiency
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">Stock Area</div>
                  <div className="font-medium text-gray-900">
                    {calculateArea(stock.width, stock.height)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Used Area</div>
                  <div className="font-medium text-gray-900">
                    {(stats.usedArea / 1000000).toFixed(2)} m²
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Waste Area</div>
                  <div className="font-medium text-gray-900">
                    {(stats.wasteArea / 1000000).toFixed(2)} m²
                  </div>
                </div>
              </div>

              {/* Pieces Placed */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Pieces Placed ({layout.cuts.length}):
                </h4>
                <div className="space-y-2">
                  {layout.cuts.map((cut) => {
                    // Find the original piece name
                    const pieceId = cut.cutPieceId.split("_")[0];
                    const piece = cutList.find((p) => p.id === pieceId);

                    return (
                      <div
                        key={cut.cutPieceId}
                        className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {cut.cutSequence}
                          </span>
                          <span className="font-medium text-gray-900">
                            {piece?.name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span>
                            {formatDimension(cut.width)} × {formatDimension(cut.height)} mm
                          </span>
                          {cut.rotated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              Rotated 90°
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
