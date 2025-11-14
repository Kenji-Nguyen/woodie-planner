"use client";

import { useState } from "react";
import { useCabinetStore } from "@/store/cabinet-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Edit2 } from "lucide-react";

interface CabinetTabsProps {
  children: (cabinetId: string) => React.ReactNode;
}

export default function CabinetTabs({ children }: CabinetTabsProps) {
  const cabinets = useCabinetStore((state) => state.cabinets);
  const activeCabinetId = useCabinetStore((state) => state.activeCabinetId);
  const setActiveCabinet = useCabinetStore((state) => state.setActiveCabinet);
  const addCabinet = useCabinetStore((state) => state.addCabinet);
  const deleteCabinet = useCabinetStore((state) => state.deleteCabinet);
  const renameCabinet = useCabinetStore((state) => state.renameCabinet);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddCabinet = () => {
    const newNumber = cabinets.length + 1;
    addCabinet(`Cabinet ${newNumber}`, {
      width: 800,
      depth: 500,
      height: 1000,
      thickness: 18,
      includeBack: true,
      constructionMethod: "butt-joint",
    });
  };

  const handleDeleteCabinet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cabinets.length === 1) {
      alert("You must have at least one cabinet");
      return;
    }
    if (confirm("Are you sure you want to delete this cabinet?")) {
      deleteCabinet(id);
    }
  };

  const handleStartEdit = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameCabinet(id, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // If no cabinets exist, show empty state
  if (cabinets.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No cabinets yet
        </h3>
        <p className="text-gray-500 mb-4">
          Get started by creating your first cabinet
        </p>
        <button
          onClick={handleAddCabinet}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Cabinet
        </button>
      </div>
    );
  }

  const activeId = activeCabinetId || cabinets[0]?.id;

  return (
    <Tabs
      value={activeId || undefined}
      onValueChange={setActiveCabinet}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <TabsList className="bg-gray-100">
          {cabinets.map((cabinet) => (
            <TabsTrigger
              key={cabinet.id}
              value={cabinet.id}
              className="relative group data-[state=active]:bg-white"
            >
              {editingId === cabinet.id ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(cabinet.id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    onBlur={() => handleSaveEdit(cabinet.id)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{cabinet.name}</span>
                  <button
                    onClick={(e) => handleStartEdit(cabinet.id, cabinet.name, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rename"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  {cabinets.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteCabinet(cabinet.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                      title="Delete cabinet"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <button
          onClick={handleAddCabinet}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
          title="Add new cabinet"
        >
          <Plus className="h-4 w-4" />
          New Cabinet
        </button>
      </div>

      {cabinets.map((cabinet) => (
        <TabsContent key={cabinet.id} value={cabinet.id} className="mt-0">
          {children(cabinet.id)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
