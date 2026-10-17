import React from 'react';
import { BusinessInfo } from '../types';
import { Logo } from '../components/Logo';
import { MessageCircle, MapPin, Sparkles, Shield, Compass, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  businessInfo: BusinessInfo;
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ businessInfo, onNavigate }) => {
  return (
    <div className="bg-[#f8f8f8] text-[#111111] pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Brand Mark Hero */}
        <div className="text-center space-y-4 pt-4">
          <Logo theme="light" size="lg" showSubtitle={true} />
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block pt-2">
            Kariapatti · Virudhunagar District · Tamil Nadu
          </span>
        </div>

        {/* Brand Manifesto */}
        <section className="space-y-6 text-stone-700 leading-relaxed text-base sm:text-lg border-y border-stone-200 py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Heavyweight Cotton. Direct Craftsmanship. No Pretenses.
          </h1>

          <p>
            HELIOZ CLOTHING was founded on a simple observation: most everyday t-shirts in the market have become paper-thin, shapeless, and disposable. Brands cut costs by blending cheap synthetic polyester and reducing fabric weights down to 140–160 GSM, resulting in garments that stretch out, pill, and curl at the collar after three washes.
          </p>

          <p>
            We chose a different path. Based in Kariapatti in Tamil Nadu's Virudhunagar textile corridor, HELIOZ builds heavyweight, structured cotton essentials engineered between 220 GSM and 260 GSM. Our pieces hold their architectural silhouette, drape cleanly over the body without clinging, and maintain collar firmness wash after wash.
          </p>

          <blockquote className="p-6 bg-white border-l-4 border-[#111111] text-stone-800 italic rounded-r-xl shadow-xs my-6 text-sm sm:text-base">
            "We don't build t-shirts to sit in automated warehouse bins. We build them for people who appreciate the dense weight of pure combed cotton, thoughtful proportions, and honest communication."
          </blockquote>

          <p>
            Whether you're picking up a single heavyweight oversized tee for your personal wardrobe or outfitting 200 colleagues for an annual corporate offsite, every piece is inspected by hand before dispatch.
          </p>
        </section>

        {/* The 4 Principles */}
        <section className="space-y-8">
          <h2 className="text-xs uppercase font-mono tracking-widest text-stone-500 font-bold">
            Our Core Standards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 mb-2">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#111111]">Dense 240+ GSM Fabrics</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We specify heavy combed compact yarns with zero polyester blends. They feel substantial in hand and drape naturally without clinging.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#111111]">Direct WhatsApp Commerce</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Instead of passing 20% to 35% e-commerce aggregator commissions to you, we connect directly on WhatsApp. You get real human fit advice and bespoke order care.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#111111]">Custom Print Precision</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Specialized printing techniques: high-density 3D puff, premium Direct-To-Film (DTF), and rich computerized embroidery for birthdays, groups, college events, and offices.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 mb-2">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#111111]">Rooted in Virudhunagar</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Operating out of Pandian Nagar, Thiruchuli Road, Kariapatti, Tamil Nadu. Ethical production and genuine community roots.
              </p>
            </div>
          </div>
        </section>

        {/* Direct Contact CTA */}
        <section className="p-8 bg-white border border-stone-200/80 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-[#111111]">Have a question for our founders?</h3>
            <p className="text-xs text-stone-600 mt-1">
              We are online on WhatsApp six days a week from 9:30 AM to 8:30 PM IST.
            </p>
          </div>
          <a
            href={`https://wa.me/${businessInfo.phone}?text=${encodeURIComponent('Hi HELIOZ CLOTHING, I was reading your story and would like to ask a question.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs rounded-full transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Chat with HELIOZ (+91 6379407292)</span>
          </a>
        </section>
      </div>
    </div>
  );
};
