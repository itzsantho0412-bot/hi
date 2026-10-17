import React, { useState, useEffect } from 'react';
import { getCookieConsent, setCookieConsent } from '../services/storage';
import { Shield } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleChoice = (choice: 'accepted' | 'declined') => {
    setCookieConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 bg-white border border-stone-200 rounded-2xl shadow-xl text-[#111111]"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-stone-100 rounded-lg text-stone-800 shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[#111111]">Privacy & Cookie Preferences</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            HELIOZ CLOTHING collects zero personal data on this website. We only use essential local storage to remember your cart preferences and aggregate click statistics.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleChoice('accepted')}
              className="flex-1 py-1.5 px-3 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-full transition-colors text-center cursor-pointer shadow-xs"
            >
              Accept Preferences
            </button>
            <button
              onClick={() => handleChoice('declined')}
              className="flex-1 py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-full transition-colors text-center cursor-pointer"
            >
              Decline Non-Essential
            </button>
          </div>
          <p className="text-xs text-stone-500 pt-1">
            Read our{' '}
            <button
              onClick={onOpenCookiePolicy}
              className="text-black font-semibold hover:underline cursor-pointer"
            >
              Cookie Policy
            </button>{' '}
            for complete transparency.
          </p>
        </div>
      </div>
    </div>
  );
};
