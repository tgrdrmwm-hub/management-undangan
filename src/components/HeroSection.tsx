import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Sparkles, ChevronDown, Clock, Compass, Crown, Heart, Star, Disc, Tag, Layers } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { THEMES } from '../data/weddingData';
import { useActiveTheme, useActiveLayout, ThemeWatermark, ThemeDivider, ThemeCulturalBadge } from './ThemeDecorations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function HeroSection({ onScrollDown }: { onScrollDown: () => void }) {
  const { data } = useWeddingData();
  const weddingDateObj = new Date(data.weddingDate);

  const activeTheme = useActiveTheme();
  const activeLayout = useActiveLayout();
  const primaryColor = activeTheme.primaryColor;
  const secondaryColor = activeTheme.secondaryColor;

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +weddingDateObj - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDate]);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`The Wedding of ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(`Pernikahan ${data.groom.fullName} & ${data.bride.fullName}.`);
    const location = encodeURIComponent(data.events[0]?.venueName || data.cityLocation || 'Venue');
    
    // Format YYYYMMDDTHHmmSSZ
    const d = weddingDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${d}/${d}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const formattedDate = weddingDateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const countdownUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  const heroLayoutType = activeLayout.heroLayout || 'symmetrical';

  return (
    <section 
      id="section-hero" 
      className="relative min-h-screen flex flex-col items-center justify-between text-center px-4 py-16 overflow-hidden"
      style={{ backgroundColor: activeTheme.bgHex }}
    >
      {/* Dynamic Watermark Motif based on active theme & layout */}
      <ThemeWatermark />

      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
          alt="Wedding Hero"
          className="w-full h-full object-cover object-center opacity-25 scale-100"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${activeTheme.bgHex}ee, ${activeTheme.bgHex}cc, ${activeTheme.bgHex})`
          }}
        />
      </div>

      {/* Main Container rendering specific Layout Archetype */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center space-y-6">
        
        {/* ==========================================
            VARIANT 1: SPLIT DUOTONE / EDITORIAL
           ========================================== */}
        {heroLayoutType === 'split-duotone' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left py-4">
            {/* Left Column: Portrait Vignette Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="md:col-span-5 relative group"
            >
              <div 
                className="relative rounded-2xl overflow-hidden border-2 shadow-2xl p-2"
                style={{ borderColor: `${primaryColor}60`, backgroundColor: `${activeTheme.cardBgHex}80` }}
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
                  <img 
                    src={data.groom.photoUrl} 
                    alt="Couple" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-300">EST. {weddingDateObj.getFullYear()}</span>
                    <h3 className="font-serif-luxury text-xl font-bold text-white">{data.groom.name} & {data.bride.name}</h3>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Editorial Typography & Horizontal Timer */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="md:col-span-7 space-y-5"
            >
              <div className="flex items-center gap-2">
                <ThemeCulturalBadge />
                <span className="text-xs font-mono tracking-widest uppercase px-2.5 py-0.5 rounded border" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
                  Exclusive Invitation
                </span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-neutral-50 leading-tight">
                {data.groom.name} <br />
                <span className="font-script text-5xl sm:text-7xl" style={{ color: secondaryColor }}>&amp;</span> {data.bride.name}
              </h1>

              <p className="text-sm font-sans tracking-wide text-neutral-300 flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{formattedDate} • {data.cityLocation || 'Indonesia'}</span>
              </p>

              {/* Editorial Linear Timer */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2">
                  {countdownUnits.map((u, i) => (
                    <div key={i} className="p-3 rounded-lg border backdrop-blur-sm text-center" style={{ backgroundColor: `${activeTheme.cardBgHex}90`, borderColor: `${primaryColor}30` }}>
                      <span className="block font-mono text-2xl font-bold" style={{ color: secondaryColor }}>{String(u.value).padStart(2, '0')}</span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">{u.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-xs font-medium transition-all shadow-md cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: activeTheme.bgHex }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Simpan ke Google Calendar</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ==========================================
            VARIANT 2: CULTURAL GATE / ADAT NUSANTARA
           ========================================== */}
        {heroLayoutType === 'cultural-gate' && (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Cultural Arch Crown */}
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-1" />
              <ThemeCulturalBadge />
              <div 
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border text-xs uppercase tracking-[0.3em] font-cinzel shadow-md backdrop-blur-md"
                style={{
                  backgroundColor: `${activeTheme.cardBgHex}b3`,
                  borderColor: `${primaryColor}60`,
                  color: secondaryColor
                }}
              >
                <span>{data.invitationTitle || 'Pawiwahan Agung & Resepsi'}</span>
              </div>
            </motion.div>

            {/* Couple Names with Cultural Embellishment */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-3 relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-30 text-3xl">❖</div>
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100 tracking-wider">
                {data.groom.name}{' '}
                <span 
                  className="font-script text-5xl sm:text-7xl md:text-8xl mx-2"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  &amp;
                </span>{' '}
                {data.bride.name}
              </h1>
              <p 
                className="text-xs sm:text-base tracking-[0.25em] font-cinzel font-medium uppercase"
                style={{ color: primaryColor }}
              >
                {formattedDate} {data.cityLocation ? `• ${data.cityLocation}` : ''}
              </p>
            </motion.div>

            <ThemeDivider />

            {/* Cultural Carved Stone Countdown Tiles */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="text-[11px] uppercase tracking-[0.25em] mb-3 font-cinzel" style={{ color: `${primaryColor}e6` }}>
                Wanci Kalaksanan Pawiwahan
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {countdownUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className="border-2 rounded-xl p-2.5 sm:p-4 text-center shadow-2xl relative overflow-hidden group transition-all backdrop-blur-md"
                    style={{
                      backgroundColor: `${activeTheme.cardBgHex}f0`,
                      borderColor: `${primaryColor}50`,
                      boxShadow: `0 8px 30px rgba(0,0,0,0.5)`
                    }}
                  >
                    <div className="absolute top-1 left-1 text-[9px] opacity-40 font-mono">❖</div>
                    <div className="absolute top-1 right-1 text-[9px] opacity-40 font-mono">❖</div>
                    <span 
                      className="block font-cinzel text-xl sm:text-3xl md:text-4xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase tracking-wider text-neutral-300 font-medium">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-cinzel uppercase tracking-wider transition-all shadow-lg cursor-pointer hover:scale-105"
                  style={{
                    backgroundColor: `${activeTheme.cardBgHex}`,
                    borderColor: primaryColor,
                    color: secondaryColor
                  }}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  <span>Catat Hari Bahagia</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ==========================================
            VARIANT 3: LINEAR MINIMALIST SWISS
           ========================================== */}
        {heroLayoutType === 'linear-minimal' && (
          <div className="w-full max-w-3xl text-left space-y-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: `${primaryColor}30` }}
            >
              <span className="font-mono text-xs tracking-widest uppercase text-neutral-400">WEDDING INVITATION — NO. 2026</span>
              <ThemeCulturalBadge />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-light tracking-tight text-white leading-none">
                {data.groom.name} <span className="font-serif italic font-normal" style={{ color: primaryColor }}>&amp;</span> {data.bride.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-neutral-300 pt-2">
                <span>DATE: {formattedDate}</span>
                <span>/</span>
                <span>LOC: {data.cityLocation || 'JAKARTA'}</span>
              </div>
            </motion.div>

            {/* Sleek Horizontal Timer Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-4 rounded-xl border backdrop-blur-md"
              style={{ backgroundColor: `${activeTheme.cardBgHex}80`, borderColor: `${primaryColor}40` }}
            >
              <div className="grid grid-cols-4 divide-x text-center" style={{ borderColor: `${primaryColor}30` }}>
                {countdownUnits.map((u, idx) => (
                  <div key={idx} className="px-2">
                    <span className="block font-mono text-2xl sm:text-4xl font-light text-white">{String(u.value).padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{u.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCalendar}
                className="px-5 py-2.5 rounded border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer hover:bg-white/10"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                + Google Calendar
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 4: CELESTIAL ASTRAL RINGS
           ========================================== */}
        {heroLayoutType === 'astral-rings' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 rounded-full border border-dashed flex items-center justify-center animate-spin-slow"
              style={{ borderColor: primaryColor, color: secondaryColor }}
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 text-center"
            >
              <span className="text-xs uppercase font-mono tracking-[0.4em] text-neutral-300">Written In The Stars</span>
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100">
                {data.groom.name} <span className="font-script text-5xl sm:text-7xl" style={{ color: secondaryColor }}>&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-widest" style={{ color: primaryColor }}>
                ✦ {formattedDate} ✦
              </p>
            </motion.div>

            {/* Circular Astral Ring Countdown */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-4">
              {countdownUnits.map((u, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08 }}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 flex flex-col items-center justify-center relative shadow-lg backdrop-blur-md"
                  style={{
                    backgroundColor: `${activeTheme.cardBgHex}b3`,
                    borderColor: `${primaryColor}80`,
                    boxShadow: `0 0 25px ${primaryColor}30`
                  }}
                >
                  <span className="font-cinzel text-xl sm:text-3xl font-bold text-white">{String(u.value).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-300">{u.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-cinzel transition-all shadow-md cursor-pointer hover:opacity-90"
                style={{ backgroundColor: `${activeTheme.cardBgHex}`, borderColor: primaryColor, color: secondaryColor }}
              >
                <Calendar className="w-4 h-4" />
                <span>Simpan Tanggal Bintang</span>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 5: VOGUE MAGAZINE LOOKBOOK
           ========================================== */}
        {heroLayoutType === 'magazine-masthead' && (
          <div className="w-full max-w-4xl border-2 rounded-2xl p-6 sm:p-10 text-left space-y-6 relative overflow-hidden backdrop-blur-md"
            style={{ backgroundColor: `${activeTheme.cardBgHex}d9`, borderColor: `${primaryColor}50` }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: `${primaryColor}40` }}>
              <span className="font-serif-luxury text-2xl sm:text-4xl font-black tracking-tighter text-white">VOGUE WEDDING</span>
              <div className="text-right">
                <span className="block font-mono text-[10px] text-neutral-400">SPECIAL EDITION</span>
                <span className="font-mono text-xs font-bold" style={{ color: primaryColor }}>ISSUE NO. 01</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded border" style={{ borderColor: `${primaryColor}40`, color: secondaryColor }}>
                  The Union of Two Souls
                </span>
                <h1 className="font-serif-luxury text-4xl sm:text-6xl font-black text-white leading-tight">
                  {data.groom.name} <br />
                  <span className="italic font-serif" style={{ color: primaryColor }}>with</span> {data.bride.name}
                </h1>
                <p className="text-xs sm:text-sm font-serif-luxury italic text-neutral-300">
                  &ldquo;A celebration of eternal love, grace, and modern elegance.&rdquo;
                </p>
                <div className="text-xs font-mono text-neutral-400">
                  {formattedDate} • {data.cityLocation || 'Jakarta, Indonesia'}
                </div>
              </div>

              <div className="md:col-span-4 bg-black/40 p-4 rounded-xl border space-y-3 text-center" style={{ borderColor: `${primaryColor}30` }}>
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">COUNTDOWN TO ISSUE</span>
                <div className="grid grid-cols-2 gap-2">
                  {countdownUnits.map((u, i) => (
                    <div key={i} className="p-2 rounded bg-white/5 border border-white/10">
                      <span className="block font-mono text-xl font-bold" style={{ color: secondaryColor }}>{String(u.value).padStart(2, '0')}</span>
                      <span className="text-[8px] font-mono uppercase text-neutral-400">{u.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddToCalendar}
                  className="w-full py-2 rounded text-[11px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                  style={{ backgroundColor: primaryColor, color: activeTheme.bgHex }}
                >
                  Save Date
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 6: BAUHAUS QUADRANT GRID
           ========================================== */}
        {heroLayoutType === 'quadrant-grid' && (
          <div className="w-full max-w-3xl space-y-6">
            <div className="border-4 p-6 sm:p-8 rounded-none text-left space-y-6" style={{ borderColor: primaryColor, backgroundColor: `${activeTheme.cardBgHex}eb` }}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold uppercase tracking-widest px-2 py-1 bg-black text-white">01 / CEREMONY</span>
                <ThemeCulturalBadge />
              </div>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                {data.groom.name} <span style={{ color: primaryColor }}>+</span> {data.bride.name}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t-2 border-l-2" style={{ borderColor: primaryColor }}>
                {countdownUnits.map((u, i) => (
                  <div key={i} className="p-4 border-r-2 border-b-2 text-center" style={{ borderColor: primaryColor }}>
                    <span className="block font-mono text-3xl sm:text-5xl font-black text-white">{String(u.value).padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: secondaryColor }}>{u.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-between items-center pt-2 text-xs font-mono text-neutral-300">
                <span>{formattedDate}</span>
                <button
                  onClick={handleAddToCalendar}
                  className="px-4 py-2 font-mono font-bold uppercase tracking-wider transition-all cursor-pointer hover:invert"
                  style={{ backgroundColor: primaryColor, color: activeTheme.bgHex }}
                >
                  ADD EVENT →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 7: BOTANICAL CAPSULE PILL
           ========================================== */}
        {heroLayoutType === 'capsule-pill' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border shadow-sm backdrop-blur-md"
              style={{ backgroundColor: `${activeTheme.cardBgHex}90`, borderColor: `${primaryColor}50`, color: primaryColor }}
            >
              <span>🌿</span>
              <span className="text-xs uppercase tracking-[0.25em] font-cinzel">The Botanical Wedding</span>
              <span>🌿</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100">
                {data.groom.name} <span className="font-script text-5xl sm:text-7xl" style={{ color: secondaryColor }}>&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs sm:text-sm font-cinzel tracking-widest text-neutral-300">
                {formattedDate} • {data.cityLocation || 'Botanical Garden'}
              </p>
            </motion.div>

            <ThemeDivider />

            {/* Pill Capsule Timer */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-lg">
              {countdownUnits.map((u, i) => (
                <div
                  key={i}
                  className="px-5 py-3 rounded-full border shadow-md flex items-center gap-2 backdrop-blur-md"
                  style={{ backgroundColor: `${activeTheme.cardBgHex}cc`, borderColor: `${primaryColor}40` }}
                >
                  <span className="font-cinzel text-xl sm:text-2xl font-bold" style={{ color: secondaryColor }}>{String(u.value).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase font-cinzel tracking-wider text-neutral-300">{u.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-cinzel transition-all shadow-md cursor-pointer hover:scale-105"
                style={{ backgroundColor: activeTheme.cardBgHex, borderColor: primaryColor, color: secondaryColor }}
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>Simpan ke Google Calendar</span>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 8: CAMEO ANTIQUE VICTORIAN
           ========================================== */}
        {heroLayoutType === 'cameo-antique' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg" style={{ borderColor: primaryColor, color: primaryColor }}>
              <Crown className="w-6 h-6" />
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <span className="text-xs uppercase font-cinzel tracking-[0.3em] text-neutral-300">An Imperial Victorian Celebration</span>
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100 tracking-wider">
                {data.groom.name}{' '}
                <span className="font-script text-5xl sm:text-7xl" style={{ color: secondaryColor }}>&amp;</span>{' '}
                {data.bride.name}
              </h1>
              <p className="text-xs sm:text-base font-cinzel tracking-[0.2em]" style={{ color: primaryColor }}>
                {formattedDate}
              </p>
            </motion.div>

            <ThemeDivider />

            {/* Antique Clockwork Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl">
              {countdownUnits.map((u, i) => (
                <div
                  key={i}
                  className="rounded-3xl border-2 p-3 sm:p-5 text-center shadow-xl relative backdrop-blur-md"
                  style={{ backgroundColor: `${activeTheme.cardBgHex}e6`, borderColor: `${primaryColor}70` }}
                >
                  <span className="block font-serif-luxury text-2xl sm:text-4xl font-bold" style={{ color: secondaryColor }}>
                    {String(u.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-cinzel uppercase tracking-widest text-neutral-300">{u.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="px-6 py-2.5 rounded-full border-2 text-xs font-cinzel font-bold uppercase tracking-widest transition-all cursor-pointer hover:scale-105"
                style={{ backgroundColor: primaryColor, borderColor: secondaryColor, color: activeTheme.bgHex }}
              >
                Simpan Tanggal Mulia
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 9: BOHO TERRACOTTA ARCH
           ========================================== */}
        {heroLayoutType === 'boho-arch' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <div className="w-24 h-12 rounded-t-full border-t-2 border-x-2 flex items-center justify-center opacity-60" style={{ borderColor: primaryColor }}>
              <span className="text-xs">☀</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100">
                {data.groom.name} <span className="font-script text-5xl sm:text-7xl" style={{ color: secondaryColor }}>&amp;</span> {data.bride.name}
              </h1>
              <p className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-neutral-300">
                {formattedDate} • {data.cityLocation || 'Boho Oasis'}
              </p>
            </motion.div>

            {/* Terracotta Niche Tiles */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg">
              {countdownUnits.map((u, i) => (
                <div
                  key={i}
                  className="rounded-t-full rounded-b-lg border-2 p-3 sm:p-5 text-center shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: `${activeTheme.cardBgHex}cc`, borderColor: `${primaryColor}60` }}
                >
                  <span className="block font-serif text-2xl sm:text-4xl font-bold" style={{ color: secondaryColor }}>
                    {String(u.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase font-sans font-medium text-neutral-300">{u.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="px-5 py-2.5 rounded-full border text-xs font-sans tracking-wide transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: activeTheme.bgHex }}
              >
                + Simpan ke Kalender
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VARIANT 10: FACETED PRISM / OBSIDIAN
           ========================================== */}
        {heroLayoutType === 'faceted-prism' && (
          <div className="w-full flex flex-col items-center space-y-6">
            <motion.div initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} className="w-12 h-12 border-2 rotate-45 flex items-center justify-center shadow-xl" style={{ borderColor: primaryColor }}>
              <Sparkles className="w-5 h-5 -rotate-45" style={{ color: secondaryColor }} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-neutral-100 tracking-tight">
                {data.groom.name} <span style={{ color: primaryColor }}>◆</span> {data.bride.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-300">
                {formattedDate} • {data.cityLocation || 'INDONESIA'}
              </p>
            </motion.div>

            {/* Diamond Cut Countdown Tiles */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl">
              {countdownUnits.map((u, i) => (
                <div
                  key={i}
                  className="border-2 p-3 sm:p-4 text-center shadow-2xl relative backdrop-blur-md"
                  style={{
                    backgroundColor: `${activeTheme.cardBgHex}f2`,
                    borderColor: `${primaryColor}70`,
                    clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)'
                  }}
                >
                  <span className="block font-mono text-2xl sm:text-4xl font-bold text-white">{String(u.value).padStart(2, '0')}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">{u.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToCalendar}
                className="px-6 py-2.5 border-2 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer"
                style={{
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)'
                }}
              >
                CATAT TANGGAL
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            DEFAULT / VARIANT 11: ROYAL SYMMETRICAL
           ========================================== */}
        {heroLayoutType === 'symmetrical' && (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Monogram / Cultural Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <ThemeCulturalBadge />
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs uppercase tracking-[0.25em] font-cinzel shadow-sm backdrop-blur-md"
                style={{
                  backgroundColor: `${activeTheme.cardBgHex}90`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data.invitationTitle || 'The Wedding Celebration'}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-2 sm:space-y-3"
            >
              <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-7xl font-bold text-neutral-50 tracking-wider">
                {data.groom.name}{' '}
                <span 
                  className="font-script text-4xl sm:text-6xl md:text-8xl mx-1 sm:mx-2"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  &amp;
                </span>{' '}
                {data.bride.name}
              </h1>
              <p 
                className="text-xs sm:text-base tracking-[0.15em] sm:tracking-[0.2em] font-cinzel font-medium uppercase"
                style={{ color: primaryColor }}
              >
                {formattedDate} {data.cityLocation ? `• ${data.cityLocation}` : ''}
              </p>
            </motion.div>

            {/* Dynamic Divider */}
            <ThemeDivider />

            {/* Live Countdown Timer Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-xl mx-auto pt-1 sm:pt-2"
            >
              <div 
                className="text-[10px] sm:text-xs uppercase tracking-widest mb-2.5 sm:mb-3 font-cinzel font-medium"
                style={{ color: `${primaryColor}cc` }}
              >
                Menghitung Hari Menuju Hari Bahagia
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {countdownUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className={`border ${activeTheme.cardRadius || 'rounded-2xl'} p-2 sm:p-4 text-center shadow-lg relative overflow-hidden group transition-all backdrop-blur-md`}
                    style={{
                      backgroundColor: `${activeTheme.cardBgHex}cc`,
                      borderColor: `${primaryColor}35`,
                      boxShadow: `0 8px 25px rgba(0,0,0,0.4)`
                    }}
                  >
                    <div 
                      className="absolute top-0 inset-x-0 h-0.5" 
                      style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
                    />
                    <span 
                      className="block font-cinzel text-xl sm:text-3xl md:text-4xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase tracking-wider text-neutral-300 font-medium">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add to Calendar Button */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCalendar}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 ${activeTheme.cardRadius || 'rounded-full'} border text-xs font-medium transition-all shadow-md cursor-pointer`}
                  style={{
                    backgroundColor: `${activeTheme.cardBgHex}e6`,
                    borderColor: `${primaryColor}50`,
                    color: secondaryColor
                  }}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  <span>Simpan ke Google Calendar</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Holy Ayat Quote Box (Universal across all hero variations) */}
        {data.holyQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`max-w-2xl mx-auto mt-4 sm:mt-6 p-4 sm:p-6 ${activeTheme.cardRadius || 'rounded-2xl'} border text-neutral-300 relative shadow-inner backdrop-blur-md`}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}b3`,
              borderColor: `${primaryColor}25`
            }}
          >
            <div 
              className="text-[10px] sm:text-xs uppercase tracking-widest font-cinzel font-semibold mb-1.5 sm:mb-2"
              style={{ color: primaryColor }}
            >
              {data.holyQuote.surah}
            </div>
            <p className="text-xs sm:text-sm font-serif-luxury italic leading-relaxed text-neutral-200">
              {data.holyQuote.text}
            </p>
          </motion.div>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        onClick={onScrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mt-8 flex flex-col items-center gap-1 text-xs cursor-pointer transition-colors"
        style={{ color: `${primaryColor}b3` }}
      >
        <span className="text-[10px] uppercase tracking-widest font-cinzel">Gulir ke Bawah</span>
        <ChevronDown className="w-4 h-4" style={{ color: primaryColor }} />
      </motion.button>
    </section>
  );
}
