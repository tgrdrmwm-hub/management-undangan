import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Navigation, Video, Shirt, Sparkles, ExternalLink, Ticket } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { useActiveTheme, useActiveLayout, ThemeCornerOrnament, ThemeDivider, ThemeCulturalBadge } from './ThemeDecorations';

export default function EventsSection() {
  const { data } = useWeddingData();
  const events = data.events || [];
  const mainVenue = events[0]?.venueName || 'Lokasi Pernikahan';
  const mainAddress = events[0]?.address || data.cityLocation || '';
  const mainMapsUrl = events[0]?.googleMapsUrl || 'https://maps.google.com';

  const activeTheme = useActiveTheme();
  const activeLayout = useActiveLayout();
  const primaryColor = activeTheme.primaryColor;
  const secondaryColor = activeTheme.secondaryColor;

  const eventsStyle = activeLayout.eventsStyle || 'dual-arch';

  return (
    <section id="section-events" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-6xl mx-auto relative z-10">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5 sm:space-y-3"
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
            <span>Save The Date</span>
          </motion.div>
        </div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Rangkaian Acara
        </h2>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>

        <ThemeDivider />
      </motion.div>

      {/* =========================================================================
          VARIANT 1: TIMELINE VERTICAL LAYOUT
         ========================================================================= */}
      {eventsStyle === 'timeline-vertical' && (
        <div className="max-w-3xl mx-auto relative mb-12 sm:mb-16">
          {/* Vertical Connecting Line */}
          <div 
            className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2"
            style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor}, ${primaryColor})` }}
          />

          <div className="space-y-8 sm:space-y-12">
            {events.map((event, idx) => (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className={`relative flex flex-col sm:flex-row items-center gap-6 ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse text-left sm:text-right' : 'text-left'
                }`}
              >
                {/* Center Node / Number Badge */}
                <div 
                  className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs z-10 shadow-lg"
                  style={{ backgroundColor: activeTheme.cardBgHex, borderColor: primaryColor, color: primaryColor }}
                >
                  {idx + 1}
                </div>

                {/* Event Card Content */}
                <div className="w-full sm:w-[45%] ml-10 sm:ml-0">
                  <div 
                    className="p-5 sm:p-7 rounded-2xl border backdrop-blur-md shadow-xl relative"
                    style={{ backgroundColor: `${activeTheme.cardBgHex}eb`, borderColor: `${primaryColor}40` }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded border mb-2 inline-block" style={{ borderColor: `${primaryColor}40`, color: secondaryColor }}>
                      {event.title}
                    </span>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mb-3">{event.title}</h3>
                    <div className="space-y-2 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        <span>{event.dateString}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        <span>{event.timeRange}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 mt-0.5" style={{ color: primaryColor }} />
                        <span>{event.venueName} — {event.address}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex flex-wrap gap-2" style={{ borderColor: `${primaryColor}20` }}>
                      {event.googleMapsUrl && (
                        <a
                          href={event.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium border transition-all"
                          style={{ borderColor: `${primaryColor}50`, color: primaryColor, backgroundColor: `${activeTheme.bgHex}90` }}
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Peta Lokasi</span>
                        </a>
                      )}
                      {event.virtualStreamUrl && (
                        <a
                          href={event.virtualStreamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium border"
                          style={{ borderColor: `${primaryColor}50`, color: secondaryColor }}
                        >
                          <Video className="w-3 h-3" />
                          <span>Live Stream</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VARIANT 2: VIP BOARDING PASS / TICKET STUB
         ========================================================================= */}
      {eventsStyle === 'boarding-pass' && (
        <div className="space-y-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          {events.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="border-2 rounded-2xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-12 backdrop-blur-md"
              style={{ backgroundColor: `${activeTheme.cardBgHex}f0`, borderColor: `${primaryColor}50` }}
            >
              {/* Left Ticket Stub */}
              <div className="md:col-span-8 p-6 sm:p-8 space-y-4 border-b md:border-b-0 md:border-r border-dashed" style={{ borderColor: `${primaryColor}50` }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: primaryColor }}>BOARDING PASS // WEDDING EVENT</span>
                  <Ticket className="w-4 h-4" style={{ color: secondaryColor }} />
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">{event.title}</h3>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="block text-neutral-400 text-[10px]">DATE / TANGGAL</span>
                    <span className="font-bold text-white">{event.dateString}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-400 text-[10px]">TIME / WAKTU</span>
                    <span className="font-bold text-white">{event.timeRange}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-neutral-400 text-[10px]">VENUE / LOKASI</span>
                    <span className="font-medium text-white">{event.venueName} • {event.address}</span>
                  </div>
                </div>

                {event.dresscode && (
                  <div className="text-xs text-neutral-300 flex items-center gap-2 pt-2">
                    <Shirt className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <span>Dresscode: {event.dresscode}</span>
                  </div>
                )}
              </div>

              {/* Right Ticket Barcode Stub */}
              <div className="md:col-span-4 p-6 flex flex-col justify-between items-center text-center bg-black/20">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">ACCESS GATE</span>
                  <div className="font-mono text-xl font-bold" style={{ color: secondaryColor }}>GATE 0{idx + 1}</div>
                </div>

                <div className="my-3 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                  ||| | ||||| || |||| ||| ||||
                </div>

                <div className="w-full space-y-2">
                  {event.googleMapsUrl && (
                    <a
                      href={event.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded text-xs font-mono uppercase font-bold transition-all shadow-md"
                      style={{ backgroundColor: primaryColor, color: activeTheme.bgHex }}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Buka Maps</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* =========================================================================
          VARIANT 3: SONGKET TAPESTRY SCROLL
         ========================================================================= */}
      {eventsStyle === 'songket-scroll' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 max-w-5xl mx-auto">
          {events.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.18 }}
              className="border-2 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-md"
              style={{
                backgroundColor: `${activeTheme.cardBgHex}f5`,
                borderColor: `${primaryColor}70`,
              }}
            >
              {/* Songket Decorative Header Bar */}
              <div className="absolute top-0 inset-x-0 h-2" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${primaryColor})` }} />
              <ThemeCornerOrnament />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full border text-[11px] font-cinzel font-semibold uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: `${activeTheme.bgHex}`, borderColor: `${primaryColor}50`, color: secondaryColor }}
                  >
                    {event.title}
                  </span>
                  <span className="text-xs font-mono opacity-50">❖ ❖ ❖</span>
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-100">{event.title}</h3>

                <div className="space-y-3 text-xs sm:text-sm text-neutral-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>{event.dateString}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                    <span>{event.timeRange}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5" style={{ color: primaryColor }} />
                    <span>{event.venueName} — {event.address}</span>
                  </div>
                </div>

                {event.dresscode && (
                  <div className="p-3 rounded-lg border text-xs text-neutral-300" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${activeTheme.bgHex}70` }}>
                    <strong>Tata Busana:</strong> {event.dresscode}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${primaryColor}30` }}>
                {event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-cinzel font-semibold transition-all shadow-md hover:scale-105"
                    style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: activeTheme.bgHex }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Petunjuk Arah</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* =========================================================================
          VARIANT 4: SWISS ARCHITECTURAL GRID & GLASS DASHBOARD & DUAL ARCH DEFAULT
         ========================================================================= */}
      {(eventsStyle === 'dual-arch' || eventsStyle === 'swiss-grid' || eventsStyle === 'glass-dashboard') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {events.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, delay: idx * 0.18 }}
              whileHover={{ y: -6 }}
              className={`border ${eventsStyle === 'swiss-grid' ? 'rounded-none border-l-4' : activeTheme.cardRadius || 'rounded-3xl'} p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl transition-all group backdrop-blur-md`}
              style={{
                backgroundColor: `${activeTheme.cardBgHex}e6`,
                borderColor: `${primaryColor}35`,
              }}
            >
              {/* Corner ornament */}
              <ThemeCornerOrnament />

              {/* Header Badge */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span 
                    className={`px-3 py-1 ${activeTheme.cardRadius || 'rounded-full'} border text-[11px] sm:text-xs font-cinzel font-semibold uppercase tracking-wider shadow-sm`}
                    style={{
                      backgroundColor: `${activeTheme.bgHex}cc`,
                      borderColor: `${primaryColor}40`,
                      color: primaryColor,
                    }}
                  >
                    {event.title}
                  </span>
                  {event.subtitle && (
                    <span className="text-[10px] sm:text-[11px] text-neutral-400 font-cinzel">
                      {event.subtitle}
                    </span>
                  )}
                </div>

                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-100 mb-4 sm:mb-6">
                  {event.title}
                </h3>

                {/* Date & Time details */}
                <div className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3 sm:gap-3.5 text-xs sm:text-sm text-neutral-200">
                    <div 
                      className={`p-2 sm:p-2.5 ${activeTheme.cardRadius || 'rounded-xl'} border shrink-0`}
                      style={{
                        backgroundColor: `${activeTheme.bgHex}90`,
                        borderColor: `${primaryColor}30`,
                        color: primaryColor,
                      }}
                    >
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="font-cinzel font-semibold text-neutral-100 text-xs sm:text-sm">
                        {event.dateString}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-3.5 text-xs sm:text-sm text-neutral-200">
                    <div 
                      className={`p-2 sm:p-2.5 ${activeTheme.cardRadius || 'rounded-xl'} border shrink-0`}
                      style={{
                        backgroundColor: `${activeTheme.bgHex}90`,
                        borderColor: `${primaryColor}30`,
                        color: primaryColor,
                      }}
                    >
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="font-cinzel font-semibold text-neutral-100 text-xs sm:text-sm">
                        {event.timeRange}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-400">
                        Waktu Indonesia Barat (WIB)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-3.5 text-xs sm:text-sm text-neutral-200">
                    <div 
                      className={`p-2 sm:p-2.5 ${activeTheme.cardRadius || 'rounded-xl'} border shrink-0`}
                      style={{
                        backgroundColor: `${activeTheme.bgHex}90`,
                        borderColor: `${primaryColor}30`,
                        color: primaryColor,
                      }}
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-100 text-xs sm:text-sm">
                        {event.venueName}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                        {event.address}
                      </div>
                    </div>
                  </div>

                  {event.dresscode && (
                    <div className="flex items-start gap-3 sm:gap-3.5 text-xs sm:text-sm text-neutral-200 pt-1">
                      <div 
                        className={`p-2 sm:p-2.5 ${activeTheme.cardRadius || 'rounded-xl'} border shrink-0`}
                        style={{
                          backgroundColor: `${activeTheme.bgHex}90`,
                          borderColor: `${primaryColor}30`,
                          color: primaryColor,
                        }}
                      >
                        <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <div className="font-cinzel font-semibold text-neutral-100 text-xs sm:text-sm">
                          Dress Code
                        </div>
                        <div className="text-[11px] sm:text-xs text-neutral-300">
                          {event.dresscode}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex flex-wrap items-center gap-2 sm:gap-3" style={{ borderColor: `${primaryColor}20` }}>
                {event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 ${activeTheme.cardRadius || 'rounded-xl'} text-xs font-semibold shadow-md transition-all duration-300 cursor-pointer`}
                    style={{
                      backgroundColor: primaryColor,
                      color: activeTheme.bgHex,
                    }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Petunjuk Lokasi</span>
                  </a>
                )}

                {event.virtualStreamUrl && (
                  <a
                    href={event.virtualStreamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 ${activeTheme.cardRadius || 'rounded-xl'} border text-xs font-semibold transition-all duration-300 cursor-pointer`}
                    style={{
                      borderColor: `${primaryColor}50`,
                      color: secondaryColor,
                      backgroundColor: `${activeTheme.bgHex}80`,
                    }}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Live Streaming</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Embedded Google Maps / Venue Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className={`border ${activeTheme.cardRadius || 'rounded-3xl'} p-5 sm:p-8 overflow-hidden shadow-2xl relative backdrop-blur-md`}
        style={{
          backgroundColor: `${activeTheme.cardBgHex}e6`,
          borderColor: `${primaryColor}35`,
        }}
      >
        <ThemeCornerOrnament />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div 
              className="text-[10px] sm:text-xs uppercase tracking-widest font-cinzel font-semibold mb-1"
              style={{ color: primaryColor }}
            >
              Lokasi Acara
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
              {mainVenue}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              {mainAddress}
            </p>
          </div>

          <a
            href={mainMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 ${activeTheme.cardRadius || 'rounded-full'} border text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 shrink-0 cursor-pointer`}
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: activeTheme.bgHex,
            }}
          >
            <Navigation className="w-4 h-4" />
            <span>Buka Google Maps</span>
          </a>
        </div>

        {/* Map Frame / Placeholder */}
        <div 
          className={`w-full h-56 sm:h-72 ${activeTheme.cardRadius || 'rounded-2xl'} overflow-hidden border relative`}
          style={{ borderColor: `${primaryColor}30` }}
        >
          <iframe
            title="Lokasi Pernikahan"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mainAddress || mainVenue)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 filter contrast-105 opacity-90"
            loading="lazy"
          />
        </div>
      </motion.div>
    </section>
  );
}
