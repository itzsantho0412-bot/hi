import React, { useState, useEffect } from 'react';
import { BusinessInfo } from '../types';
import { Shield, FileText, RefreshCcw, Truck, Cookie, Scale } from 'lucide-react';

interface PoliciesPageProps {
  businessInfo: BusinessInfo;
  initialTab?: string;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ businessInfo, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy (DPDP 2023)', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refunds', label: 'Refund & Cancellation', icon: RefreshCcw },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ];

  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Title */}
        <div className="border-b border-stone-200 pb-6 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block mb-1">
            Legal & Compliance Documentation
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
            Policies & Consumer Terms
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Formulated in accordance with the Digital Personal Data Protection Act, 2023 & Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </div>

        {/* Policy Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-black hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Content Panels */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 text-stone-700 text-xs sm:text-sm leading-relaxed space-y-6 shadow-sm">
          {/* 1. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111] border-b border-stone-200 pb-3">
                Privacy Policy (Digital Personal Data Protection Act, 2023 Compliant)
              </h2>

              <p>
                This Privacy Policy describes how <strong>{businessInfo.brandName}</strong> ("we", "us", or "our"), having its principal place of business at {businessInfo.addressLine1}, {businessInfo.addressLine2}, {businessInfo.district}, {businessInfo.state} - {businessInfo.pincode}, processes information in connection with our website.
              </p>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 space-y-1">
                <strong className="font-semibold block text-[#111111]">Core Principle: Zero Customer Personal Data Collected on Website</strong>
                <p className="text-xs text-stone-600">
                  Our website is designed as a digital showroom. We do NOT host checkout forms, nor do we store your name, phone number, physical address, or payment credentials in a website database. When you click "Order on WhatsApp", your inquiry is transmitted directly to WhatsApp.
                </p>
              </div>

              <h3 className="text-base font-bold text-[#111111]">1. Data Handled and Purpose</h3>
              <p>
                <strong>Website Browsing:</strong> We process only anonymous technical interactions (such as aggregate clicks on product buttons) to monitor catalog interest. No identifiable personal markers (IP addresses, cookies tracking personal identifiers) are collected or sold.
              </p>
              <p>
                <strong>WhatsApp Direct Orders:</strong> When you initiate a chat on WhatsApp with {businessInfo.displayPhone}, you voluntarily provide your name, shipping address, contact phone number, and sizing requirements solely for the purpose of processing, fulfilling, and delivering your apparel order.
              </p>

              <h3 className="text-base font-bold text-[#111111]">2. WhatsApp Third-Party Privacy Notice</h3>
              <p>
                All customer chats, communications, and files transmitted over WhatsApp are processed under Meta/WhatsApp's Terms of Service and Privacy Policy. Communications on WhatsApp benefit from WhatsApp's standard end-to-end encryption.
              </p>

              <h3 className="text-base font-bold text-[#111111]">3. Retention & Data Security</h3>
              <p>
                Shipping addresses and order records shared in WhatsApp are retained only as long as necessary to complete delivery, honor warranty/exchange timelines, and comply with statutory bookkeeping obligations under Indian tax laws. We do not sell or trade customer lists to third-party advertisers.
              </p>

              <h3 className="text-base font-bold text-[#111111]">4. User Rights Under the DPDP Act, 2023</h3>
              <p>
                Under the Digital Personal Data Protection Act, 2023, data principals enjoy rights including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li><strong>Right to Access:</strong> Request a summary of personal data shared with us during order processing.</li>
                <li><strong>Right to Correction & Erasure:</strong> Request the update or deletion of historical contact details after order delivery.</li>
                <li><strong>Right to Grievance Redressal:</strong> Submit any data privacy concerns directly to our Grievance Officer.</li>
              </ul>

              <h3 className="text-base font-bold text-[#111111]">5. Grievance Officer Contact</h3>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-xs text-stone-700">
                <p><strong>Name:</strong> {businessInfo.grievanceOfficer.name}</p>
                <p><strong>Designation:</strong> {businessInfo.grievanceOfficer.designation}</p>
                <p><strong>Email:</strong> {businessInfo.grievanceOfficer.email}</p>
                <p><strong>Address:</strong> {businessInfo.addressLine1}, {businessInfo.city}, {businessInfo.state} - {businessInfo.pincode}</p>
                <p><strong>Response Timeline:</strong> Within 48 business hours.</p>
              </div>
            </div>
          )}

          {/* 2. TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111] border-b border-stone-200 pb-3">
                Terms & Conditions
              </h2>

              <p>
                Welcome to <strong>{businessInfo.brandName}</strong>. By accessing this website or placing orders through our official WhatsApp channel, you agree to be bound by these Terms and Conditions.
              </p>

              <h3 className="text-base font-bold text-[#111111]">1. Order Formation & Confirmation</h3>
              <p>
                <strong>No Online Checkout Contract:</strong> Generating a WhatsApp order link on this website does NOT constitute a binding sale contract. All orders are subject to manual verification and stock confirmation by {businessInfo.brandName} on WhatsApp.
              </p>
              <p>
                An order is deemed confirmed only after: (a) we verify inventory or production capacity in chat; (b) both parties mutually confirm sizing, quantity, and delivery timeline; and (c) agreed advance payment is received via designated UPI or bank transfer.
              </p>

              <h3 className="text-base font-bold text-[#111111]">2. Pricing & Availability</h3>
              <p>
                While we make every effort to display accurate prices and fabric specifications, prices and stock availability are subject to change prior to final order confirmation on WhatsApp. All standard product prices displayed are in Indian Rupees (INR ₹) and are inclusive of applicable taxes.
              </p>

              <h3 className="text-base font-bold text-[#111111]">3. Custom & Bulk Orders</h3>
              <p>
                For custom apparel orders (birthdays, corporate uniforms, college groups, family events), a digital visual mockup will be shared on WhatsApp for customer approval before screen printing, embroidery, or DTF production commences. Once approved by the customer in writing on WhatsApp, production will begin and changes cannot be accommodated.
              </p>

              <h3 className="text-base font-bold text-[#111111]">4. Governing Law & Jurisdiction</h3>
              <p>
                These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the competent courts in Virudhunagar / Madurai, Tamil Nadu.
              </p>
            </div>
          )}

          {/* 3. REFUND & CANCELLATION POLICY */}
          {activeTab === 'refunds' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111] border-b border-stone-200 pb-3">
                Refund, Replacement & Cancellation Policy
              </h2>

              <p>
                At {businessInfo.brandName}, customer satisfaction and garment longevity are our primary standards. Please review the refund and exchange policy applicable to our products:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-[#111111]">A. Standard Catalog Products (Plain / Ready-to-Wear)</h3>
                  <p className="text-xs text-stone-600">
                    <strong>Size Exchange:</strong> If a standard t-shirt does not fit as expected, you may request a size exchange within <strong>4 days of delivery</strong> by contacting us on WhatsApp. The garment must remain unworn, unwashed, with original tags intact. Return courier charges for size exchanges are borne by the customer.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-[#111111]">B. Custom & Personalized Group Apparel</h3>
                  <p className="text-xs text-stone-600">
                    Custom printed t-shirts (including birthday squads, college symposiums, office uniforms, and family event prints with names or dates) are custom manufactured specifically to your specifications. <strong>Custom orders are strictly NON-RETURNABLE and NON-REFUNDABLE</strong> once production has commenced, except in the case of manufacturing defect or incorrect item delivery.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-[#111111]">C. Damaged, Defective, or Wrong Items</h3>
                  <p className="text-xs text-stone-600">
                    In the rare event that an item arrives with a stitching defect, torn fabric, or major printing error:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-xs text-stone-600">
                    <li>Notify us on WhatsApp (+91 6379407292) within <strong>48 hours of parcel delivery</strong>.</li>
                    <li>Provide clear photographs and/or a brief unboxing video highlighting the defective area.</li>
                    <li>Upon verification, we will immediately arrange a free replacement or issue a full refund to your original payment method within 3–5 business days.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* 4. SHIPPING & DELIVERY POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111] border-b border-stone-200 pb-3">
                Shipping & Delivery Policy
              </h2>

              <p>
                All orders placed with {businessInfo.brandName} are carefully packed and dispatched from our facility in <strong>Kariapatti, Virudhunagar District, Tamil Nadu 626106</strong>.
              </p>

              <h3 className="text-base font-bold text-[#111111]">1. Dispatch & Delivery Timelines</h3>
              <ul className="list-disc pl-5 space-y-2 text-stone-600">
                <li><strong>Standard Catalog Items:</strong> Dispatched within 24 to 48 hours of payment confirmation. Domestic transit typically takes <strong>3 to 7 business days</strong> depending on your pin code.</li>
                <li><strong>Custom Group Orders (5 to 50 pcs):</strong> Production turnaround of 3 to 5 business days + transit.</li>
                <li><strong>Bulk Corporate & College Orders (50+ pcs):</strong> Turnaround of 5 to 8 business days + transit.</li>
              </ul>

              <h3 className="text-base font-bold text-[#111111]">2. Shipping Partners & Tracking</h3>
              <p>
                We partner with trusted national logistics providers (India Post Speed Post, Professional Couriers, ST Courier, DTDC, and Delhivery). As soon as your parcel is dispatched, a consignment tracking link will be sent to your WhatsApp number.
              </p>

              <h3 className="text-base font-bold text-[#111111]">3. Shipping Rates & Free Delivery</h3>
              <p>
                <strong>FREE Delivery:</strong> All orders valued at <strong>₹999 or above qualify for 100% FREE doorstep delivery</strong> across all serviceable pin codes in India.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm">
                For orders below ₹999, a nominal flat shipping fee of ₹60 applies and is transparently confirmed in your WhatsApp order breakdown before you remit payment.
              </p>
            </div>
          )}

          {/* 5. COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111] border-b border-stone-200 pb-3">
                Cookie & Local Storage Policy
              </h2>

              <p>
                {businessInfo.brandName} is committed to a privacy-first web experience. We do not use intrusive third-party tracking cookies, behavioral ad pixels (Meta Pixel, Google Ads remarketing), or cross-site tracking scripts.
              </p>

              <h3 className="text-base font-bold text-[#111111]">Audit of Storage Items Used</h3>
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-50 text-stone-700 border-b border-stone-200 uppercase text-xs">
                    <tr>
                      <th className="py-2.5 px-3">Storage Key / Item</th>
                      <th className="py-2.5 px-3">Provider</th>
                      <th className="py-2.5 px-3">Purpose</th>
                      <th className="py-2.5 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-black">helioz_cookie_consent_v1</td>
                      <td className="py-2.5 px-3">First Party</td>
                      <td className="py-2.5 px-3">Remembers your cookie banner preference</td>
                      <td className="py-2.5 px-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-black">helioz_products_v1</td>
                      <td className="py-2.5 px-3">First Party</td>
                      <td className="py-2.5 px-3">Stores catalog items and owner edits locally</td>
                      <td className="py-2.5 px-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-black">helioz_clicks_v1</td>
                      <td className="py-2.5 px-3">First Party</td>
                      <td className="py-2.5 px-3">Privacy-safe aggregate WhatsApp click counts</td>
                      <td className="py-2.5 px-3">Max 1000 events</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-stone-600">
                You can clear your local browser storage at any time through your browser's settings menu without impacting your ability to browse the site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
