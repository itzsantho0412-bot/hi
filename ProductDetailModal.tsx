import React, { useState } from 'react';
import { X, MessageCircle, Ruler, ShieldCheck, Truck, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ApparelMockup } from './ApparelMockup';
import { isImageSource } from '../services/image';
import { buildProductWhatsAppUrl, triggerProductWhatsAppOrder } from '../services/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onOpenSizeGuide: (fitType: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = (props) => {
  // Hooks live in the inner component so the early return never changes hook order.
  if (!props.isOpen || !props.product) return null;
  return <ProductDetailContent {...props} product={props.product} />;
};

const ProductDetailContent: React.FC<Omit<ProductDetailModalProps, 'isOpen' | 'product'> & { product: Product }> = ({
  product,
  onClose,
  phone,
  onOpenSizeGuide,
}) => {

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Pitch Black', hex: '#111112' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [activeImage, setActiveImage] = useState<number>(0);
  const uploadedImages = (product.images || []).filter(isImageSource);

  const { rawMessage } = buildProductWhatsAppUrl(
    phone,
    product,
    selectedSize,
    selectedColor.name,
    quantity
  );

  const handleOrder = () => {
    triggerProductWhatsAppOrder(phone, product, selectedSize, selectedColor.name, quantity);
  };

  const totalPrice = product.price * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-[#111111] overflow-hidden my-auto max-h-[94vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Mockup & Angles */}
        <div className="w-full md:w-1/2 bg-[#f4f4f4] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative flex-1 flex items-center justify-center min-h-[320px] sm:min-h-[380px]">
            <ApparelMockup
              colorHex={selectedColor.hex}
              colorName={selectedColor.name}
              fit={product.fit}
              view={activeView}
              graphicStyle={product.id.includes('sunburst') ? 'minimal-sun' : 'helioz-logo'}
              className="w-full h-full max-h-[420px] rounded-xl"
              altText={product.name}
              imageUrl={uploadedImages[activeImage]}
            />
          </div>

          {uploadedImages.length > 1 && (
            <div className="flex gap-2 justify-center pt-3 overflow-x-auto">
              {uploadedImages.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`w-14 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${idx === activeImage ? 'border-black' : 'border-stone-200'}`}
                  aria-label={`Show photo ${idx + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Angle switcher buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-200">
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                activeView === 'front'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'bg-white text-stone-600 hover:text-black border border-stone-200'
              }`}
            >
              Front Look
            </button>
            <button
              onClick={() => setActiveView('back')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                activeView === 'back'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'bg-white text-stone-600 hover:text-black border border-stone-200'
              }`}
            >
              Back Look
            </button>
            <button
              onClick={() => onOpenSizeGuide(product.fit)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-stone-700 hover:text-black transition-colors ml-auto cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Header & Pricing */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.gsm} GSM</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-stone-800">{product.fit}</span>
            </div>

            <h2 id="product-modal-title" className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-extrabold text-[#111111] font-mono tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-emerald-600 font-medium ml-1">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Color: <span className="text-[#111111]">{selectedColor.name}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`relative w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      isSelected ? 'border-[#111111] scale-110 shadow-sm' : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Select color ${c.name}`}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.hex === '#f4f2ed' || c.hex === '#faf9f5' ? 'text-black' : 'text-white'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Select Size: <span className="text-[#111111] font-mono font-bold">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => onOpenSizeGuide(product.fit)}
                className="text-xs text-stone-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3 h-3" />
                View Sizing Chart
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-stone-600 hover:text-black hover:bg-stone-200/50 transition-colors rounded-l-lg font-mono"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-mono font-bold text-black tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-stone-600 hover:text-black hover:bg-stone-200/50 transition-colors rounded-r-lg font-mono"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Free Delivery Threshold Status Banner */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            totalPrice >= 999
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            <div className="flex items-center gap-2">
              <Truck className={`w-4 h-4 shrink-0 ${totalPrice >= 999 ? 'text-emerald-600' : 'text-stone-700'}`} />
              {totalPrice >= 999 ? (
                <span><strong>FREE Delivery Unlocked!</strong> This order qualifies for free delivery across India.</span>
              ) : (
                <span>Add <strong>₹{(999 - totalPrice).toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong> across India!</span>
              )}
            </div>
            {totalPrice < 999 && (
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-xs font-bold text-stone-900 underline whitespace-nowrap cursor-pointer hover:text-black"
              >
                +1 T-Shirt
              </button>
            )}
          </div>

          {/* Live WhatsApp Message Preview */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500">
              Pre-filled WhatsApp Message:
            </span>
            <p className="text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed">
              Order {product.name} ({selectedColor.name}, Size {selectedSize}, Qty: {quantity}) · Total ₹{totalPrice.toLocaleString('en-IN')} · Delivery: {totalPrice >= 999 ? 'FREE (Order above ₹999)' : 'Standard (Free above ₹999)'}
            </p>
          </div>

          {/* Primary Action Button: Order on WhatsApp */}
          <button
            onClick={handleOrder}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-[#111111] hover:bg-black text-white font-bold text-sm sm:text-base rounded-full transition-all active:scale-[0.98] shadow-md cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Order on WhatsApp — ₹{totalPrice.toLocaleString('en-IN')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
              <span>100% Combed Cotton</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-700 shrink-0" />
              <span>All India Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-stone-700 shrink-0" />
              <span>Easy Size Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-stone-700 shrink-0" />
              <span>Direct Chat with HELIOZ Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
