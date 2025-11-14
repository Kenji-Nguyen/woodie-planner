"use client";

import { Line, Html } from "@react-three/drei";
import { CabinetConfig } from "@/lib/types";
import { mmToUnits, formatDimension } from "@/lib/cabinet-3d-utils";

interface DimensionAnnotationsProps {
  config: CabinetConfig;
  visible?: boolean;
}

export function DimensionAnnotations({
  config,
  visible = true,
}: DimensionAnnotationsProps) {
  if (!visible) return null;

  const { width, depth, height } = config;

  // Convert to Three.js units
  const w = mmToUnits(width);
  const d = mmToUnits(depth);
  const h = mmToUnits(height);

  // Offset for dimension lines (outside the cabinet)
  const offset = 3;

  return (
    <group>
      {/* Width dimension (X axis) - front bottom */}
      <group>
        <Line
          points={[
            [-w / 2, -h / 2 - offset, d / 2],
            [w / 2, -h / 2 - offset, d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        {/* End caps */}
        <Line
          points={[
            [-w / 2, -h / 2 - offset - 0.5, d / 2],
            [-w / 2, -h / 2 - offset + 0.5, d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Line
          points={[
            [w / 2, -h / 2 - offset - 0.5, d / 2],
            [w / 2, -h / 2 - offset + 0.5, d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Html position={[0, -h / 2 - offset - 1.5, d / 2]} center>
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap pointer-events-none">
            W: {formatDimension(width)}
          </div>
        </Html>
      </group>

      {/* Depth dimension (Z axis) - right bottom */}
      <group>
        <Line
          points={[
            [w / 2 + offset, -h / 2, -d / 2],
            [w / 2 + offset, -h / 2, d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        {/* End caps */}
        <Line
          points={[
            [w / 2 + offset - 0.5, -h / 2, -d / 2],
            [w / 2 + offset + 0.5, -h / 2, -d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Line
          points={[
            [w / 2 + offset - 0.5, -h / 2, d / 2],
            [w / 2 + offset + 0.5, -h / 2, d / 2],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Html position={[w / 2 + offset + 1.5, -h / 2, 0]} center>
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap pointer-events-none">
            D: {formatDimension(depth)}
          </div>
        </Html>
      </group>

      {/* Height dimension (Y axis) - right front */}
      <group>
        <Line
          points={[
            [w / 2 + offset, -h / 2, d / 2 + offset],
            [w / 2 + offset, h / 2, d / 2 + offset],
          ]}
          color="#666666"
          lineWidth={2}
        />
        {/* End caps */}
        <Line
          points={[
            [w / 2 + offset - 0.5, -h / 2, d / 2 + offset],
            [w / 2 + offset + 0.5, -h / 2, d / 2 + offset],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Line
          points={[
            [w / 2 + offset - 0.5, h / 2, d / 2 + offset],
            [w / 2 + offset + 0.5, h / 2, d / 2 + offset],
          ]}
          color="#666666"
          lineWidth={2}
        />
        <Html position={[w / 2 + offset + 1.5, 0, d / 2 + offset]} center>
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap pointer-events-none">
            H: {formatDimension(height)}
          </div>
        </Html>
      </group>
    </group>
  );
}
