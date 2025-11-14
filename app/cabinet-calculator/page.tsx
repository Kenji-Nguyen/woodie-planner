/**
 * Cabinet Calculator Page
 *
 * Main page for the cabinet cut list calculator
 */

import CabinetForm from "@/components/CabinetForm";
import CutList from "@/components/CutList";
import CutVisualizer from "@/components/CutVisualizer";
import StockForm from "@/components/StockForm";
import StockInventory from "@/components/StockInventory";
import Link from "next/link";

export const metadata = {
  title: "Cabinet Calculator | Woodie Planner",
  description:
    "Calculate cut lists for wood furniture. Enter cabinet dimensions and get accurate piece measurements.",
};

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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
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

        {/* Visualization Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Visual Preview
            </h2>
            <p className="text-gray-600 mt-1">
              See how your cabinet pieces look laid out
            </p>
          </div>
          <CutVisualizer />
        </div>

        {/* Stock Management Section */}
        <div className="mt-12">
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
              <li>
                • In the next phase, you&apos;ll be able to optimize cuts from your stock
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
