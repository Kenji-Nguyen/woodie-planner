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

// Cabinet type presets
const CABINET_PRESETS = {
  custom: {
    name: "Custom",
    width: 800,
    depth: 500,
    height: 1000,
    thickness: 18,
    includeBack: true,
  },
  "base-kitchen": {
    name: "Base Kitchen Cabinet",
    width: 600,
    depth: 600,
    height: 720,
    thickness: 18,
    includeBack: true,
  },
  "wall-kitchen": {
    name: "Wall Kitchen Cabinet",
    width: 600,
    depth: 350,
    height: 720,
    thickness: 18,
    includeBack: true,
  },
  "tall-pantry": {
    name: "Tall Pantry Cabinet",
    width: 600,
    depth: 600,
    height: 2100,
    thickness: 18,
    includeBack: true,
  },
  bookshelf: {
    name: "Bookshelf",
    width: 800,
    depth: 300,
    height: 1800,
    thickness: 18,
    includeBack: true,
  },
  "tv-stand": {
    name: "TV Stand",
    width: 1200,
    depth: 400,
    height: 500,
    thickness: 18,
    includeBack: false,
  },
  "bathroom-vanity": {
    name: "Bathroom Vanity",
    width: 900,
    depth: 500,
    height: 850,
    thickness: 18,
    includeBack: false,
  },
  "shoe-cabinet": {
    name: "Shoe Cabinet",
    width: 800,
    depth: 350,
    height: 1000,
    thickness: 15,
    includeBack: true,
  },
} as const;

type PresetKey = keyof typeof CABINET_PRESETS;

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
      const preset = CABINET_PRESETS[presetKey];
      setFormData({
        width: preset.width,
        depth: preset.depth,
        height: preset.height,
        thickness: preset.thickness,
        includeBack: preset.includeBack,
        constructionMethod: defaultConfig.constructionMethod,
        autoShelfCount: formData.autoShelfCount || 0,
        shelfMode: formData.shelfMode || "auto",
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
          {/* Cabinet Type Preset Dropdown */}
          <div>
            <label
              htmlFor="cabinetType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cabinet Type
            </label>
            <select
              id="cabinetType"
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value as PresetKey)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Object.entries(CABINET_PRESETS).map(([key, preset]) => (
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
