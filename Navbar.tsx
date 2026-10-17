import React, { useState } from 'react';
import { Logo } from './Logo';
import { MessageCircle, Menu, X, Lock, Search } from 'lucide-react';
import { HELIOZ_PHONE_NUMBER, buildGeneralWhatsAppUrl } from '../services/whatsapp';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  onOpenSearch?: () => void;
  isSearchOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn = false,
  onOpenSearch,
  isSearchOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop', label: 'Shop T-Shirts' },
    { id: 'custom', label: 'Custom Orders' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const directWhatsAppUrl = buildGeneralWhatsAppUrl(HELIOZ_PHONE_NUMBER);

  return (
    <>
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#111111] focus:text-white focus:font-semibold focus:rounded"
      >
        Skip to main content
      </a>

      {/* Top Banner Notice - Clean subtle bar */}
      <div className="bg-[#f3f4f6] border-b border-stone-200/60 py-1.5 px-4 text-center text-xs text-stone-600 tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0" aria-hidden="true" />
        <span className="font-medium">Direct WhatsApp Ordering · 100% Heavyweight Cotton · <strong>FREE Delivery on Orders Above ₹999</strong></span>
      </div>

      {/* Main Header strictly adhering to Top Bar Contract & Reference Image */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm shrink-0 cursor-pointer"
            aria-label="HELIOZ CLOTHING Home"
          >
            <Logo theme="light" size="sm" showSubtitle={true} />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer text-sm ${
                    isActive
                      ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#111111]'
                      : 'hover:text-[#111111] text-stone-600'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA Button + Owner Admin Lock + Search */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Catalog Search trigger */}
            <button
              onClick={() => {
                if (onOpenSearch) {
                  onOpenSearch();
                } else {
                  handleNavClick('shop');
                }
              }}
              className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                isSearchOpen ? 'bg-[#111111] text-white' : 'text-stone-600 hover:text-black hover:bg-stone-100'
              }`}
              title={isSearchOpen ? 'Hide Search & Filters' : 'Search & Filters'}
              aria-label="Search catalog and filters"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Action Button (Crisp dark solid button matching reference design) */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-[#111111] hover:bg-[#222222] rounded-full transition-all active:scale-95 shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
              aria-label="Chat with HELIOZ CLOTHING on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" aria-hidden="true" />
              <span>Order on WhatsApp</span>
            </a>

            {/* Owner Admin Access Button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-full transition-colors text-stone-500 hover:text-black hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                isAdminLoggedIn ? 'text-black bg-stone-200' : ''
              }`}
              title={isAdminLoggedIn ? 'Admin Dashboard (Active)' : 'Owner Admin Login'}
              aria-label={isAdminLoggedIn ? 'Owner Admin Dashboard Active' : 'Owner Admin Access'}
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-stone-100 text-[#111111] font-bold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#111111] rounded-full shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 6379407292)</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-stone-600 hover:text-black hover:bg-stone-100 rounded-full border border-stone-200"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
