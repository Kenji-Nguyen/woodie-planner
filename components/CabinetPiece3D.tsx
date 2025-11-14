"use client";

import { useRef, useState } from "react";
import { Mesh } from "three";
import { Panel3D, mmToUnits, getDisplayDimensions } from "@/lib/cabinet-3d-utils";
import { Html } from "@react-three/drei";

interface CabinetPiece3DProps {
  panel: Panel3D;
  visible?: boolean;
  onHover?: (panel: Panel3D | null) => void;
  onClick?: (panel: Panel3D) => void;
}

export function CabinetPiece3D({
  panel,
  visible = true,
  onHover,
  onClick,
}: CabinetPiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  if (!visible) return null;

  const handlePointerOver = () => {
    setIsHovered(true);
    onHover?.(panel);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  const handleClick = () => {
    onClick?.(panel);
  };

  // Convert mm to Three.js units (scaled down by 100)
  const [x, y, z] = panel.position.map(mmToUnits);
  const [width, height, depth] = panel.dimensions.map(mmToUnits);

  // Get display dimensions in L × W × Thickness format
  const [length, widthDisplay, thickness] = getDisplayDimensions(panel);

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[x, y, z]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={isHovered ? "#fbbf24" : panel.color}
          opacity={1}
          transparent={false}
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>

      {/* Label when hovered */}
      {isHovered && (
        <Html position={[x, y + height / 2 + 1, z]} center>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap pointer-events-none">
            <div className="font-semibold">{panel.name}</div>
            <div className="text-xs opacity-80">
              {length}mm × {widthDisplay}mm × {thickness}mm
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
