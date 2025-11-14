"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CabinetConfig } from "@/lib/types";
import { Cabinet3DScene } from "./Cabinet3DScene";
import { Eye, EyeOff, Grid3x3, Ruler } from "lucide-react";

interface Cabinet3DViewerProps {
  config: CabinetConfig;
}

export function Cabinet3DViewer({ config }: Cabinet3DViewerProps) {
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg overflow-hidden border border-gray-300">
      {/* Canvas */}
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#ffffff"]} />
        <Suspense fallback={null}>
          <Cabinet3DScene
            config={config}
            showDimensions={showDimensions}
            showGrid={showGrid}
          />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Toggle Dimensions */}
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`p-2 rounded-md shadow-md transition-colors ${
            showDimensions
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          title={showDimensions ? "Hide Dimensions" : "Show Dimensions"}
        >
          <Ruler className="w-5 h-5" />
        </button>

        {/* Toggle Grid */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded-md shadow-md transition-colors ${
            showGrid
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <Grid3x3 className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm shadow-lg">
        <div className="font-semibold mb-1">Controls:</div>
        <ul className="text-xs space-y-0.5 opacity-90">
          <li>• Left click + drag to rotate</li>
          <li>• Right click + drag to pan</li>
          <li>• Scroll to zoom</li>
          <li>• Hover over panels to see details</li>
        </ul>
      </div>
    </div>
  );
}
