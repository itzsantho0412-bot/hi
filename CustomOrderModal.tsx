import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Sparkles, Calendar, Layers, Hash } from 'lucide-react';
import { CustomOrderCategory } from '../types';
import { buildCustomOrderWhatsAppUrl, triggerCustomCategoryWhatsAppOrder } from '../services/whatsapp';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CustomOrderCategory | null;
  phone: string;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  onClose,
  category,
  phone,
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [preferredFabric, setPreferredFabric] = useState<string>('240 GSM Heavyweight Cotton');
  const [targetDate, setTargetDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (category) {
      setQuantity(category.minQty || 10);
      setPreferredFabric(category.fabricOptions[0] || '240 GSM Heavyweight Cotton');
      setNotes('');
      setTargetDate('');
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const { rawMessage } = buildCustomOrderWhatsAppUrl(phone, category, {
    estimatedQty: quantity,
    preferredFabric,
    targetDate,
    notes,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerCustomCategoryWhatsAppOrder(phone, category, {
      estimatedQty: quantity,
      preferredFabric,
      targetDate,
      notes,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-order-title"
    >
      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#111111] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold">
              Custom Group Inquiry
            </span>
            <h3 id="custom-order-title" className="text-xl font-bold text-[#111111] mt-0.5">
              {category.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close custom inquiry form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          {/* Estimated Quantity */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-stone-800" />
              Estimated Quantity (Minimum: {category.minQty} pcs)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={category.minQty}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(category.minQty, parseInt(e.target.value) || category.minQty))}
                className="w-32 bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black tabular-nums font-mono"
                required
              />
              <span className="text-xs text-stone-500">Pieces / T-Shirts</span>
            </div>
          </div>

          {/* Fabric Choice */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-800" />
              Preferred Fabric & GSM
            </label>
            <select
              value={preferredFabric}
              onChange={(e) => setPreferredFabric(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black"
            >
              {category.fabricOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Target Event Date */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-800" />
              Target Event Date / Delivery Deadline (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Next month 15th, or 2 weeks from today"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black placeholder:text-stone-400"
            />
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-800" />
              Design Concept, Slogans, or Special Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Front minimal chest logo, back group member nicknames; need size mix from S to XXL."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-sm text-[#111111] focus:outline-none focus:ring-1 focus:ring-black placeholder:text-stone-400"
            />
          </div>

          {/* Live WhatsApp Pre-filled Message Preview Box */}
          <div className="pt-2">
            <span className="text-xs font-mono text-stone-500 block mb-1">
              WhatsApp Message Preview:
            </span>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {rawMessage}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Clicking below opens a direct chat with HELIOZ CLOTHING (+91 6379407292). No payment is made on this site.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-xs font-semibold text-stone-600 hover:text-black rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-6 text-xs font-bold text-white bg-[#111111] hover:bg-black rounded-full transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>{category.buttonLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
