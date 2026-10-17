import React from 'react';
import { CustomOrderCategory, BusinessInfo } from '../types';
import { ApparelMockup } from '../components/ApparelMockup';
import { MessageCircle, Clock, Check, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';
import { triggerCustomCategoryWhatsAppOrder } from '../services/whatsapp';

interface CustomTshirtsPageProps {
  categories: CustomOrderCategory[];
  businessInfo: BusinessInfo;
  onOpenCustomModal: (cat: CustomOrderCategory) => void;
}

export const CustomTshirtsPage: React.FC<CustomTshirtsPageProps> = ({
  categories,
  businessInfo,
  onOpenCustomModal,
}) => {
  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-stone-200 pb-8 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block">
            Bulk & Group Printing · Direct Workshop Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
            Custom T-Shirts for Every Occasion
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
            From 5 matching tees for a birthday road trip to 500 corporate polo uniforms for your annual offsite. We specialize in high-density screen printing, 3D puff embroidery, and vibrant DTF prints on premium 100% combed cotton.
          </p>
        </div>

        {/* Printing Capabilities Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-stone-200/80 rounded-2xl text-xs font-mono text-stone-700 shadow-sm">
          <div>
            <span className="text-[#111111] font-bold block mb-1">01. Direct-To-Film (DTF)</span>
            <span className="text-stone-500">High-definition full color, photographic gradients, zero cracking.</span>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-1">02. Screen & Puff 3D</span>
            <span className="text-stone-500">Plastisol and water-based inks with tactile raised foam finish.</span>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-1">03. Computerized Embroidery</span>
            <span className="text-stone-500">Crisp Madeira thread logos for luxury office uniforms & pique polos.</span>
          </div>
          <div>
            <span className="text-[#111111] font-bold block mb-1">04. FREE Delivery</span>
            <span className="text-stone-500">100% Free delivery on all orders above ₹999 across all Indian pin codes.</span>
          </div>
        </div>

        {/* The 6 Use Case Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 group shadow-sm"
            >
              {/* Visual Top Preview */}
              <div className="relative aspect-[4/3] bg-[#f4f4f4] flex items-center justify-center p-4 border-b border-stone-100">
                <ApparelMockup
                  colorHex="#141416"
                  colorName={cat.title}
                  fit="Oversized"
                  graphicStyle="custom-print"
                  graphicText={cat.title.toUpperCase()}
                  className="w-full h-full"
                  altText={`${cat.title} Custom T-Shirt Example`}
                />

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-semibold text-stone-800 border border-stone-200 shadow-2xs">
                  Min {cat.minQty} pcs
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                    <span className="text-stone-700 font-semibold">{cat.badge}</span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-stone-700" />
                      {cat.turnaround}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#111111] tracking-tight">
                    {cat.title}
                  </h2>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {cat.summary}
                  </p>

                  {/* Ideal For list */}
                  <div className="pt-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block mb-1">
                      Popular use cases:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.idealFor.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fabric & Print Highlights */}
                  <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <p>
                      <strong className="text-stone-800">Fabrics:</strong> {cat.fabricOptions.join(' · ')}
                    </p>
                    <p>
                      <strong className="text-stone-800">Prints:</strong> {cat.printOptions.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <button
                    onClick={() => triggerCustomCategoryWhatsAppOrder(businessInfo.phone, cat)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#111111] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full transition-all active:scale-95 shadow-sm cursor-pointer"
                    aria-label={cat.buttonLabel}
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span className="truncate">{cat.buttonLabel}</span>
                  </button>

                  <button
                    onClick={() => onOpenCustomModal(cat)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-stone-600 hover:text-black hover:bg-stone-50 rounded-full transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-stone-700" />
                    <span>Customize Quantity & Notes First</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assurance Footer */}
        <div className="p-8 bg-white border border-stone-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-[#111111]">Have a unique design or bulk inquiry over 500 pieces?</h3>
            <p className="text-xs text-stone-600">
              Share your vector artwork (.ai, .pdf, .png) or sketch directly with our production manager on WhatsApp for an immediate quote.
            </p>
          </div>
          <a
            href={`https://wa.me/${businessInfo.phone}?text=${encodeURIComponent('Hello HELIOZ CLOTHING, I have a custom bulk order requirement (>500 pcs) and need a custom quotation.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs rounded-full transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer border border-stone-200"
          >
            <MessageCircle className="w-4 h-4 text-stone-800" />
            <span>Chat with Production Team</span>
          </a>
        </div>
      </div>
    </div>
  );
};
