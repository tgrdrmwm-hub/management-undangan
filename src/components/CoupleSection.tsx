import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Sparkles, Heart } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { useActiveTheme, useActiveLayout, ThemeCornerOrnament, ThemeDivider, ThemeCulturalBadge } from './ThemeDecorations';

export default function CoupleSection() {
  const { data } = useWeddingData();
  const { groom, bride } = data;

  const activeTheme = useActiveTheme();
  const activeLayout = useActiveLayout();
  const primaryColor = activeTheme.primaryColor;
  const secondaryColor = activeTheme.secondaryColor;

  const coupleStyle = activeLayout.coupleCardStyle || 'classic-circle';

  return (
    <section id="section-couple" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
      {/* Section Header with Smooth Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3"
      >
        <div className="flex justify-center items-center gap-2">
          <ThemeCulturalBadge />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs uppercase tracking-[0.2em] font-cinzel shadow-sm"
            style={{
              backgroundColor: `${activeTheme.cardBgHex}cc`,
              borderColor: `${primaryColor}40`,
              color: primaryColor,
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
            <span>Mempelai Pengantin</span>
          </motion.div>
        </div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Pasangan Mempelai
        </h2>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami tercinta:
        </p>

        <ThemeDivider />
      </motion.div>

      {/* Couple Cards Layout Engine */}
      <div className="relative">
        {/* Center Heart Connector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border-2 items-center justify-center shadow-lg"
          style={{
            backgroundColor: activeTheme.cardBgHex,
            borderColor: primaryColor,
            color: primaryColor,
            boxShadow: `0 0 20px ${activeTheme.glowHex || 'rgba(0,0,0,0.3)'}`,
          }}
        >
          <Heart className="w-5 h-5 fill-current opacity-70" />
        </motion.div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-stretch">
          
          {/* ============================================================
              1. GROOM CARD RENDERING (Adapts to coupleStyle)
             ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.95 }}
            whileHover={{ y: -6 }}
            className={`border p-6 sm:p-8 text-center flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-300 shadow-xl backdrop-blur-md ${
              coupleStyle === 'scandi-card' ? 'rounded-none border-l-4' : activeTheme.cardRadius || 'rounded-3xl'
            }`}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}e6`,
              borderColor: `${primaryColor}40`,
            }}
          >
            <ThemeCornerOrnament />

            {/* Groom Photo Frame Variants */}
            <div className="relative mb-5 sm:mb-6">
              {/* Arch Portal Style */}
              {coupleStyle === 'arch-portal' && (
                <div 
                  className="w-40 h-52 sm:w-48 sm:h-64 rounded-t-full rounded-b-xl p-2 border-2 relative overflow-hidden"
                  style={{ borderColor: `${primaryColor}80`, boxShadow: `0 0 30px ${primaryColor}25` }}
                >
                  <img src={groom.photoUrl} alt={groom.fullName} className="w-full h-full object-cover rounded-t-full rounded-b-lg group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Diamond Facet Style */}
              {coupleStyle === 'diamond-facet' && (
                <div 
                  className="w-40 h-40 sm:w-48 sm:h-48 p-2 border-2 relative overflow-hidden rotate-45 my-4"
                  style={{ borderColor: `${primaryColor}90`, backgroundColor: `${activeTheme.cardBgHex}` }}
                >
                  <img src={groom.photoUrl} alt={groom.fullName} className="w-full h-full object-cover -rotate-45 scale-140 group-hover:scale-150 transition-transform duration-700" />
                </div>
              )}

              {/* Cameo Oval Style */}
              {coupleStyle === 'cameo-oval' && (
                <div 
                  className="w-40 h-52 sm:w-48 sm:h-60 rounded-[50%] p-2 border-4 relative overflow-hidden"
                  style={{ borderColor: secondaryColor, boxShadow: `0 0 25px ${primaryColor}30` }}
                >
                  <img src={groom.photoUrl} alt={groom.fullName} className="w-full h-full object-cover rounded-[50%] group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Magazine Editorial Style */}
              {coupleStyle === 'magazine-editorial' && (
                <div 
                  className="w-44 h-56 sm:w-52 sm:h-64 rounded-xl p-1 border shadow-2xl relative overflow-hidden"
                  style={{ borderColor: `${primaryColor}60` }}
                >
                  <img src={groom.photoUrl} alt={groom.fullName} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-[9px] font-mono text-white rounded">GROOM</div>
                </div>
              )}

              {/* Polaroid Style */}
              {coupleStyle === 'polaroid' && (
                <div className="bg-white p-3 pb-8 rounded shadow-2xl rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-36 h-44 sm:w-44 sm:h-52 overflow-hidden bg-neutral-900">
                    <img src={groom.photoUrl} alt={groom.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="block text-neutral-800 font-script text-lg text-center mt-2">{groom.name}</span>
                </div>
              )}

              {/* Glass Capsule & Classic Circle Default */}
              {(coupleStyle === 'classic-circle' || coupleStyle === 'glass-capsule' || coupleStyle === 'scandi-card') && (
                <div 
                  className={`w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 ${coupleStyle === 'scandi-card' ? 'rounded-xl' : 'rounded-full'} p-1.5 sm:p-2 border-2 relative overflow-hidden`}
                  style={{
                    borderColor: `${primaryColor}60`,
                    boxShadow: `0 0 25px ${primaryColor}30`,
                  }}
                >
                  <img
                    src={groom.photoUrl}
                    alt={groom.fullName}
                    className={`w-full h-full object-cover ${coupleStyle === 'scandi-card' ? 'rounded-lg' : 'rounded-full'} group-hover:scale-105 transition-transform duration-700 ease-out`}
                    loading="lazy"
                  />
                </div>
              )}

              {/* Groom Monogram Tag */}
              <div 
                className="absolute -bottom-2 right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center shadow-md text-xs font-serif-luxury font-bold"
                style={{
                  backgroundColor: activeTheme.cardBgHex,
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
              >
                G
              </div>
            </div>

            {/* Groom Details */}
            <div className="space-y-3 w-full">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-100">
                {groom.fullName}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {groom.parentInfo || 'Putra dari Keluarga Tercinta'}
              </p>

              {groom.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: `${primaryColor}40`,
                      color: primaryColor,
                      backgroundColor: `${activeTheme.bgHex}80`,
                    }}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{groom.instagram.replace('@', '')}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* ============================================================
              2. BRIDE CARD RENDERING (Adapts to coupleStyle)
             ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.95, delay: 0.15 }}
            whileHover={{ y: -6 }}
            className={`border p-6 sm:p-8 text-center flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-300 shadow-xl backdrop-blur-md ${
              coupleStyle === 'scandi-card' ? 'rounded-none border-l-4' : activeTheme.cardRadius || 'rounded-3xl'
            }`}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}e6`,
              borderColor: `${primaryColor}40`,
            }}
          >
            <ThemeCornerOrnament />

            {/* Bride Photo Frame Variants */}
            <div className="relative mb-5 sm:mb-6">
              {/* Arch Portal Style */}
              {coupleStyle === 'arch-portal' && (
                <div 
                  className="w-40 h-52 sm:w-48 sm:h-64 rounded-t-full rounded-b-xl p-2 border-2 relative overflow-hidden"
                  style={{ borderColor: `${primaryColor}80`, boxShadow: `0 0 30px ${primaryColor}25` }}
                >
                  <img src={bride.photoUrl} alt={bride.fullName} className="w-full h-full object-cover rounded-t-full rounded-b-lg group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Diamond Facet Style */}
              {coupleStyle === 'diamond-facet' && (
                <div 
                  className="w-40 h-40 sm:w-48 sm:h-48 p-2 border-2 relative overflow-hidden rotate-45 my-4"
                  style={{ borderColor: `${primaryColor}90`, backgroundColor: `${activeTheme.cardBgHex}` }}
                >
                  <img src={bride.photoUrl} alt={bride.fullName} className="w-full h-full object-cover -rotate-45 scale-140 group-hover:scale-150 transition-transform duration-700" />
                </div>
              )}

              {/* Cameo Oval Style */}
              {coupleStyle === 'cameo-oval' && (
                <div 
                  className="w-40 h-52 sm:w-48 sm:h-60 rounded-[50%] p-2 border-4 relative overflow-hidden"
                  style={{ borderColor: secondaryColor, boxShadow: `0 0 25px ${primaryColor}30` }}
                >
                  <img src={bride.photoUrl} alt={bride.fullName} className="w-full h-full object-cover rounded-[50%] group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Magazine Editorial Style */}
              {coupleStyle === 'magazine-editorial' && (
                <div 
                  className="w-44 h-56 sm:w-52 sm:h-64 rounded-xl p-1 border shadow-2xl relative overflow-hidden"
                  style={{ borderColor: `${primaryColor}60` }}
                >
                  <img src={bride.photoUrl} alt={bride.fullName} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-[9px] font-mono text-white rounded">BRIDE</div>
                </div>
              )}

              {/* Polaroid Style */}
              {coupleStyle === 'polaroid' && (
                <div className="bg-white p-3 pb-8 rounded shadow-2xl rotate-[2deg] group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-36 h-44 sm:w-44 sm:h-52 overflow-hidden bg-neutral-900">
                    <img src={bride.photoUrl} alt={bride.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <span className="block text-neutral-800 font-script text-lg text-center mt-2">{bride.name}</span>
                </div>
              )}

              {/* Glass Capsule & Classic Circle Default */}
              {(coupleStyle === 'classic-circle' || coupleStyle === 'glass-capsule' || coupleStyle === 'scandi-card') && (
                <div 
                  className={`w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 ${coupleStyle === 'scandi-card' ? 'rounded-xl' : 'rounded-full'} p-1.5 sm:p-2 border-2 relative overflow-hidden`}
                  style={{
                    borderColor: `${primaryColor}60`,
                    boxShadow: `0 0 25px ${primaryColor}30`,
                  }}
                >
                  <img
                    src={bride.photoUrl}
                    alt={bride.fullName}
                    className={`w-full h-full object-cover ${coupleStyle === 'scandi-card' ? 'rounded-lg' : 'rounded-full'} group-hover:scale-105 transition-transform duration-700 ease-out`}
                    loading="lazy"
                  />
                </div>
              )}

              {/* Bride Monogram Tag */}
              <div 
                className="absolute -bottom-2 right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center shadow-md text-xs font-serif-luxury font-bold"
                style={{
                  backgroundColor: activeTheme.cardBgHex,
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
              >
                B
              </div>
            </div>

            {/* Bride Details */}
            <div className="space-y-3 w-full">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-100">
                {bride.fullName}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {bride.parentInfo || 'Putri dari Keluarga Tercinta'}
              </p>

              {bride.instagram && (
                <div className="pt-2">
                  <a
                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: `${primaryColor}40`,
                      color: primaryColor,
                      backgroundColor: `${activeTheme.bgHex}80`,
                    }}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{bride.instagram.replace('@', '')}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
