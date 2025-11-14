/**
 * Cabinet Calculator Page
 *
 * Main page for the cabinet cut list calculator with tabbed navigation
 */
"use client";

import CabinetForm from "@/components/CabinetForm";
import CutList from "@/components/CutList";
import CutVisualizer from "@/components/CutVisualizer";
import StockForm from "@/components/StockForm";
import StockInventory from "@/components/StockInventory";
import OptimizationSettings from "@/components/OptimizationSettings";
import OptimizationResults from "@/components/OptimizationResults";
import Cabinet3DSection from "@/components/Cabinet3DSection";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Package, Scissors } from "lucide-react";

export default function CabinetCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 mb-1 inline-block"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Cabinet Calculator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Generate accurate cut lists for your cabinet projects
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Cabinet Design</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Stock Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span>Cut Optimization</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Cabinet Design */}
          <TabsContent value="design" className="space-y-8">
            {/* Cabinet Form & Cut List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div>
                <CabinetForm />
              </div>

              {/* Right Column - Cut List */}
              <div>
                <CutList />
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                How it works
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Enter your cabinet dimensions (width, depth, height) in
                  millimeters
                </li>
                <li>• Select your material thickness (12mm, 15mm, or 18mm)</li>
                <li>
                  • Choose whether to include a back panel or leave it open-backed
                </li>
                <li>
                  • Click &quot;Generate Cut List&quot; to see all pieces you need
                  to cut
                </li>
                <li>
                  • Construction method: Butt-joint (sides sit between top and
                  bottom)
                </li>
              </ul>
            </div>

            {/* 3D Cabinet Preview Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  3D Cabinet Preview
                </h2>
                <p className="text-gray-600 mt-1">
                  Visualize your cabinet in 3D with realistic thickness and dimensions
                </p>
              </div>

              <Cabinet3DSection />

              {/* 3D Preview Info Section */}
              <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-purple-900 mb-2">
                  About 3D Preview
                </h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Rotate the view by clicking and dragging (left mouse button)</li>
                  <li>• Pan the view by right-clicking and dragging</li>
                  <li>• Zoom in/out using the mouse scroll wheel</li>
                  <li>• Hover over panels to see their names and dimensions</li>
                  <li>• Toggle dimensions and grid visibility with the control buttons</li>
                  <li>• All measurements shown are in millimeters (or meters for larger dimensions)</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Stock Inventory */}
          <TabsContent value="stock" className="space-y-8">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Stock Inventory
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your available wood pieces for cut optimization
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Add Stock Form */}
                <div>
                  <StockForm />
                </div>

                {/* Right Column - Stock Inventory List */}
                <div>
                  <StockInventory />
                </div>
              </div>

              {/* Stock Info Section */}
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  About Stock Management
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>
                    • Add your available plywood sheets or wood pieces (dimensions in mm)
                  </li>
                  <li>
                    • Common plywood sizes: 1220×2440mm (4'×8'), 1525×3050mm (5'×10')
                  </li>
                  <li>
                    • Your stock inventory is saved locally in your browser
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Cut Optimization */}
          <TabsContent value="optimization" className="space-y-8">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Cut Optimization & Visual Layout
                </h2>
                <p className="text-gray-600 mt-1">
                  Optimize cuts and see the visual layout of pieces on your stock
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Optimization Settings */}
                <div className="xl:col-span-1">
                  <OptimizationSettings />
                  <div className="mt-4">
                    <OptimizationResults />
                  </div>
                </div>

                {/* Right Column - Visual Preview (takes 2/3 width on large screens) */}
                <div className="xl:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Visual Layout
                    </h3>
                    <CutVisualizer />
                  </div>
                </div>
              </div>

              {/* Optimization Info Section */}
              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-green-900 mb-2">
                  How Optimization Works
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>
                    • The optimizer uses bin packing algorithm to fit pieces onto your stock
                  </li>
                  <li>
                    • <strong>Minimize Waste</strong>: Best material utilization with 90° rotation allowed
                  </li>
                  <li>
                    • <strong>Simplify Cuts</strong>: Easier cutting patterns without rotation
                  </li>
                  <li>
                    • Numbers on pieces in the visual layout show the order of cuts
                  </li>
                  <li>
                    • Click "Run Optimization" to see how pieces fit on your stock with cut sequences
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
