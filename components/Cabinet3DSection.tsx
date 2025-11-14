"use client";

import { useCabinetStoreCompat } from "@/store/cabinet-store";
import dynamic from "next/dynamic";

// Dynamic import for 3D viewer to avoid SSR issues
const Cabinet3DViewer = dynamic(
  () => import("./Cabinet3DViewer").then((mod) => ({ default: mod.Cabinet3DViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[80vh] bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-center">
        <div className="text-gray-600 text-lg animate-pulse">Loading 3D view...</div>
      </div>
    ),
  }
);

export default function Cabinet3DSection() {
  const { config, cutList } = useCabinetStoreCompat();

  // Don't render if no cabinet has been generated yet
  if (!config || cutList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No cabinet to preview</p>
          <p className="text-sm mt-2">Generate a cut list first to see the 3D visualization</p>
        </div>
      </div>
    );
  }

  return <Cabinet3DViewer config={config} />;
}
