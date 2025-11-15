"use client";

/**
 * Cabinet Form Component
 *
 * Input form for cabinet dimensions and configuration
 */

import { useState, useEffect } from "react";
import { useCabinetStoreCompat, defaultConfig } from "@/store/cabinet-store";
import { validateCabinetConfig } from "@/lib/utils";
import type { CabinetConfig } from "@/lib/types";
import ShelfManager from "@/components/ShelfManager";

// Furniture type presets
const FURNITURE_PRESETS = {
  custom: {
    name: "Custom",
    width: 800,
    depth: 500,
    height: 1000,
    thickness: 18,
    includeBack: true,
    includeTop: true,
    furnitureType: "custom" as const,
  },
  "base-kitchen": {
    name: "Base Kitchen Cabinet",
    width: 600,
    depth: 600,
    height: 720,
    thickness: 18,
    includeBack: true,
    includeTop: true,
    furnitureType: "cabinet" as const,
  },
  "wall-kitchen": {
    name: "Wall Kitchen Cabinet",
    width: 600,
    depth: 350,
    height: 720,
    thickness: 18,
    includeBack: true,
    includeTop: true,
    furnitureType: "cabinet" as const,
  },
  bookshelf: {
    name: "Bookshelf",
    width: 800,
    depth: 300,
    height: 1800,
    thickness: 18,
    includeBack: true,
    includeTop: true,
    furnitureType: "shelf" as const,
  },
  "simple-table": {
    name: "Simple Table",
    width: 1200,
    depth: 700,
    height: 750,
    thickness: 18,
    includeBack: false,
    includeTop: true,
    furnitureType: "table" as const,
  },
  "storage-bench": {
    name: "Storage Bench",
    width: 1000,
    depth: 400,
    height: 450,
    thickness: 18,
    includeBack: false,
    includeTop: true,
    furnitureType: "bench" as const,
  },
  "drawer-unit": {
    name: "Drawer Unit",
    width: 400,
    depth: 500,
    height: 600,
    thickness: 18,
    includeBack: true,
    includeTop: false,
    furnitureType: "drawer" as const,
  },
  "open-box": {
    name: "Open Storage Box",
    width: 600,
    depth: 400,
    height: 400,
    thickness: 15,
    includeBack: false,
    includeTop: false,
    furnitureType: "drawer" as const,
  },
  "desk": {
    name: "Simple Desk",
    width: 1400,
    depth: 600,
    height: 750,
    thickness: 18,
    includeBack: false,
    includeTop: true,
    furnitureType: "table" as const,
  },
  "tv-stand": {
    name: "TV Stand",
    width: 1200,
    depth: 400,
    height: 500,
    thickness: 18,
    includeBack: false,
    includeTop: true,
    furnitureType: "cabinet" as const,
  },
} as const;

type PresetKey = keyof typeof FURNITURE_PRESETS;

const FORM_STORAGE_KEY = "cabinet-form-data";

export default function CabinetForm() {
  const { setCabinetConfig, generateCutList } = useCabinetStoreCompat();

  // Load form data from localStorage on mount
  const [formData, setFormData] = useState<Partial<CabinetConfig>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved form data:", e);
        }
      }
    }
    return {
      width: defaultConfig.width,
      depth: defaultConfig.depth,
      height: defaultConfig.height,
      thickness: defaultConfig.thickness,
      includeBack: defaultConfig.includeBack,
      constructionMethod: defaultConfig.constructionMethod,
    };
  });

  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("custom");
  const [errors, setErrors] = useState<string[]>([]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (
    field: keyof CabinetConfig,
    value: number | boolean | string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // When user manually changes values, switch to custom preset
    setSelectedPreset("custom");
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handlePresetChange = (presetKey: PresetKey) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom") {
      const preset = FURNITURE_PRESETS[presetKey];
      setFormData({
        width: preset.width,
        depth: preset.depth,
        height: preset.height,
        thickness: preset.thickness,
        includeBack: preset.includeBack,
        includeTop: preset.includeTop,
        furnitureType: preset.furnitureType,
        constructionMethod: defaultConfig.constructionMethod,
        autoShelfCount: formData.autoShelfCount || 0,
        shelfMode: formData.shelfMode || "auto",
        includeDoors: formData.includeDoors || false,
        doorCount: formData.doorCount || 1,
      });
    }
    // Clear errors when preset changes
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
          {/* Furniture Type Preset Dropdown */}
          <div>
            <label
              htmlFor="furnitureType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Furniture Type
            </label>
            <select
              id="furnitureType"
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value as PresetKey)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Object.entries(FURNITURE_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select a preset or choose Custom to enter your own dimensions
            </p>
          </div>

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
              <option value={16}>16mm</option>
              <option value={18}>18mm</option>
            </select>
          </div>

          {/* Include Top Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTop"
              checked={formData.includeTop ?? true}
              onChange={(e) =>
                handleInputChange("includeTop", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeTop"
              className="ml-2 block text-sm text-gray-700"
            >
              Include top panel (uncheck for open-top drawer/box)
            </label>
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

          {/* Include Doors Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDoors"
              checked={formData.includeDoors ?? false}
              onChange={(e) =>
                handleInputChange("includeDoors", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeDoors"
              className="ml-2 block text-sm text-gray-700"
            >
              Include doors
            </label>
          </div>

          {/* Number of Doors (conditional) */}
          {formData.includeDoors && (
            <div>
              <label
                htmlFor="doorCount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Doors
              </label>
              <select
                id="doorCount"
                value={formData.doorCount || 1}
                onChange={(e) =>
                  handleInputChange("doorCount", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Door</option>
                <option value={2}>2 Doors</option>
              </select>
            </div>
          )}

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

          {/* Auto Shelf Thickness - Only show when auto shelf count > 0 */}
          {(formData.autoShelfCount ?? 0) > 0 && formData.shelfMode === "auto" && (
            <div>
              <label
                htmlFor="autoShelfThickness"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shelf Thickness
              </label>
              <select
                id="autoShelfThickness"
                value={formData.autoShelfThickness || formData.thickness || 18}
                onChange={(e) =>
                  handleInputChange("autoShelfThickness", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12mm</option>
                <option value={15}>15mm</option>
                <option value={16}>16mm</option>
                <option value={18}>18mm</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                All auto-generated shelves will have this thickness. Defaults to cabinet thickness.
              </p>
            </div>
          )}
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
