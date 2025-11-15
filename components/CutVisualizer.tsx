"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import { useCabinetStoreCompat } from "@/store/cabinet-store";
import { useStockStore } from "@/store/stock-store";
import {
  createSimpleLayout,
  calculateBoundingBox,
  getCategoryColor,
  getThicknessColor,
  getCombinedColor,
  calculateFitScale,
  type LayoutPosition,
} from "@/lib/layout-helper";

export default function CutVisualizer() {
  const { cutList } = useCabinetStoreCompat();
  const stockPieces = useStockStore((state) => state.stockPieces);
  const optimizationResults = useStockStore(
    (state) => state.optimizationResults
  );

  const [positions, setPositions] = useState<LayoutPosition[]>([]);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedStockIndex, setSelectedStockIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine which mode we're in
  const hasOptimizationResults = optimizationResults && optimizationResults.length > 0;

  // Update layout when cut list changes (preview mode)
  useEffect(() => {
    if (!hasOptimizationResults && cutList.length > 0) {
      const layout = createSimpleLayout(cutList, 1200, 20);
      setPositions(layout);
    } else if (!hasOptimizationResults) {
      setPositions([]);
    }
  }, [cutList, hasOptimizationResults]);

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
    if (hasOptimizationResults) {
      const currentLayout = optimizationResults[selectedStockIndex];
      const stock = stockPieces.find((s) => s.id === currentLayout?.stockPieceId);
      if (stock) {
        const fitScale = calculateFitScale(
          stock.width + 40,
          stock.height + 40,
          stageSize.width - 40,
          stageSize.height - 40
        );
        setScale(fitScale);
      }
    } else if (positions.length > 0) {
      const boundingBox = calculateBoundingBox(positions);
      const fitScale = calculateFitScale(
        boundingBox.width,
        boundingBox.height,
        stageSize.width - 40,
        stageSize.height - 40
      );
      setScale(fitScale);
    }
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

  // Render optimized layout on stock
  if (hasOptimizationResults) {
    const currentLayout = optimizationResults[selectedStockIndex];
    const stock = stockPieces.find((s) => s.id === currentLayout?.stockPieceId);

    if (!stock || !currentLayout) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with Controls */}
        <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Optimized Cutting Layout
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Stock #{selectedStockIndex + 1}/{optimizationResults.length} •
                Scale: {Math.round(scale * 100)}%
              </p>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleZoomOut}
                className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm font-medium transition-colors touch-manipulation"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                −
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium transition-colors touch-manipulation"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm font-medium transition-colors touch-manipulation"
                title="Zoom In"
                aria-label="Zoom In"
              >
                +
              </button>
              <button
                onClick={handleFitToScreen}
                className="px-2 sm:px-3 py-2 bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-colors touch-manipulation"
                title="Fit to Screen"
                aria-label="Fit to Screen"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Stock Piece Tabs */}
          {optimizationResults.length > 1 && (
            <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1 scrollbar-thin">
              {optimizationResults.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedStockIndex(index)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors touch-manipulation ${
                    index === selectedStockIndex
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                  aria-label={`View stock piece ${index + 1}`}
                >
                  Stock #{index + 1}
                </button>
              ))}
            </div>
          )}
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
              {/* Stock piece background */}
              <Rect
                x={20}
                y={20}
                width={stock.width}
                height={stock.height}
                fill="#F3F4F6"
                stroke="#9CA3AF"
                strokeWidth={3}
                dash={[10, 5]}
              />

              {/* Stock dimensions label */}
              <Text
                x={20}
                y={5}
                text={`Stock: ${Math.round(stock.width)}×${Math.round(stock.height)}mm`}
                fontSize={14}
                fill="#374151"
                fontStyle="bold"
              />

              {/* Render placed pieces */}
              {currentLayout.cuts.map((cut) => {
                // Find the original piece to get its category and thickness
                const pieceId = cut.cutPieceId.split("_")[0];
                const piece = cutList.find((p) => p.id === pieceId);
                const color = piece
                  ? getCombinedColor(piece.category, piece.thickness)
                  : "#6B7280";

                return (
                  <Group key={cut.cutPieceId} x={20 + cut.x} y={20 + cut.y}>
                    {/* Rectangle for the piece */}
                    <Rect
                      width={cut.width}
                      height={cut.height}
                      fill={color}
                      stroke="#1F2937"
                      strokeWidth={2}
                      shadowColor="rgba(0, 0, 0, 0.2)"
                      shadowBlur={5}
                      shadowOffset={{ x: 2, y: 2 }}
                      shadowOpacity={0.3}
                      cornerRadius={4}
                    />

                    {/* Cut sequence badge */}
                    <Group x={8} y={8}>
                      <Rect
                        width={24}
                        height={24}
                        fill="white"
                        stroke="#1F2937"
                        strokeWidth={1}
                        cornerRadius={12}
                      />
                      <Text
                        text={cut.cutSequence.toString()}
                        fontSize={12}
                        fontStyle="bold"
                        fill="#1F2937"
                        align="center"
                        verticalAlign="middle"
                        width={24}
                        height={24}
                      />
                    </Group>

                    {/* Dimension Label */}
                    <Text
                      text={`${Math.round(cut.width)}×${Math.round(cut.height)}${
                        cut.rotated ? " ↻" : ""
                      }`}
                      fontSize={Math.max(12, Math.min(cut.width / 10, 16))}
                      fill="white"
                      fontStyle="bold"
                      align="center"
                      verticalAlign="middle"
                      width={cut.width}
                      y={cut.height / 2 - 8}
                      shadowColor="rgba(0, 0, 0, 0.5)"
                      shadowBlur={3}
                    />
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>

        {/* Legend */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <span className="text-gray-700 font-medium">Legend:</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              <span className="text-gray-500">• Numbers = cut order</span>
              <span className="text-gray-500">• ↻ = 90° rotation</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render simple preview mode
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Controls */}
      <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Cut Piece Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {positions.length} piece{positions.length !== 1 ? "s" : ""} • Scale:{" "}
              {Math.round(scale * 100)}%
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleZoomOut}
              className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm font-medium transition-colors touch-manipulation"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium transition-colors touch-manipulation"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              Reset
            </button>
            <button
              onClick={handleZoomIn}
              className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-sm font-medium transition-colors touch-manipulation"
              title="Zoom In"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleFitToScreen}
              className="px-2 sm:px-3 py-2 bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium transition-colors touch-manipulation"
              title="Fit to Screen"
              aria-label="Fit to Screen"
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
                  fill={getCombinedColor(pos.category, pos.thickness)}
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
      <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <span className="text-gray-700 font-medium">Legend:</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
    </div>
  );
}
