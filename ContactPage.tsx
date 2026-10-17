import React, { useState } from 'react';
import { BusinessInfo } from '../types';
import { MessageCircle, Mail, MapPin, Clock, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../services/whatsapp';

interface ContactPageProps {
  businessInfo: BusinessInfo;
  onNavigate: (tab: string, policySection?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ businessInfo, onNavigate }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const whatsAppUrl = buildGeneralWhatsAppUrl(businessInfo.phone);

  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-3 border-b border-stone-200 pb-6 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Contact HELIOZ CLOTHING
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            We are available directly on WhatsApp and email to assist you with single apparel orders, bulk customization quotes, sample requests, and sizing questions.
          </p>
        </div>

        {/* Primary Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <div className="p-6 bg-white border border-stone-200/80 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-stone-100 text-stone-900 rounded-xl">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">Official WhatsApp</h2>
                  <p className="text-xs text-stone-500">Fastest response channel</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(businessInfo.displayPhone, 'phone')}
                className="p-1.5 text-stone-400 hover:text-black rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-lg font-mono font-bold text-[#111111] tracking-wider">
              {businessInfo.displayPhone}
            </p>

            <p className="text-xs text-stone-600 leading-relaxed">
              Send us product screenshots, design PDFs, or sizing queries. Typical response time is under 15 minutes during operating hours.
            </p>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#111111] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="p-6 bg-white border border-stone-200/80 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-stone-100 text-stone-900 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">Official Email</h2>
                  <p className="text-xs text-stone-500">Formal inquiries & invoices</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(businessInfo.email, 'email')}
                className="p-1.5 text-stone-400 hover:text-black rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedType === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-base font-mono font-semibold text-[#111111]">
              {businessInfo.email}
            </p>

            <p className="text-xs text-stone-600 leading-relaxed">
              Ideal for sending corporate procurement tenders, high-resolution vector artwork files (.ai, .eps, .pdf), and partnership proposals.
            </p>

            <a
              href={`mailto:${businessInfo.email}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs sm:text-sm rounded-full transition-colors border border-stone-200"
            >
              <Mail className="w-4 h-4 text-stone-800" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Workshop Address & Hours */}
        <div className="p-8 bg-white border border-stone-200/80 rounded-2xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#111111]">Workshop & Physical Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
                <div className="text-stone-700 leading-relaxed">
                  <strong className="text-[#111111] block font-semibold">{businessInfo.brandName}</strong>
                  <p>{businessInfo.addressLine1}</p>
                  <p>{businessInfo.addressLine2}</p>
                  <p>{businessInfo.district}, {businessInfo.state} – {businessInfo.pincode}</p>
                  <p className="text-xs text-stone-500 mt-1">Landmark: Thiruchuli Road, Kariapatti</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Kariapatti,+Virudhunagar+Tamil+Nadu+626106"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#111111] font-semibold hover:underline pt-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Kariapatti on Google Maps</span>
              </a>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
                <div className="text-stone-700 space-y-1">
                  <strong className="text-[#111111] block font-semibold">Operating Business Hours</strong>
                  <p className="text-xs text-stone-700">
                    <span className="text-stone-500">Monday – Saturday:</span> {businessInfo.businessHoursDetail.weekdays}
                  </p>
                  <p className="text-xs text-stone-700">
                    <span className="text-stone-500">Sunday:</span> {businessInfo.businessHoursDetail.sunday}
                  </p>
                  <p className="text-xs text-stone-500 pt-1">
                    WhatsApp messages received outside business hours will be answered promptly on the next business morning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Grievance Officer & Statutory Details */}
        <div className="p-6 bg-white border border-stone-200/80 rounded-2xl space-y-4 text-xs text-stone-600 shadow-sm">
          <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-stone-800" />
            Mandatory Statutory & Grievance Redressal Information
          </h3>

          <p className="leading-relaxed">
            In compliance with Rule 5(3) of the Consumer Protection (E-Commerce) Rules, 2020, every e-commerce entity operating in India must designate a Nodal Grievance Redressal Officer:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-700">
            <div>
              <span className="text-stone-500 block text-xs uppercase font-mono">Grievance Officer:</span>
              <span className="font-semibold text-[#111111]">{businessInfo.grievanceOfficer.name}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-xs uppercase font-mono">Contact Email:</span>
              <span className="font-mono text-stone-900 font-semibold">{businessInfo.grievanceOfficer.email}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-xs uppercase font-mono">Designation:</span>
              <span>{businessInfo.grievanceOfficer.designation}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-xs uppercase font-mono">Statutory Response Window:</span>
              <span className="text-stone-700">{businessInfo.grievanceOfficer.responseWindow}</span>
            </div>
          </div>

          <p className="text-xs text-stone-500">
            For order returns, cancellation claims, or privacy concerns, please refer to our{' '}
            <button
              onClick={() => onNavigate('policies', 'refunds')}
              className="text-[#111111] font-semibold hover:underline cursor-pointer"
            >
              Refund Policy
            </button>{' '}
            and{' '}
            <button
              onClick={() => onNavigate('policies', 'privacy')}
              className="text-[#111111] font-semibold hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>.
          </p>
        </div>
      </div>
    </div>
  );
};
