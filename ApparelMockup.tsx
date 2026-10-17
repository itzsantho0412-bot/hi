import React, { useState } from 'react';
import { TShirtFit } from '../types';
import { isImageSource } from '../services/image';

interface ApparelMockupProps {
  colorHex?: string;
  colorName?: string;
  fit?: TShirtFit;
  graphicStyle?: 'helioz-logo' | 'minimal-sun' | 'acid-wash' | 'blank' | 'custom-print';
  graphicText?: string;
  view?: 'front' | 'back' | 'detail';
  imageUrl?: string;
  className?: string;
  altText?: string;
}

export const ApparelMockup: React.FC<ApparelMockupProps> = ({
  colorHex = '#111112',
  colorName = 'Pitch Black',
  fit = 'Oversized',
  graphicStyle = 'helioz-logo',
  graphicText,
  view = 'front',
  imageUrl,
  className = '',
  altText = 'HELIOZ Premium Heavyweight T-Shirt',
}) => {
  const [imageError, setImageError] = useState(false);

  // If a valid image URL is provided and has not errored, render it with fallback handling
  if (imageUrl && !imageError && isImageSource(imageUrl)) {
    return (
      <div className={`relative overflow-hidden bg-neutral-900 flex items-center justify-center ${className}`}>
        <img
          src={imageUrl}
          alt={altText}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  // Determine fabric color tone
  const isLightColor = colorHex.toLowerCase() === '#f4f2ed' ||
                       colorHex.toLowerCase() === '#faf9f5' ||
                       colorHex.toLowerCase() === '#ede8dd' ||
                       colorHex.toLowerCase() === '#ede9df' ||
                       colorHex.toLowerCase() === '#f5f3ec';

  const inkColor = isLightColor ? '#1a1a1a' : '#f5f5f5';
  const shadowColor = isLightColor ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.45)';
  const highlightColor = isLightColor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.06)';

  return (
    <div
      className={`relative select-none flex items-center justify-center overflow-hidden bg-[#f4f4f4] group transition-all duration-300 ${className}`}
      aria-label={`${altText} in ${colorName}`}
    >
      {/* Subtle light studio gradient */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, #ffffff 0%, rgba(230,230,230,0.6) 100%)`,
        }}
      />

      {/* T-Shirt Vector Silhouette with Realistic Folds and Drop-Shoulder Contour */}
      <svg
        viewBox="0 0 500 560"
        className="w-full h-full max-h-[460px] drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for realistic 3D torso lighting */}
          <linearGradient id={`torso-grad-${colorHex.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorHex} stopOpacity="0.88" />
            <stop offset="25%" stopColor={colorHex} />
            <stop offset="50%" stopColor={colorHex} />
            <stop offset="75%" stopColor={colorHex} />
            <stop offset="100%" stopColor={colorHex} stopOpacity="0.88" />
          </linearGradient>

          {/* Heather / Acid wash noise filter */}
          {colorName.includes('Acid') || colorName.includes('Vintage') ? (
            <filter id="fabric-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
              <feBlend mode="multiply" in="SourceGraphic" result="blend" />
            </filter>
          ) : null}
        </defs>

        {/* Sleeves & Main Torso Silhouette (Oversized Streetwear Silhouette) */}
        <g filter={colorName.includes('Acid') ? 'url(#fabric-noise)' : undefined}>
          {/* Base Shirt Body */}
          <path
            d="M 180 60
               C 210 75, 290 75, 320 60
               L 405 92
               C 425 100, 470 120, 480 170
               C 485 195, 455 220, 430 230
               L 395 190
               L 395 500
               C 395 510, 390 515, 380 515
               L 120 515
               C 110 515, 105 510, 105 500
               L 105 190
               L 70 230
               C 45 220, 15 195, 20 170
               C 30 120, 75 100, 95 92
               Z"
            fill={`url(#torso-grad-${colorHex.replace('#', '')})`}
            stroke={shadowColor}
            strokeWidth="1.5"
          />

          {/* Underarm Shadow drapes */}
          <path
            d="M 105 190 C 130 220, 140 280, 125 350"
            stroke={shadowColor}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 395 190 C 370 220, 360 280, 375 350"
            stroke={shadowColor}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Chest & Torso Subtle Fabric Flow Folds */}
          <path
            d="M 160 220 Q 250 240 340 220"
            stroke={highlightColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 150 280 Q 250 305 350 280"
            stroke={shadowColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 140 360 Q 250 380 360 360"
            stroke={highlightColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Bottom Hem Stitching line */}
          <line x1="108" y1="500" x2="392" y2="500" stroke={shadowColor} strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
          <line x1="108" y1="504" x2="392" y2="504" stroke={shadowColor} strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />

          {/* Sleeve Hem Stitching */}
          <line x1="430" y1="225" x2="475" y2="175" stroke={shadowColor} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
          <line x1="70" y1="225" x2="25" y2="175" stroke={shadowColor} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />

          {/* High-Rib Collar Structure */}
          {view === 'front' ? (
            <g>
              {/* Inside neck back curve */}
              <path
                d="M 195 62 C 220 54, 280 54, 305 62"
                stroke={shadowColor}
                strokeWidth="4"
                fill="none"
              />
              {/* Collar Rib Band */}
              <path
                d="M 180 60 C 215 95, 285 95, 320 60 C 300 102, 200 102, 180 60 Z"
                fill={colorHex}
                stroke={shadowColor}
                strokeWidth="2.5"
              />
              {/* Ribbing texture stripes on collar */}
              <path
                d="M 195 72 L 198 77 M 215 82 L 217 88 M 235 88 L 236 94 M 250 89 L 250 95 M 265 88 L 264 94 M 285 82 L 283 88 M 305 72 L 302 77"
                stroke={shadowColor}
                strokeWidth="1.5"
                opacity="0.6"
              />
            </g>
          ) : (
            <g>
              {/* Back Neckline */}
              <path
                d="M 180 60 C 215 50, 285 50, 320 60 C 300 70, 200 70, 180 60 Z"
                fill={colorHex}
                stroke={shadowColor}
                strokeWidth="2.5"
              />
            </g>
          )}
        </g>

        {/* Graphics Placed on the Shirt */}
        {view === 'front' ? (
          <g transform="translate(0, 0)">
            {graphicStyle === 'helioz-logo' && (
              <g transform="translate(190, 150) scale(0.65)" opacity="0.9">
                <text
                  x="0"
                  y="20"
                  fill={inkColor}
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="24"
                  fontWeight="bold"
                  letterSpacing="3"
                >
                  HELI
                </text>
                {/* Mini sun */}
                <circle cx="85" cy="12" r="10" stroke={inkColor} strokeWidth="1.8" fill="none" />
                <path
                  d="M 85 0 L 85 -4 M 85 24 L 85 28 M 73 12 L 69 12 M 97 12 L 101 12 M 76 3 L 73 0 M 94 21 L 97 24 M 94 3 L 97 0 M 76 21 L 73 24"
                  stroke={inkColor}
                  strokeWidth="1.6"
                />
                <text
                  x="105"
                  y="20"
                  fill={inkColor}
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="24"
                  fontWeight="bold"
                  letterSpacing="3"
                >
                  Z
                </text>
                <text
                  x="30"
                  y="38"
                  fill={inkColor}
                  fontFamily="'Cinzel', Georgia, serif"
                  fontSize="9"
                  letterSpacing="4"
                  opacity="0.75"
                >
                  - CLOTHING -
                </text>
              </g>
            )}

            {graphicStyle === 'minimal-sun' && (
              <g transform="translate(205, 175) scale(0.9)" opacity="0.92">
                <circle cx="50" cy="50" r="18" stroke={inkColor} strokeWidth="2.5" fill="none" />
                {/* Sun rays */}
                <path
                  d="M 50 18 L 50 8 M 50 82 L 50 92 M 18 50 L 8 50 M 82 50 L 92 50 M 27 27 L 20 20 M 73 73 L 80 80 M 73 27 L 80 20 M 27 73 L 20 80"
                  stroke={inkColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <text
                  x="10"
                  y="118"
                  fill={inkColor}
                  fontFamily="'Outfit', sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="5"
                >
                  HELIOZ STUDIO
                </text>
              </g>
            )}

            {graphicStyle === 'custom-print' && (
              <g transform="translate(160, 180) scale(0.9)" opacity="0.9">
                <rect x="0" y="0" width="200" height="110" rx="4" fill="none" stroke={inkColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <text
                  x="100"
                  y="45"
                  fill={inkColor}
                  textAnchor="middle"
                  fontFamily="'Outfit', sans-serif"
                  fontSize="16"
                  fontWeight="bold"
                  letterSpacing="1.5"
                >
                  {graphicText || 'YOUR CUSTOM DESIGN'}
                </text>
                <text
                  x="100"
                  y="70"
                  fill={inkColor}
                  textAnchor="middle"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontSize="11"
                  opacity="0.8"
                >
                  DTF · Screen Print · Puff 3D
                </text>
              </g>
            )}
          </g>
        ) : (
          /* Back view - spine or bold graphic */
          <g transform="translate(170, 140) scale(0.85)" opacity="0.85">
            <text
              x="90"
              y="50"
              textAnchor="middle"
              fill={inkColor}
              fontFamily="'Cinzel', Georgia, serif"
              fontSize="34"
              fontWeight="800"
              letterSpacing="6"
            >
              H E L I O Z
            </text>
            <text
              x="90"
              y="75"
              textAnchor="middle"
              fill={inkColor}
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="9"
              letterSpacing="4"
              opacity="0.7"
            >
              CRAFTED IN TAMIL NADU · 240 GSM
            </text>
            <line x1="30" y1="95" x2="150" y2="95" stroke={inkColor} strokeWidth="1" opacity="0.4" />
          </g>
        )}
      </svg>

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
        <span className="text-xs font-mono tracking-wider font-semibold px-2 py-0.5 bg-white/80 backdrop-blur-md text-stone-700 border border-stone-200/80 rounded">
          {fit}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-600 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded border border-stone-200/60">
          {colorName}
        </span>
      </div>
    </div>
  );
};
