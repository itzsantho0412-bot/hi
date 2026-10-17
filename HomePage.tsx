import React, { useState, useMemo } from 'react';
import { Product, CustomOrderCategory, BusinessInfo } from '../types';
import { ApparelMockup } from '../components/ApparelMockup';
import { isImageSource } from '../services/image';
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Ruler,
  Truck,
  RotateCcw,
  Headphones,
  SlidersHorizontal,
  Heart,
  Search,
  X,
} from 'lucide-react';
import { triggerProductWhatsAppOrder, triggerCustomCategoryWhatsAppOrder } from '../services/whatsapp';

interface HomePageProps {
  products: Product[];
  customCategories: CustomOrderCategory[];
  businessInfo: BusinessInfo;
  onSelectProduct: (product: Product) => void;
  onSelectCustomCategory: (cat: CustomOrderCategory) => void;
  onNavigate: (tab: string) => void;
  onOpenSizeGuide: (fitType: string) => void;
  isSearchOpen?: boolean;
  onToggleSearch?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  customCategories,
  businessInfo,
  onSelectProduct,
  onSelectCustomCategory,
  onNavigate,
  onOpenSizeGuide,
  isSearchOpen = false,
  onToggleSearch,
}) => {
  // Category Pill Filter below Hero (matching reference image)
  const [selectedPill, setSelectedPill] = useState<string>('All');

  // Search & Filters visibility (Hidden by default unless search button clicked)
  const [localSearchOpen, setLocalSearchOpen] = useState<boolean>(false);
  const showFilters = onToggleSearch ? isSearchOpen : localSearchOpen;
  const toggleFilters = onToggleSearch || (() => setLocalSearchOpen(!localSearchOpen));

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterSizes, setFilterSizes] = useState<string[]>([]);
  const [filterColor, setFilterColor] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categoryPills = [
    { id: 'All', label: 'All T-Shirts' },
    { id: 'Oversized', label: 'Oversized' },
    { id: 'Boxy', label: 'Boxy Streetwear' },
    { id: 'Drop-Shoulder', label: 'Drop-Shoulder' },
    { id: 'Classic', label: 'Supima Daily' },
    { id: 'Polo', label: 'Heavy Polo' },
    { id: 'custom-orders', label: 'Custom Groups' },
  ];

  const sizeOptions = [
    { label: 'S', count: 42 },
    { label: 'M', count: 96 },
    { label: 'L', count: 88 },
    { label: 'XL', count: 42 },
    { label: 'XXL', count: 18 },
    { label: '3XL', count: 12 },
  ];

  const colorOptions = [
    { name: 'All', hex: '#ffffff', border: true },
    { name: 'Chalk White', hex: '#f4f2ed', border: true },
    { name: 'Pitch Black', hex: '#111112' },
    { name: 'Vintage Charcoal', hex: '#262628' },
    { name: 'Sand Dune', hex: '#b8a99a' },
    { name: 'Deep Olive', hex: '#373c33' },
  ];

  const activeFiltersCount =
    (searchQuery.trim() ? 1 : 0) +
    filterCategories.length +
    filterSizes.length +
    (filterColor !== 'All' ? 1 : 0) +
    (maxPrice < 1500 ? 1 : 0);

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => !p.isHidden)
      .filter((p) => {
        // Pill filter
        if (selectedPill !== 'All' && selectedPill !== 'custom-orders') {
          if (p.category !== selectedPill) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.fit.toLowerCase().includes(q) ||
            `${p.gsm}`.includes(q);
          if (!match) return false;
        }
        // Sidebar category checkboxes
        if (filterCategories.length > 0 && !filterCategories.includes(p.category)) {
          return false;
        }
        // Size checkboxes
        if (filterSizes.length > 0) {
          const hasMatchingSize = filterSizes.some((s) => p.sizes.includes(s));
          if (!hasMatchingSize) return false;
        }
        // Color filter
        if (filterColor !== 'All') {
          const hasColor = p.colors.some((c) =>
            c.name.toLowerCase().includes(filterColor.toLowerCase().replace('chalk ', '').replace('pitch ', ''))
          );
          if (!hasColor) return false;
        }
        // Price slider
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedPill, searchQuery, filterCategories, filterSizes, filterColor, maxPrice, sortBy]);

  const toggleCategory = (cat: string) => {
    setFilterCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (sz: string) => {
    setFilterSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const clearAllFilters = () => {
    setSelectedPill('All');
    setSearchQuery('');
    setFilterCategories([]);
    setFilterSizes([]);
    setFilterColor('All');
    setMaxPrice(1500);
    setSortBy('featured');
  };

  return (
    <div className="space-y-12 pb-16 bg-[#f8f8f8] text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* 1. HERO BANNER */}
        <section className="relative overflow-hidden bg-[#e9e8e3] rounded-3xl p-8 sm:p-12 lg:p-16 border border-stone-300/40 shadow-sm">
          <div className="max-w-2xl space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-600 font-semibold block">
                Tamil Nadu Hand-Checked Quality
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.06]">
                NEW <br />
                COLLECTION
              </h1>
            </div>

            <p className="text-sm sm:text-base text-stone-700 max-w-lg leading-relaxed">
              Minimalist 200–260 GSM heavyweight cotton essentials. Clean structured drape engineered for everyday wear. No cart fuss—order instantly on WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-7 py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-sm rounded-full transition-all active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('custom')}
                className="px-6 py-3.5 bg-white/80 hover:bg-white text-[#111111] font-semibold text-sm rounded-full transition-all active:scale-95 border border-stone-300/80 cursor-pointer shadow-sm"
              >
                Custom Group Orders
              </button>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT CATALOG (FILTERS HIDDEN BY DEFAULT UNLESS SEARCH CLICKED) */}
        <section id="catalog-section" className="pt-2 scroll-mt-24 space-y-6">
          {/* Free Delivery Banner Strip */}
          <div className="bg-[#f2efe9] border border-stone-200/80 rounded-2xl py-2.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-[#111111] text-white">
                <Truck className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-[#111111]">
                Special Offer: FREE Delivery on all orders above ₹999 across India!
              </span>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Direct WhatsApp Dispatch · Kariapatti Workshop
            </span>
          </div>

          {/* Header Strip with Search & Filters Toggle Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#111111]">All Products</h2>
              <span className="text-xs text-stone-500 font-medium">
                Found: {filteredProducts.length} items
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* The Search & Filters Trigger Button */}
              <button
                onClick={toggleFilters}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer border ${
                  showFilters
                    ? 'bg-[#111111] text-white border-black shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
                aria-expanded={showFilters}
                aria-label="Toggle search and filters"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{showFilters ? 'Close Search & Filters' : 'Search & Filter'}</span>
                {activeFiltersCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-xs font-mono font-bold ${
                    showFilters ? 'bg-white text-black' : 'bg-[#111111] text-white'
                  }`}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-lg py-1.5 px-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditional Filter Panel: Only visible when visitor clicks search button */}
          {showFilters && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                  <span className="text-sm font-bold text-[#111111]">Search & Refine Products</span>
                </div>
                <div className="flex items-center gap-4">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-stone-500 hover:text-black hover:underline cursor-pointer"
                    >
                      Clear all ({activeFiltersCount})
                    </button>
                  )}
                  <button
                    onClick={toggleFilters}
                    className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-50 cursor-pointer"
                    title="Close filters"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Keyword Search Input */}
              <div className="relative max-w-xl">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by t-shirt title, fit (e.g. Oversized), fabric, 240 GSM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#111111] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-black"
                  autoFocus
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {/* 1. Category */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 uppercase font-mono tracking-wider">
                    Category
                  </span>
                  <div className="space-y-1.5">
                    {['Oversized', 'Boxy', 'Drop-Shoulder', 'Classic', 'Polo', 'Waffle'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-xs text-stone-600 hover:text-black cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filterCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-3.5 h-3.5 rounded border-stone-300 text-[#111111] focus:ring-[#111111] cursor-pointer"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Size with live counts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 uppercase font-mono tracking-wider">
                      Size
                    </span>
                    <button
                      onClick={() => onOpenSizeGuide('Oversized')}
                      className="text-xs text-stone-500 hover:underline cursor-pointer"
                    >
                      Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sizeOptions.map((sz) => (
                      <label key={sz.label} className="flex items-center justify-between text-xs text-stone-600 hover:text-black cursor-pointer pr-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={filterSizes.includes(sz.label)}
                            onChange={() => toggleSize(sz.label)}
                            className="w-3.5 h-3.5 rounded border-stone-300 text-[#111111] focus:ring-[#111111] cursor-pointer"
                          />
                          <span className="font-mono font-medium">{sz.label}</span>
                        </div>
                        <span className="text-xs font-mono text-stone-400 tabular-nums">({sz.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Color */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 uppercase font-mono tracking-wider">
                    Color
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {colorOptions.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setFilterColor(c.name)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer text-left ${
                          filterColor === c.name ? 'bg-stone-100 font-bold text-black' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${c.border ? 'border border-stone-300' : ''}`}
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Price Slider */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 uppercase font-mono tracking-wider">
                    Max Price
                  </span>
                  <input
                    type="range"
                    min={799}
                    max={1500}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#111111] cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500 tabular-nums">
                    <span>₹799</span>
                    <span className="font-bold text-[#111111]">₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid: Expands to full 3 or 4 columns when filters are hidden */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-stone-200/80 text-center space-y-3">
              <p className="text-sm text-stone-600">No products match your search or filter settings.</p>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              showFilters
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
            }`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Vertical Portrait Mockup Container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:bg-[#ededed] transition-colors"
                  >
                    <ApparelMockup
                      colorHex={product.colors[0]?.hex || '#111112'}
                      colorName={product.colors[0]?.name || 'Pitch Black'}
                      fit={product.fit}
                      graphicStyle={product.id.includes('sunburst') ? 'minimal-sun' : 'helioz-logo'}
                      className="w-full h-full object-contain"
                      altText={product.name}
                    imageUrl={product.images?.find(isImageSource)}
                    />

                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 text-stone-800 font-semibold shadow-xs">
                        {product.isFeatured ? 'BESTSELLER' : `${product.gsm} GSM`}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black shadow-xs transition-colors"
                      title="Quick view"
                      aria-label="Quick view product"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block">
                        {product.category} · {product.gsm} GSM
                      </span>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-sm font-semibold text-[#111111] hover:text-stone-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-[#111111] font-mono tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {product.price >= 999 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <Truck className="w-3 h-3 text-emerald-600" /> Free Delivery
                          </span>
                        ) : (
                          <span className="text-xs text-stone-500 font-medium">
                            Free delivery over ₹999
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Color Swatch Dots + WhatsApp Action Button */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          triggerProductWhatsAppOrder(
                            businessInfo.phone,
                            product,
                            product.sizes[0] || 'M',
                            product.colors[0]?.name || 'Pitch Black',
                            1
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-bold rounded-full transition-all active:scale-95 shadow-sm cursor-pointer"
                        aria-label={`Order ${product.name} on WhatsApp`}
                      >
                        <MessageCircle className="w-3 h-3 fill-white/20" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. CUSTOM T-SHIRT OCCASIONS QUICK STRIP */}
        <section className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold block mb-1">
                Direct Bulk & Group Printing
              </span>
              <h2 className="text-2xl font-bold text-[#111111]">
                Custom T-Shirts for Groups, Colleges, & Offices
              </h2>
            </div>
            <button
              onClick={() => onNavigate('custom')}
              className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All 6 Occasion Categories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {customCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCustomCategory(cat)}
                className="p-3 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all cursor-pointer group"
              >
                <span className="text-xs font-mono text-stone-500 block mb-1">
                  Min {cat.minQty} pcs
                </span>
                <span className="text-xs font-bold text-[#111111] group-hover:text-stone-700 block">
                  {cat.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 5. BOTTOM 4 TRUST PILLARS STRIP */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-stone-100 rounded-full text-stone-800 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#111111]">Free Delivery Above ₹999</h4>
                <p className="text-xs text-stone-500">100% free tracked shipping across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-stone-100 rounded-full text-stone-800 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#111111]">Easy Size Exchange</h4>
                <p className="text-xs text-stone-500">Quick 4-day exchange for standard items</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-stone-100 rounded-full text-stone-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#111111]">100% Combed Cotton</h4>
                <p className="text-xs text-stone-500">Tested 220–260 GSM heavyweight durability</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-stone-100 rounded-full text-stone-800 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#111111]">Direct WhatsApp Support</h4>
                <p className="text-xs text-stone-500">+91 6379407292 · Fast human replies</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
