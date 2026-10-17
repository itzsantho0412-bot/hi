import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { SIZE_CHART } from '../data/defaultData';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  fitType?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, fitType = 'Oversized' }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-stone-800" />
            <h3 id="size-guide-title" className="text-lg font-bold text-[#111111]">
              HELIOZ Sizing Guide & Measurements
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fit Notice */}
        <div className="my-4 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-stone-800" />
          <div>
            <strong className="font-semibold text-[#111111]">{fitType} Silhouette Note:</strong> Our oversized and drop-shoulder cuts are intentionally crafted with 2 extra inches in chest width and dropped shoulder seams for a modern relaxed drape. For a fitted standard silhouette, consider sizing down one size.
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-stone-500">Garment measurements laid flat:</span>
          <div className="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                unit === 'inches' ? 'bg-[#111111] text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                unit === 'cm' ? 'bg-[#111111] text-white font-semibold shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table with Tabular Numerals */}
        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest Width</th>
                <th className="py-2.5 px-3">Body Length</th>
                <th className="py-2.5 px-3">Shoulder</th>
                <th className="py-2.5 px-3">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#111111] font-sans">{row.size}</td>
                  <td className="py-2.5 px-3 tabular-nums text-stone-700">
                    {unit === 'inches' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-stone-700">
                    {unit === 'inches' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-stone-700">
                    {unit === 'inches' ? `${row.shoulderInches}"` : `${row.shoulderCm} cm`}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-stone-700">
                    {unit === 'inches' ? `${row.sleeveInches}"` : `${row.sleeveCm} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Instructions */}
        <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <h4 className="font-semibold text-[#111111]">How to get your perfect fit:</h4>
          <ol className="list-decimal pl-4 space-y-1 text-stone-600">
            <li>Lay your favorite best-fitting t-shirt completely flat on a hard surface.</li>
            <li><strong>Chest:</strong> Measure across from armpit seam to armpit seam and double the number.</li>
            <li><strong>Length:</strong> Measure from the highest point of the shoulder seam straight down to the bottom hem.</li>
            <li>Still unsure? Send your height and weight to our WhatsApp team for personalized sizing advice.</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#111111] hover:bg-black text-white rounded-full transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
