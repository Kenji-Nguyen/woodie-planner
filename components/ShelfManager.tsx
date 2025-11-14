/**
 * ShelfManager Component
 *
 * Sidebar component for managing cabinet shelves with auto and manual modes
 */
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCabinetStoreCompat } from "@/store/cabinet-store";
import { generateId } from "@/lib/utils";
import { Layers, Plus, Trash2 } from "lucide-react";
import type { ManualShelf } from "@/lib/types";

export default function ShelfManager() {
  const { config, updateConfig } = useCabinetStoreCompat();
  const [open, setOpen] = useState(false);

  // Handle null config (cabinet not yet created)
  if (!config) {
    return null;
  }

  // Initialize manual shelves if not set
  const shelfMode = config.shelfMode || "auto";
  const manualShelves = config.manualShelves || [];

  const handleAddManualShelf = () => {
    const newShelf: ManualShelf = {
      id: generateId(),
      position: 100, // Default 100mm from bottom
      thickness: config.thickness, // Default to cabinet thickness
    };
    updateConfig({
      shelfMode: "manual",
      manualShelves: [...manualShelves, newShelf],
    });
  };

  const handleRemoveManualShelf = (id: string) => {
    updateConfig({
      manualShelves: manualShelves.filter((s) => s.id !== id),
    });
  };

  const handleUpdateManualShelf = (
    id: string,
    updates: Partial<ManualShelf>
  ) => {
    updateConfig({
      manualShelves: manualShelves.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium underline">
          Manual Mode
          {shelfMode === "manual" && manualShelves.length > 0 ? (
            <span className="ml-1">({manualShelves.length})</span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-2 pb-6 border-b">
          <SheetTitle className="text-2xl font-bold">Manual Shelf Positioning</SheetTitle>
          <SheetDescription className="text-base">
            Set custom positions and individual thickness for each shelf.
            Position is measured from the bottom of the cabinet.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-2">
              <div className="text-amber-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-amber-900">
                  Each shelf can have a custom position and thickness.
                  Position is measured from the bottom of the cabinet.
                </p>
                <p className="text-xs text-amber-800 mt-2">
                  Tip: Use the main form for evenly spaced shelves, or add manual shelves here for precise control.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddManualShelf}
            variant="default"
            className="w-full h-11 text-base font-medium"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Manual Shelf
          </Button>

          {manualShelves.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Layers className="mx-auto h-16 w-16 text-gray-300" />
              <p className="mt-4 text-base font-medium text-gray-500">
                No manual shelves added
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Click &quot;Add Manual Shelf&quot; above to get started
              </p>
            </div>
          ) : (
                <div className="space-y-3">
                  {manualShelves.map((shelf, index) => (
                    <div
                      key={shelf.id}
                      className="rounded-lg border-2 border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {index + 1}
                          </span>
                          Shelf {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveManualShelf(shelf.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`position-${shelf.id}`} className="text-sm font-medium">
                            Position from Bottom (mm)
                          </Label>
                          <Input
                            id={`position-${shelf.id}`}
                            type="number"
                            min="0"
                            max={config.height}
                            value={shelf.position}
                            onChange={(e) =>
                              handleUpdateManualShelf(shelf.id, {
                                position: parseInt(e.target.value) || 0,
                              })
                            }
                            className="mt-1.5 h-10"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Max: {config.height}mm
                          </p>
                        </div>

                        <div>
                          <Label htmlFor={`thickness-${shelf.id}`} className="text-sm font-medium">
                            Material Thickness
                          </Label>
                          <Select
                            value={shelf.thickness.toString()}
                            onValueChange={(value) =>
                              handleUpdateManualShelf(shelf.id, {
                                thickness: parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger id={`thickness-${shelf.id}`} className="mt-1.5 h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12mm</SelectItem>
                              <SelectItem value="15">15mm</SelectItem>
                              <SelectItem value="18">18mm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
