"use client";

import { useState } from "react";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { CabinetConfig } from "@/lib/types";
import {
  calculatePanelPositions,
  calculateCameraDistance,
  mmToUnits,
  Panel3D,
} from "@/lib/cabinet-3d-utils";
import { CabinetPiece3D } from "./CabinetPiece3D";
import { DimensionAnnotations } from "./DimensionAnnotations";

interface Cabinet3DSceneProps {
  config: CabinetConfig;
  showDimensions?: boolean;
  showGrid?: boolean;
}

export function Cabinet3DScene({
  config,
  showDimensions = true,
  showGrid = true,
}: Cabinet3DSceneProps) {
  const [hoveredPanel, setHoveredPanel] = useState<Panel3D | null>(null);
  const [visiblePanels, setVisiblePanels] = useState<Set<string>>(new Set());

  // Calculate panel positions
  const panels = calculatePanelPositions(config);

  // Calculate optimal camera distance
  const cameraDistance = mmToUnits(calculateCameraDistance(config));

  // Camera position (isometric-ish view)
  const cameraPosition: [number, number, number] = [
    cameraDistance * 0.7,
    cameraDistance * 0.5,
    cameraDistance * 0.7,
  ];

  // Check if panel is visible (either no panels hidden, or panel is not in hidden set)
  const isPanelVisible = (panel: Panel3D) => {
    if (visiblePanels.size === 0) return true; // All visible by default
    return !visiblePanels.has(panel.name);
  };

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={50}
        near={0.1}
        far={10000}
      />

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={cameraDistance * 3}
        target={[0, 0, 0]}
      />

      {/* Lighting - improved for better visibility */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <directionalLight position={[0, -10, 5]} intensity={0.3} />

      {/* Grid helper */}
      {showGrid && (
        <Grid
          args={[100, 100]}
          cellSize={5}
          cellThickness={0.5}
          cellColor="#d1d5db"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={300}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* Cabinet panels */}
      {panels.map((panel, index) => (
        <CabinetPiece3D
          key={`${panel.name}-${index}`}
          panel={panel}
          visible={isPanelVisible(panel)}
          onHover={setHoveredPanel}
        />
      ))}

      {/* Dimension annotations */}
      {showDimensions && <DimensionAnnotations config={config} />}
    </>
  );
}
