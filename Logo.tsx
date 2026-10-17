import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  variant?: 'full' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  theme = 'auto',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
}) => {
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Dynamic sizing
  const dimensions = {
    sm: { width: 140, height: 42, iconSize: 22 },
    md: { width: 190, height: 56, iconSize: 28 },
    lg: { width: 240, height: 72, iconSize: 36 },
    xl: { width: 320, height: 96, iconSize: 48 },
  }[size];

  // Colors
  const textColor = isDark ? '#ffffff' : isLight ? '#0a0a0a' : 'currentColor';
  const sunColor = isDark ? '#f59e0b' : isLight ? '#0a0a0a' : 'currentColor';

  if (variant === 'mark-only') {
    return (
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="HELIOZ Sun Icon"
      >
        <circle cx="50" cy="50" r="21" stroke={sunColor} strokeWidth="3.5" fill="none" />
        {/* Radiating undulating sun rays */}
        <g stroke={sunColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M50 25 C 47 18, 53 10, 50 4" />
          <path d="M50 75 C 53 82, 47 90, 50 96" />
          <path d="M25 50 C 18 53, 10 47, 4 50" />
          <path d="M75 50 C 82 47, 90 53, 96 50" />
          {/* Diagonals */}
          <path d="M32 32 C 26 27, 21 21, 16 16" />
          <path d="M68 68 C 74 73, 79 79, 84 84" />
          <path d="M68 32 C 73 26, 79 21, 84 16" />
          <path d="M32 68 C 27 74, 21 79, 16 84" />
          {/* Secondary wavy intermediate rays */}
          <path d="M40 27 C 36 21, 41 15, 38 10" />
          <path d="M60 27 C 64 21, 59 15, 62 10" />
          <path d="M40 73 C 36 79, 41 85, 38 90" />
          <path d="M60 73 C 64 79, 59 85, 62 90" />
          <path d="M27 40 C 21 36, 15 41, 10 38" />
          <path d="M27 60 C 21 64, 15 59, 10 62" />
          <path d="M73 40 C 79 36, 85 41, 90 38" />
          <path d="M73 60 C 79 64, 85 59, 90 62" />
        </g>
        <circle cx="50" cy="50" r="14" fill={isDark ? '#0c0c0c' : '#ffffff'} />
      </svg>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`} aria-label="HELIOZ CLOTHING">
      <div className="flex items-center tracking-tight font-serif">
        {/* HELI */}
        <span
          className="text-2xl md:text-3xl font-extrabold tracking-[0.18em] transition-colors"
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            color: textColor,
          }}
        >
          HELI
        </span>

        {/* The intricate Radiating Sun O mark */}
        <span className="relative inline-flex items-center justify-center mx-1 my-auto">
          <svg
            className="w-7 h-7 md:w-8 md:h-8 transition-transform hover:rotate-45 duration-700 ease-out"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer flame rays */}
            <g stroke={sunColor} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M50 24 C 47 17, 53 10, 50 3" />
              <path d="M50 76 C 53 83, 47 90, 50 97" />
              <path d="M24 50 C 17 53, 10 47, 3 50" />
              <path d="M76 50 C 83 47, 90 53, 97 50" />
              <path d="M31 31 C 25 26, 20 20, 14 14" />
              <path d="M69 69 C 75 74, 80 80, 86 86" />
              <path d="M69 31 C 74 25, 80 20, 86 14" />
              <path d="M31 69 C 26 75, 20 80, 14 86" />
              <path d="M40 26 C 36 19, 42 13, 38 7" />
              <path d="M60 26 C 64 19, 58 13, 62 7" />
              <path d="M40 74 C 36 81, 42 87, 38 93" />
              <path d="M60 74 C 64 81, 58 87, 62 93" />
              <path d="M26 40 C 19 36, 13 42, 7 38" />
              <path d="M26 60 C 19 64, 13 58, 7 62" />
              <path d="M74 40 C 81 36, 87 42, 93 38" />
              <path d="M74 60 C 81 64, 87 58, 93 62" />
            </g>
            {/* Sun center core */}
            <circle cx="50" cy="50" r="22" stroke={sunColor} strokeWidth="3" fill={isDark ? '#0c0c0c' : '#ffffff'} />
            <circle cx="50" cy="50" r="16" fill="none" stroke={sunColor} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          </svg>
        </span>

        {/* Z */}
        <span
          className="text-2xl md:text-3xl font-extrabold tracking-[0.18em] transition-colors"
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            color: textColor,
          }}
        >
          Z
        </span>
      </div>

      {showSubtitle && (
        <span
          className="text-xs md:text-xs font-medium tracking-[0.35em] text-stone-400 -mt-0.5 transition-colors"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          - clothing -
        </span>
      )}
    </div>
  );
};
