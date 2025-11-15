"use client";

/**
 * Cut List Display Component
 *
 * Displays the generated cut list in a table format with summary
 */

import { useCabinetStoreCompat } from "@/store/cabinet-store";
import { formatDimensions, formatArea } from "@/lib/utils";
import { getCutListSummary } from "@/lib/cabinet-generator";

export default function CutList() {
  const { cutList } = useCabinetStoreCompat();

  // If no cut list, show empty state
  if (cutList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Cut List</h2>
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">
            No cut list generated yet. Enter cabinet dimensions and click
            &quot;Generate Cut List&quot;.
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary
  const summary = getCutListSummary(cutList);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Cut List</h2>

      {/* Summary Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Pieces</p>
            <p className="text-2xl font-semibold text-gray-900">
              {summary.totalPieces}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Area</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatArea(summary.totalArea)}
            </p>
          </div>
        </div>

        {/* Material Breakdown by Thickness */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Material Requirements by Thickness:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(summary.areaByThickness)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([thickness, area]) => {
                const piecesOfThisThickness = cutList.filter(
                  (p) => p.thickness === parseInt(thickness)
                );
                const pieceCount = piecesOfThisThickness.reduce(
                  (sum, p) => sum + p.quantity,
                  0
                );
                return (
                  <div
                    key={thickness}
                    className="flex items-center justify-between px-3 py-2 rounded bg-gray-200 text-gray-800"
                  >
                    <span className="text-xs font-semibold">{thickness}mm:</span>
                    <div className="text-xs text-right">
                      <div className="font-medium">{formatArea(area as number)}</div>
                      <div className="text-gray-600">
                        {pieceCount} piece{pieceCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Cut List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Part Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dimensions
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thickness
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Area
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cutList.map((piece) => (
              <tr key={piece.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {piece.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {formatDimensions(piece.width, piece.height)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {piece.thickness}mm
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {piece.quantity}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {formatArea(piece.width * piece.height * piece.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Breakdown by Category */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Pieces by Category:
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(summary.piecesByCategory).map(([category, count]) => (
            <span
              key={category}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              <span className="capitalize">{category}</span>:{" "}
              <span className="ml-1 font-semibold">{count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
