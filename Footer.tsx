import React from 'react';
import { Logo } from './Logo';
import { MessageCircle, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { BusinessInfo } from '../types';

interface FooterProps {
  businessInfo: BusinessInfo;
  onNavigate: (tab: string, policySection?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ businessInfo, onNavigate }) => {
  return (
    <footer className="bg-white border-t border-stone-200 text-stone-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Manifesto */}
          <div className="space-y-4">
            <Logo theme="light" size="sm" showSubtitle={true} />
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
              Minimalist heavyweight t-shirts and custom group apparel engineered in Tamil Nadu. Direct communication, honest cotton, no middlemen markups.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${businessInfo.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] hover:underline"
              >
                <MessageCircle className="w-4 h-4 text-stone-800" />
                <span>Chat directly on WhatsApp (+91 6379407292)</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation & Collections */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111111] font-bold">Collections</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-stone-600 hover:text-black transition-colors cursor-pointer text-left"
                >
                  Heavyweight Oversized Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-stone-600 hover:text-black transition-colors cursor-pointer text-left"
                >
                  Drop-Shoulder Boxy Fits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-stone-600 hover:text-black transition-colors cursor-pointer text-left"
                >
                  Supima & Waffle Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="text-stone-600 hover:text-black transition-colors cursor-pointer text-left"
                >
                  Custom Group & Event Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-stone-600 hover:text-black transition-colors cursor-pointer text-left"
                >
                  How WhatsApp Ordering Works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Business Information */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111111] font-bold">Business Details</h3>
            <div className="space-y-2.5 text-xs text-stone-600 leading-normal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                <span>
                  {businessInfo.brandName}<br />
                  {businessInfo.addressLine1}, {businessInfo.addressLine2}<br />
                  {businessInfo.district}, {businessInfo.state} - {businessInfo.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-800 shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-black transition-colors">
                  {businessInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                <div>
                  <p>Mon – Sat: {businessInfo.businessHoursDetail.weekdays}</p>
                  <p>Sun: {businessInfo.businessHoursDetail.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Consumer Grievance & Statutory Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111111] font-bold">Consumer Redressal</h3>
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1.5 text-stone-600">
              <p className="font-semibold text-[#111111] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-800" />
                Grievance Officer:
              </p>
              <p className="font-medium text-stone-800">{businessInfo.grievanceOfficer.name}</p>
              <p className="text-xs">Email: {businessInfo.grievanceOfficer.email}</p>
              <p className="text-xs text-stone-500">{businessInfo.grievanceOfficer.responseWindow}</p>
              <p className="text-xs text-stone-500 pt-1 border-t border-stone-200">
                {businessInfo.isGstRegistered ? `GSTIN: ${businessInfo.gstNumber}` : 'Status: Micro-Enterprise (Unregistered Under GST Threshold)'}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Policies Navigation Bar */}
        <div className="py-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              onClick={() => onNavigate('policies', 'privacy')}
              className="hover:text-black transition-colors cursor-pointer text-left"
            >
              Privacy Policy (DPDP Act 2023)
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => onNavigate('policies', 'terms')}
              className="hover:text-black transition-colors cursor-pointer text-left"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => onNavigate('policies', 'refunds')}
              className="hover:text-black transition-colors cursor-pointer text-left"
            >
              Refund & Cancellation Policy
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => onNavigate('policies', 'shipping')}
              className="hover:text-black transition-colors cursor-pointer text-left"
            >
              Shipping Policy
            </button>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <button
              onClick={() => onNavigate('policies', 'cookies')}
              className="hover:text-black transition-colors cursor-pointer text-left"
            >
              Cookie Policy
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Consumer Protection (E-Commerce) Rules, 2020 Compliant
          </div>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="pt-6 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {businessInfo.brandName}. All rights reserved.</p>
          <p className="text-xs text-stone-500 text-center md:text-right">
            Orders are processed via direct WhatsApp chat and are also governed by WhatsApp Terms. The website stores no customer records.
          </p>
        </div>
      </div>
    </footer>
  );
};
