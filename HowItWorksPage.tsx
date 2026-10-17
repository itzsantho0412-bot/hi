import React from 'react';
import { BusinessInfo } from '../types';
import { MessageCircle, ShieldCheck, ArrowRight, Lock, CheckCircle, Smartphone, Truck, CreditCard } from 'lucide-react';

interface HowItWorksPageProps {
  businessInfo: BusinessInfo;
  onNavigate: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ businessInfo, onNavigate }) => {
  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="space-y-4 border-b border-stone-200 pb-8 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block">
            Transparent, Human Commerce
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            How Ordering Works
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            HELIOZ CLOTHING operates without traditional web checkout carts or automated credit card gateways. Instead, we use direct WhatsApp ordering for a personalized, transparent experience.
          </p>
        </div>

        {/* The 3 Core Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="p-8 bg-white border border-stone-200/80 rounded-2xl flex flex-col md:flex-row gap-6 items-start shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center font-mono font-bold text-xl shrink-0">
              01
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-[#111111]">Select Your Fit, Size, & Color</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Explore our catalog of 200–260 GSM heavyweight cotton essentials or choose one of our 6 custom group apparel use cases (birthdays, road trips, colleges, office uniforms, team events, family functions). Check our comprehensive Sizing Guide for exact chest, length, and shoulder measurements in inches or centimeters.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-stone-500">
                <CheckCircle className="w-3.5 h-3.5 text-stone-800" />
                <span>Available in unisex streetwear sizes S to 3XL</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white border border-stone-200/80 rounded-2xl flex flex-col md:flex-row gap-6 items-start shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center font-mono font-bold text-xl shrink-0">
              02
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-[#111111]">Tap "Order on WhatsApp"</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                When you click the button on any product card or detail page, a formatted, pre-filled WhatsApp message will automatically generate and open a chat with our workshop at <strong>{businessInfo.displayPhone}</strong>.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-800">
                "Hello HELIOZ CLOTHING, I would like to order: Signature Heavyweight Tee (Pitch Black, Size L, Qty: 1)..."
              </div>
              <div className="pt-1 flex items-center gap-2 text-xs text-stone-500">
                <Lock className="w-3.5 h-3.5 text-stone-800" />
                <span>Zero website accounts or personal data saved here. Your privacy is respected.</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white border border-stone-200/80 rounded-2xl flex flex-col md:flex-row gap-6 items-start shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center font-mono font-bold text-xl shrink-0">
              03
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-[#111111]">Direct Chat Confirmation & Doorstep Dispatch</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Our team verifies live inventory or schedules your custom screen printing batch. We confirm your delivery address, provide direct payment instructions (UPI / Google Pay / PhonePe / Direct Bank NEFT), and share your courier tracking number as soon as the package leaves our Kariapatti workshop.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800 font-semibold">FREE Delivery on orders above ₹999 (3–7 business days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-stone-800" />
                  <span>Direct UPI / Bank Transfer confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zero Data Privacy Statement */}
        <div className="p-6 bg-white border border-stone-200/80 rounded-2xl space-y-2 shadow-xs">
          <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-800" />
            Our Privacy & Data Commitment (Digital Personal Data Protection Act, 2023)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The HELIOZ CLOTHING website does not store customer names, physical addresses, phone numbers, or credit card details. When you order, you share your shipping information directly through end-to-end encrypted WhatsApp communication with our official verified business number.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <div>
            <h3 className="text-base font-bold text-[#111111]">Ready to order your first piece?</h3>
            <p className="text-xs text-stone-500">Explore our signature 240 GSM drop-shoulder and boxy cuts.</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Browse Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
