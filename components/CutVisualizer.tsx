"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import { useCabinetStore } from "@/store/cabinet-store";
import {
  createSimpleLayout,
  calculateBoundingBox,
  getCategoryColor,
  calculateFitScale,
  type LayoutPosition,
} from "@/lib/layout-helper";

export default function CutVisualizer() {
  const cutList = useCabinetStore((state) => state.cutList);
  const [positions, setPositions] = useState<LayoutPosition[]>([]);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update layout when cut list changes
  useEffect(() => {
    if (cutList.length > 0) {
      const layout = createSimpleLayout(cutList, 1200, 20);
      setPositions(layout);
    } else {
      setPositions([]);
    }
  }, [cutList]);

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.max(600, window.innerHeight - 400);
        setStageSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  const handleFitToScreen = () => {
    if (positions.length === 0) return;

    const boundingBox = calculateBoundingBox(positions);
    const fitScale = calculateFitScale(
      boundingBox.width,
      boundingBox.height,
      stageSize.width - 40,
      stageSize.height - 40
    );
    setScale(fitScale);
  };

  // Empty state
  if (cutList.length === 0) {
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
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No visualization yet
        </h3>
        <p className="text-gray-500">
          Generate a cut list to see the visual layout
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Controls */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Cut Piece Preview
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {positions.length} piece{positions.length !== 1 ? "s" : ""} • Scale:{" "}
              {Math.round(scale * 100)}%
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              title="Reset Zoom"
            >
              Reset
            </button>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleFitToScreen}
              className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="bg-gray-100 overflow-auto"
        style={{ height: stageSize.height }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            {/* Render each positioned piece */}
            {positions.map((pos) => (
              <Group key={pos.id} x={pos.x} y={pos.y}>
                {/* Rectangle for the piece */}
                <Rect
                  width={pos.width}
                  height={pos.height}
                  fill={getCategoryColor(pos.category)}
                  stroke="#1F2937"
                  strokeWidth={2}
                  shadowColor="rgba(0, 0, 0, 0.2)"
                  shadowBlur={5}
                  shadowOffset={{ x: 2, y: 2 }}
                  shadowOpacity={0.3}
                  cornerRadius={4}
                />

                {/* Dimension Label */}
                <Text
                  text={`${Math.round(pos.width)}×${Math.round(pos.height)}`}
                  fontSize={Math.max(14, Math.min(pos.width / 8, 20))}
                  fill="white"
                  fontStyle="bold"
                  align="center"
                  verticalAlign="middle"
                  width={pos.width}
                  height={pos.height}
                  shadowColor="rgba(0, 0, 0, 0.5)"
                  shadowBlur={3}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-700 font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getCategoryColor("top") }}
            />
            <span className="text-gray-600">Top/Bottom</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getCategoryColor("side") }}
            />
            <span className="text-gray-600">Sides</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getCategoryColor("back") }}
            />
            <span className="text-gray-600">Back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
