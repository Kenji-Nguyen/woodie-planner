/**
 * Cabinet Calculator Page
 *
 * Main page for the cabinet cut list calculator
 */

import CabinetForm from "@/components/CabinetForm";
import CutList from "@/components/CutList";
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
      </main>
    </div>
  );
}
