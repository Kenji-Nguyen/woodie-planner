"use client";

/**
 * Cabinet Form Component
 *
 * Input form for cabinet dimensions and configuration
 */

import { useState } from "react";
import { useCabinetStoreCompat, defaultConfig } from "@/store/cabinet-store";
import { validateCabinetConfig } from "@/lib/utils";
import type { CabinetConfig } from "@/lib/types";
import ShelfManager from "@/components/ShelfManager";

export default function CabinetForm() {
  const { setCabinetConfig, generateCutList } = useCabinetStoreCompat();

  const [formData, setFormData] = useState<Partial<CabinetConfig>>({
    width: defaultConfig.width,
    depth: defaultConfig.depth,
    height: defaultConfig.height,
    thickness: defaultConfig.thickness,
    includeBack: defaultConfig.includeBack,
    constructionMethod: defaultConfig.constructionMethod,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (
    field: keyof CabinetConfig,
    value: number | boolean | string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = validateCabinetConfig(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Set config and generate cut list
    const config = formData as CabinetConfig;
    setCabinetConfig(config);
    generateCutList();

    // Clear errors
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Cabinet Dimensions</h2>

        <div className="space-y-4">
          {/* Width Input */}
          <div>
            <label
              htmlFor="width"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Width (mm)
            </label>
            <input
              type="number"
              id="width"
              value={formData.width || ""}
              onChange={(e) =>
                handleInputChange("width", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="800"
              min="100"
              max="5000"
              required
            />
          </div>

          {/* Depth Input */}
          <div>
            <label
              htmlFor="depth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Depth (mm)
            </label>
            <input
              type="number"
              id="depth"
              value={formData.depth || ""}
              onChange={(e) =>
                handleInputChange("depth", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="500"
              min="100"
              max="5000"
              required
            />
          </div>

          {/* Height Input */}
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (mm)
            </label>
            <input
              type="number"
              id="height"
              value={formData.height || ""}
              onChange={(e) =>
                handleInputChange("height", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000"
              min="100"
              max="5000"
              required
            />
          </div>

          {/* Thickness Dropdown */}
          <div>
            <label
              htmlFor="thickness"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Material Thickness
            </label>
            <select
              id="thickness"
              value={formData.thickness || 18}
              onChange={(e) =>
                handleInputChange("thickness", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={12}>12mm</option>
              <option value={15}>15mm</option>
              <option value={18}>18mm</option>
            </select>
          </div>

          {/* Include Back Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeBack"
              checked={formData.includeBack ?? true}
              onChange={(e) =>
                handleInputChange("includeBack", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeBack"
              className="ml-2 block text-sm text-gray-700"
            >
              Include back panel
            </label>
          </div>

          {/* Number of Shelves */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="shelfCount"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Shelves
              </label>
              <ShelfManager />
            </div>
            <input
              type="number"
              id="shelfCount"
              value={formData.autoShelfCount || 0}
              onChange={(e) => {
                const count = parseInt(e.target.value) || 0;
                handleInputChange("autoShelfCount", Math.max(0, Math.min(count, 20)));
                handleInputChange("shelfMode", "auto");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              max="20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Shelves will be evenly spaced. Use manual mode for custom positions.
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-800 mb-1">
              Please fix the following errors:
            </p>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Generate Cut List
        </button>
      </div>
    </form>
  );
}
