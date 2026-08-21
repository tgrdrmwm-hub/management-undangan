import React from 'react';
import { motion } from 'motion/react';
import { useWeddingData } from '../context/WeddingDataContext';
import { THEMES } from '../data/weddingData';
import { LAYOUT_ARCHETYPES, getLayoutArchetype } from '../data/layoutArchetypes';
import { LayoutArchetype, LayoutArchetypeInfo } from '../types';

export function useActiveTheme() {
  const { data } = useWeddingData();
  const theme = THEMES.find((t) => t.id === data.theme) || THEMES[0];
  return theme;
}

export function useActiveLayout(): LayoutArchetypeInfo {
  const { data } = useWeddingData();
  const theme = useActiveTheme();
  const layoutId = data.layoutStyle || theme.defaultLayout || 'royal-symmetrical';
  return getLayoutArchetype(layoutId);
}

/**
 * 1. Background Watermark Pattern based on Theme Archetype & Culture
 */
export function ThemeWatermark() {
  const theme = useActiveTheme();
  const layout = useActiveLayout();
  const { ornamentType, primaryColor } = theme;

  if (ornamentType === 'gunungan' || layout.id === 'javanese-kraton') {
    // Javanese Gunungan & Batik Kawung Motif
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <svg className="absolute -right-20 top-1/4 w-[500px] h-[700px]" viewBox="0 0 200 300" fill="none">
          <path
            d="M100 10 C60 60, 20 120, 20 200 C20 250, 60 290, 100 290 C140 290, 180 250, 180 200 C180 120, 140 60, 100 10 Z"
            stroke={primaryColor}
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M100 10 L100 290 M20 200 Q100 150 180 200 M40 140 Q100 110 160 140 M50 240 Q100 220 150 240" stroke={primaryColor} strokeWidth="1" />
          <circle cx="100" cy="150" r="25" stroke={primaryColor} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
        <svg className="absolute -left-20 bottom-1/4 w-[500px] h-[700px]" viewBox="0 0 200 300" fill="none">
          <path
            d="M100 10 C60 60, 20 120, 20 200 C20 250, 60 290, 100 290 C140 290, 180 250, 180 200 C180 120, 140 60, 100 10 Z"
            stroke={primaryColor}
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M100 10 L100 290 M20 200 Q100 150 180 200 M40 140 Q100 110 160 140 M50 240 Q100 220 150 240" stroke={primaryColor} strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'sunda-jasmine' || layout.id === 'sundanese-siger') {
    // Sundanese Priangan Floral & Ronce Melati
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <svg className="absolute right-0 top-10 w-96 h-96" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="70" stroke={primaryColor} strokeWidth="1" strokeDasharray="4 4" />
          <path d="M100 30 Q120 70 170 100 Q120 130 100 170 Q80 130 30 100 Q80 70 100 30 Z" stroke={primaryColor} strokeWidth="1.5" />
          <circle cx="100" cy="100" r="15" stroke={primaryColor} strokeWidth="1" />
        </svg>
        <svg className="absolute left-0 bottom-10 w-96 h-96" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="70" stroke={primaryColor} strokeWidth="1" strokeDasharray="4 4" />
          <path d="M100 30 Q120 70 170 100 Q120 130 100 170 Q80 130 30 100 Q80 70 100 30 Z" stroke={primaryColor} strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'minang-suntiang' || layout.id === 'minang-gonjong') {
    // Minangkabau Gonjong & Suntiang Pattern
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <svg className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" viewBox="0 0 400 200" fill="none">
          <path d="M40 180 Q100 40 140 120 Q200 20 260 120 Q300 40 360 180 Z" stroke={primaryColor} strokeWidth="2" />
          <path d="M80 180 Q140 80 200 140 Q260 80 320 180" stroke={primaryColor} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'bali-prada' || layout.id === 'balinese-candi') {
    // Balinese Prada & Lotus Motif
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-12 z-0">
        <svg className="absolute -right-10 top-1/3 w-80 h-80" viewBox="0 0 200 200" fill="none">
          <path d="M100 20 C140 60 180 100 100 180 C20 100 60 60 100 20 Z" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M20 100 C60 140 100 180 180 100 C100 20 60 60 20 100 Z" stroke={primaryColor} strokeWidth="1.5" />
          <circle cx="100" cy="100" r="30" stroke={primaryColor} strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'palembang-songket' || layout.id === 'palembang-songket') {
    // Palembang Songket Geometric Diamonds
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <svg className="w-full h-full" width="100%" height="100%">
          <pattern id="songket-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 55,30 30,55 5,30" stroke={primaryColor} strokeWidth="0.75" fill="none" />
            <circle cx="30" cy="30" r="4" fill={primaryColor} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#songket-grid)" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'botanical-leaf' || layout.id === 'botanical-capsule' || layout.id === 'nordic-woodland') {
    // Botanical Eucalyptus & Fern Foliage
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <svg className="absolute -right-16 top-20 w-80 h-96" viewBox="0 0 100 150" fill="none">
          <path d="M50 140 Q60 80 50 10" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M50 100 Q80 90 85 70 Q65 75 50 100" fill={primaryColor} opacity="0.4" />
          <path d="M50 80 Q20 70 15 50 Q35 55 50 80" fill={primaryColor} opacity="0.4" />
          <path d="M50 50 Q80 40 80 20 Q65 30 50 50" fill={primaryColor} opacity="0.4" />
          <path d="M50 30 Q25 20 25 5 Q40 15 50 30" fill={primaryColor} opacity="0.4" />
        </svg>
        <svg className="absolute -left-16 bottom-20 w-80 h-96" viewBox="0 0 100 150" fill="none">
          <path d="M50 140 Q60 80 50 10" stroke={primaryColor} strokeWidth="1.5" />
          <path d="M50 100 Q80 90 85 70 Q65 75 50 100" fill={primaryColor} opacity="0.4" />
          <path d="M50 80 Q20 70 15 50 Q35 55 50 80" fill={primaryColor} opacity="0.4" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'celestial-star' || layout.id === 'celestial-astral' || layout.id === 'oceanic-horizon') {
    // Celestial Constellation Stars
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15 z-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800" fill="none">
          <circle cx="150" cy="200" r="2" fill={primaryColor} />
          <circle cx="250" cy="180" r="3" fill={theme.secondaryColor} />
          <circle cx="320" cy="240" r="1.5" fill={primaryColor} />
          <line x1="150" y1="200" x2="250" y2="180" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="250" y1="180" x2="320" y2="240" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="3 3" />
          
          <circle cx="650" cy="500" r="3" fill={theme.secondaryColor} />
          <circle cx="720" cy="460" r="2" fill={primaryColor} />
          <circle cx="680" cy="580" r="2.5" fill={primaryColor} />
          <line x1="650" y1="500" x2="720" y2="460" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="650" y1="500" x2="680" y2="580" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  if (ornamentType === 'editorial-cross' || layout.id === 'minimalist-swiss' || layout.id === 'bauhaus-quadrant' || layout.id === 'vogue-lookbook') {
    // Modern Architectural Cross Grid Marks
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <div className="absolute top-10 left-10 text-xs font-mono" style={{ color: primaryColor }}>+ — — — +</div>
        <div className="absolute top-10 right-10 text-xs font-mono" style={{ color: primaryColor }}>+ — — — +</div>
        <div className="absolute bottom-10 left-10 text-xs font-mono" style={{ color: primaryColor }}>+ — — — +</div>
        <div className="absolute bottom-10 right-10 text-xs font-mono" style={{ color: primaryColor }}>+ — — — +</div>
      </div>
    );
  }

  // Default / Royal Luxury Arch
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
      <svg className="absolute inset-x-0 top-0 w-full h-48" viewBox="0 0 1000 200" fill="none">
        <path d="M0 50 Q500 180 1000 50" stroke={primaryColor} strokeWidth="1" />
        <path d="M0 70 Q500 200 1000 70" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

/**
 * 2. Distinct Corner Ornaments on Cards & Frames
 */
export function ThemeCornerOrnament() {
  const theme = useActiveTheme();
  const layout = useActiveLayout();
  const { ornamentType, primaryColor } = theme;

  if (ornamentType === 'gunungan' || layout.id === 'javanese-kraton') {
    return (
      <>
        <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 rounded-tl-sm transition-colors" style={{ borderColor: `${primaryColor}99` }} />
        <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 rounded-br-sm transition-colors" style={{ borderColor: `${primaryColor}99` }} />
      </>
    );
  }

  if (ornamentType === 'botanical-leaf' || layout.id === 'botanical-capsule' || layout.id === 'nordic-woodland') {
    return (
      <>
        <div className="absolute top-3 left-3 text-xs opacity-70" style={{ color: primaryColor }}>🌿</div>
        <div className="absolute bottom-3 right-3 text-xs opacity-70 rotate-180" style={{ color: primaryColor }}>🌿</div>
      </>
    );
  }

  if (ornamentType === 'romantic-rose' || layout.id === 'romantic-chiffon') {
    return (
      <>
        <div className="absolute top-3 left-3 text-xs opacity-70" style={{ color: primaryColor }}>🌸</div>
        <div className="absolute bottom-3 right-3 text-xs opacity-70" style={{ color: primaryColor }}>🌸</div>
      </>
    );
  }

  if (ornamentType === 'celestial-star' || layout.id === 'celestial-astral') {
    return (
      <>
        <div className="absolute top-3 left-3 text-xs opacity-80" style={{ color: primaryColor }}>✦</div>
        <div className="absolute bottom-3 right-3 text-xs opacity-80" style={{ color: primaryColor }}>✦</div>
      </>
    );
  }

  if (ornamentType === 'editorial-cross' || layout.id === 'minimalist-swiss' || layout.id === 'bauhaus-quadrant') {
    return (
      <>
        <div className="absolute top-2.5 left-2.5 font-mono text-[10px] font-bold opacity-60" style={{ color: primaryColor }}>+</div>
        <div className="absolute top-2.5 right-2.5 font-mono text-[10px] font-bold opacity-60" style={{ color: primaryColor }}>+</div>
        <div className="absolute bottom-2.5 left-2.5 font-mono text-[10px] font-bold opacity-60" style={{ color: primaryColor }}>+</div>
        <div className="absolute bottom-2.5 right-2.5 font-mono text-[10px] font-bold opacity-60" style={{ color: primaryColor }}>+</div>
      </>
    );
  }

  // Classic Royal Corners
  return (
    <>
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 transition-colors" style={{ borderColor: `${primaryColor}80` }} />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 transition-colors" style={{ borderColor: `${primaryColor}80` }} />
    </>
  );
}

/**
 * 3. Section Title Decorative Divider
 */
export function ThemeDivider() {
  const theme = useActiveTheme();
  const layout = useActiveLayout();
  const { ornamentType, primaryColor } = theme;

  let centerSymbol = '✦';
  if (ornamentType === 'gunungan' || layout.id === 'javanese-kraton') centerSymbol = '❖';
  if (ornamentType === 'sunda-jasmine' || layout.id === 'sundanese-siger') centerSymbol = '❀';
  if (ornamentType === 'minang-suntiang' || layout.id === 'minang-gonjong') centerSymbol = '◈';
  if (ornamentType === 'bali-prada' || layout.id === 'balinese-candi') centerSymbol = '⚜';
  if (ornamentType === 'palembang-songket' || layout.id === 'palembang-songket') centerSymbol = '◆';
  if (ornamentType === 'botanical-leaf' || layout.id === 'botanical-capsule') centerSymbol = '🍃';
  if (ornamentType === 'romantic-rose' || layout.id === 'romantic-chiffon') centerSymbol = '❦';
  if (ornamentType === 'celestial-star' || layout.id === 'celestial-astral') centerSymbol = '✧';
  if (ornamentType === 'editorial-cross' || layout.id === 'minimalist-swiss') centerSymbol = '—';

  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div 
        className="h-[1px] w-12 sm:w-20"
        style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }}
      />
      <span className="text-xs sm:text-sm font-serif-luxury" style={{ color: primaryColor }}>
        {centerSymbol}
      </span>
      <div 
        className="h-[1px] w-12 sm:w-20"
        style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }}
      />
    </div>
  );
}

/**
 * 4. Theme Badge Indicator
 */
export function ThemeCulturalBadge() {
  const theme = useActiveTheme();
  const layout = useActiveLayout();
  const label = layout.culturalTag || theme.culturalLabel;
  if (!label) return null;

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border shadow-xs"
      style={{
        backgroundColor: `${theme.primaryColor}18`,
        color: theme.primaryColor,
        borderColor: `${theme.primaryColor}40`,
      }}
    >
      <span>{label}</span>
    </span>
  );
}

