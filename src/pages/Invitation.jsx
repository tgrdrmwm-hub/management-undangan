import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, Heart, ChevronDown, Play, Pause } from 'lucide-react';
import { getTheme } from '../themes';

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const observe = useCallback((node) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.12 }
    );
    const els = node.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return observe;
}

/* ─── Countdown Hook ─── */
function useCountdown(targetDate) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const d = new Date(targetDate).getTime() - Date.now();
      if (d <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setT({
        days: Math.floor(d / 864e5),
        hours: Math.floor((d % 864e5) / 36e5),
        minutes: Math.floor((d % 36e5) / 6e4),
        seconds: Math.floor((d % 6e4) / 1e3),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

/* ─── Ornament SVG ─── */
const FlowerOrnament = ({ className = '', flip = false }) => (
  <svg className={`${className} ${flip ? 'scale-x-[-1]' : ''}`} width="120" height="120" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="8" fill="#700F06" opacity="0.2"/>
    <ellipse cx="60" cy="40" rx="12" ry="20" fill="#700F06" opacity="0.15" transform="rotate(0 60 40)"/>
    <ellipse cx="60" cy="40" rx="12" ry="20" fill="#700F06" opacity="0.15" transform="rotate(72 60 60)"/>
    <ellipse cx="60" cy="40" rx="12" ry="20" fill="#700F06" opacity="0.15" transform="rotate(144 60 60)"/>
    <ellipse cx="60" cy="40" rx="12" ry="20" fill="#700F06" opacity="0.15" transform="rotate(216 60 60)"/>
    <ellipse cx="60" cy="40" rx="12" ry="20" fill="#700F06" opacity="0.15" transform="rotate(288 60 60)"/>
    <path d="M40 90 Q60 60 80 90" stroke="#700F06" strokeWidth="1" fill="none" opacity="0.2"/>
    <path d="M30 95 Q60 70 90 95" stroke="#700F06" strokeWidth="1" fill="none" opacity="0.15"/>
  </svg>
);

/* ─── Decorative Border Frame ─── */
const BorderFrame = ({ color = '#700F06' }) => (
  <>
    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 z-10 pointer-events-none"
      style={{ borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderTopLeftRadius: '12px' }} />
    <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-12 h-12 sm:w-20 sm:h-20 z-10 pointer-events-none"
      style={{ borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderTopRightRadius: '12px' }} />
    <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 z-10 pointer-events-none"
      style={{ borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, borderBottomLeftRadius: '12px' }} />
    <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-12 h-12 sm:w-20 sm:h-20 z-10 pointer-events-none"
      style={{ borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottomRightRadius: '12px' }} />
  </>
);

/* ─── Javanese Divider ─── */
const JavaneseDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(90deg, transparent, #700F06, transparent)' }} />
    <div className="w-2 h-2 rounded-full bg-[#700F06] opacity-60" />
    <div className="h-px w-16 sm:w-24" style={{ background: 'linear-gradient(90deg, transparent, #700F06, transparent)' }} />
  </div>
);

/* ═══════════════════════════════
   JAVANESE INVITATION COMPONENT
   ═══════════════════════════════ */
const Invitation = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';

  const [invitation, setInvitation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useScrollReveal();

  useEffect(() => {
    const saved = localStorage.getItem('invitations');
    if (saved) {
      const invitations = JSON.parse(saved);
      const found = invitations.find((inv) => inv.slug === slug);
      if (found) setInvitation(found);
    }
  }, [slug]);

  const t = getTheme(invitation?.theme);
  const countdown = useCountdown(invitation?.date);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(true);
      if (audioRef.current) { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
    }, 1000);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  /* Not Found */
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(at center, #FFF0E5, #E8D5C4)' }}>
        <div className="text-center animate-fade-in-up px-4">
          <Heart size={48} className="mx-auto mb-4 animate-heartbeat" style={{ color: '#700F06' }} />
          <h2 className="text-xl sm:text-2xl text-[#700F06]" style={{ fontFamily: 'Playfair Display, serif' }}>Undangan tidak ditemukan</h2>
          <p className="text-[#3C4034] text-sm mt-2">Pastikan link yang Anda buka sudah benar.</p>
        </div>
      </div>
    );
  }

  const isJavanese = invitation.theme === 'royalJavanese';
  
  /* If not javanese theme, render with the generic themed renderer */
  if (!isJavanese) {
    return <GenericThemedInvitation invitation={invitation} guestName={guestName} t={t} countdown={countdown}
      isOpen={isOpen} isClosing={isClosing} isPlaying={isPlaying} audioRef={audioRef} containerRef={containerRef}
      handleOpen={handleOpen} toggleMusic={toggleMusic} />;
  }

  const eventDate = new Date(invitation.date);
  const formattedDate = eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const ruby = '#700F06';
  const cream = '#FFF0E5';
  const olive = '#3C4034';
  const goldBorder = '#CEB172';

  /* ════════════════════════════════
     COVER SCREEN - JAVANESE (REDESIGNED)
     ════════════════════════════════ */
  if (!isOpen) {
    return (
      <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center ${isClosing ? 'animate-envelope-open' : ''}`}
        style={{ backgroundColor: '#e9e3d5' }}>
        
        {/* Background Landscape Photo (Placeholder) */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1596404558778-5743b59df04a?auto=format&fit=crop&w=1200&q=80"
            alt="Landscape" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#e9e3d5] via-transparent to-transparent opacity-80" />
        </div>

        {/* Framing Trees */}
        <div className="absolute inset-0 z-10 pointer-events-none flex justify-between">
          <img src="/tree_frame.png" alt="Tree Left" className="h-[120%] -ml-16 sm:-ml-32 object-cover object-left opacity-90 trj-flower-sway mix-blend-multiply" />
          <img src="/tree_frame.png" alt="Tree Right" className="h-[120%] -mr-16 sm:-mr-32 object-cover object-left scale-x-[-1] opacity-90 trj-flower-sway trj-flower-sway--alt mix-blend-multiply" />
        </div>

        {/* Flying Swallow Bird */}
        <div className="absolute top-10 right-1/4 z-20 pointer-events-none animate-bird-fly mix-blend-multiply opacity-80">
          <img src="/bird_swallow.png" alt="Swallow" className="w-24 sm:w-32" />
        </div>

        {/* Text Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 max-w-md w-full -mt-20">
          {/* Label */}
          <p className="text-xs uppercase tracking-[0.2em] mb-4 animate-fade-in-down" style={{ color: '#505a4e', fontFamily: 'Inter, sans-serif' }}>
            UNDANGAN PERNIKAHAN
          </p>

          {/* Names */}
          <div className="flex items-center justify-center gap-3 animate-fade-in-up">
            <h1 className="text-5xl sm:text-7xl" style={{ color: '#413c32', fontFamily: 'Playfair Display, serif' }}>
              {invitation.groomName}
            </h1>
            <span className="text-4xl sm:text-6xl" style={{ color: '#413c32', fontFamily: 'Playfair Display, serif' }}>&</span>
            <h1 className="text-5xl sm:text-7xl" style={{ color: '#413c32', fontFamily: 'Playfair Display, serif' }}>
              {invitation.brideName}
            </h1>
          </div>

          {/* Date */}
          <p className="text-sm mt-4 animate-fade-in-up stagger-2" style={{ color: '#505a4e', fontFamily: 'Inter, sans-serif' }}>
            {formattedDate}
          </p>

          {/* Guest card */}
          <div className="mt-12 sm:mt-16 animate-fade-in-up stagger-3">
            <p className="text-sm mb-1" style={{ color: '#505a4e' }}>Kepada Yth.</p>
            <p className="text-sm mb-4" style={{ color: '#505a4e' }}>Bapak/Ibu/Saudara/i:</p>
            <p className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: '#413c32', fontFamily: 'Playfair Display, serif' }}>{guestName}</p>
            
            <button onClick={handleOpen}
              className="px-8 py-3 rounded-full font-semibold text-white uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-md"
              style={{ backgroundColor: '#574c40', fontFamily: 'Inter, sans-serif' }}>
              BUKA UNDANGAN
            </button>
          </div>
        </div>

        {/* Joglo Roof Ornament at Bottom */}
        <div className="absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none mix-blend-multiply opacity-90">
          <img src="/joglo_roof.png" alt="Joglo Roof" className="w-[300px] sm:w-[450px]" />
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     MAIN INVITATION - JAVANESE
     ════════════════════════════════ */
  return (
    <div ref={containerRef} className="min-h-screen font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* Music toggle */}
      <button onClick={toggleMusic} aria-label="Toggle music"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all"
        style={{ backgroundColor: ruby }}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden"
        style={{ background: `radial-gradient(at center, ${cream}, #E8D5C4)` }}>
        <div className="absolute inset-0 z-0">
          <img src={invitation.photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80'}
            alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(255,240,229,0.5), rgba(255,240,229,0.9))` }} />
        </div>
        <div className="relative z-10 px-4 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>Pernikahan Kami</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl uppercase mb-1 scroll-reveal-left" style={{ color: ruby, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
            {invitation.groomName}
          </h1>
          <p className="text-4xl my-2 animate-pulse-glow" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>&</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl uppercase scroll-reveal-right" style={{ color: ruby, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
            {invitation.brideName}
          </h1>
          <p className="text-sm mt-5 tracking-widest uppercase" style={{ color: olive, fontFamily: 'Playfair Display, serif' }}>{formattedDate}</p>
        </div>
        <div className="absolute bottom-8 left-1/2 animate-bounce-down z-10">
          <ChevronDown size={28} style={{ color: ruby }} className="opacity-40" />
        </div>
      </section>

      {/* ── QUOTES ── */}
      {invitation.story && (
        <section className="py-16 sm:py-20 px-4 relative overflow-hidden" style={{ background: `radial-gradient(at center right, ${cream}, #E8D5C4)` }}>
          {/* Decorative flowers */}
          <div className="absolute -left-10 top-1/3 opacity-20 pointer-events-none trj-flower-sway"><FlowerOrnament /></div>
          <div className="absolute -right-10 -top-2 opacity-20 pointer-events-none trj-flower-sway trj-flower-sway--alt"><FlowerOrnament flip /></div>
          
          <div className="max-w-lg mx-auto text-center relative z-10">
            <div className="scroll-reveal-scale">
              <svg className="w-8 h-8 mx-auto mb-4 opacity-40" fill={ruby} viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="scroll-reveal text-base sm:text-lg md:text-xl italic leading-relaxed" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>
              "{invitation.story}"
            </p>
            <JavaneseDivider />
          </div>
        </section>
      )}

      {/* ── MEMPELAI (COUPLE) ── */}
      <section className="py-16 sm:py-20 px-4 relative" style={{ background: `radial-gradient(at center, ${cream}, #E8D5C4)` }}>
        <div className="max-w-md mx-auto">
          <div className="scroll-reveal rounded-[3rem] p-6 sm:p-8 md:p-10 text-center relative overflow-visible"
            style={{ backgroundColor: 'rgba(255,240,229,0.82)', border: `4px solid ${ruby}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            
            <h2 className="scroll-reveal text-2xl sm:text-3xl mb-4" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>
              Mempelai
            </h2>

            {/* Groom */}
            <div className="mb-6 scroll-reveal-left">
              {invitation.photoUrl && (
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4">
                  <img src={invitation.photoUrl} alt="Mempelai Pria"
                    className="w-full h-full object-cover rounded-full" style={{ border: `4px solid ${ruby}` }} />
                </div>
              )}
              <h3 className="text-3xl sm:text-4xl font-handwriting" style={{ color: ruby }}>{invitation.groomName}</h3>
              <p className="text-xs sm:text-sm mt-1" style={{ color: olive }}>Mempelai Pria</p>
            </div>

            {/* Ampersand */}
            <p className="text-5xl sm:text-6xl my-4 scroll-reveal animate-pulse-glow" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>&</p>

            {/* Bride */}
            <div className="mt-6 scroll-reveal-right">
              {invitation.photoUrl && (
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4">
                  <img src={invitation.photoUrl} alt="Mempelai Wanita"
                    className="w-full h-full object-cover rounded-full" style={{ border: `4px solid ${ruby}` }} />
                </div>
              )}
              <h3 className="text-3xl sm:text-4xl font-handwriting" style={{ color: ruby }}>{invitation.brideName}</h3>
              <p className="text-xs sm:text-sm mt-1" style={{ color: olive }}>Mempelai Wanita</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="relative py-16 sm:py-20 px-4 overflow-hidden" style={{ backgroundColor: '#585C4C' }}>
        <div className="absolute inset-0 z-0">
          {invitation.photoUrl && <img src={invitation.photoUrl} alt="" className="w-full h-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="max-w-lg mx-auto text-center relative z-10">
          <h2 className="scroll-reveal text-2xl sm:text-3xl text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            Menghitung Hari
          </h2>
          <div className="flex justify-center gap-3 sm:gap-6">
            {[
              { val: countdown.days, label: 'Hari' },
              { val: countdown.hours, label: 'Jam' },
              { val: countdown.minutes, label: 'Menit' },
              { val: countdown.seconds, label: 'Detik' },
            ].map((item, i) => (
              <div key={i} className="scroll-reveal-scale text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center mb-2 animate-pulse-glow"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {String(item.val).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE / EVENT ── */}
      <section className="py-16 sm:py-20 px-4 relative" style={{ background: `radial-gradient(at center right, ${cream}, #E8D5C4)` }}>
        <div className="max-w-md mx-auto">
          <div className="scroll-reveal rounded-[3rem] p-6 sm:p-8 text-center relative"
            style={{ backgroundColor: 'rgba(255,240,229,0.82)', border: `4px solid ${ruby}`, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

            <h2 className="text-2xl sm:text-3xl uppercase mb-6" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>
              Akad Nikah & Resepsi
            </h2>

            {/* Date block */}
            <div className="scroll-reveal-left mb-6">
              <div className="inline-flex flex-col items-center px-6 py-4 rounded-2xl" style={{ backgroundColor: 'rgba(112,15,6,0.08)' }}>
                <Calendar size={24} style={{ color: ruby }} className="mb-2" />
                <p className="text-sm sm:text-base font-semibold" style={{ color: ruby }}>{formattedDate}</p>
              </div>
            </div>

            {/* Time */}
            <div className="scroll-reveal-right flex items-center justify-center gap-2 mb-4" style={{ color: ruby }}>
              <Clock size={18} />
              <p className="text-sm sm:text-base font-medium">{invitation.time} WIB – Selesai</p>
            </div>

            {/* Divider with icon */}
            <div className="flex items-center justify-center gap-3 my-6 animate-pulse-glow">
              <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: goldBorder }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(112,15,6,0.1)' }}>
                <MapPin size={16} style={{ color: ruby }} />
              </div>
              <span className="flex-1 max-w-[60px] h-px" style={{ backgroundColor: goldBorder }} />
            </div>

            {/* Location */}
            <p className="scroll-reveal text-sm sm:text-base mb-6" style={{ color: olive }}>{invitation.location}</p>

            {invitation.mapsLink && (
              <a href={invitation.mapsLink} target="_blank" rel="noopener noreferrer"
                className="scroll-reveal inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90"
                style={{ backgroundColor: ruby }}>
                <MapPin size={16} /> Lihat Lokasi
              </a>
            )}
          </div>
        </div>

        {/* Maps Embed */}
        {invitation.mapsLink && (
          <div className="scroll-reveal max-w-md mx-auto mt-8 rounded-2xl overflow-hidden shadow-lg" style={{ border: `2px solid ${goldBorder}` }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(invitation.location)}&output=embed`}
              width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy"
              className="w-full sm:h-[280px]" title="Lokasi Acara" />
          </div>
        )}
      </section>

      {/* ── GALLERY ── */}
      {invitation.photoUrl && (
        <section className="py-16 sm:py-20 px-4 relative" style={{ background: `radial-gradient(at center, ${cream}, #E8D5C4)` }}>
          <div className="max-w-lg mx-auto text-center">
            <h2 className="scroll-reveal text-2xl sm:text-3xl mb-2" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>
              Galeri
            </h2>
            <JavaneseDivider />
            <div className="scroll-reveal-scale mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-2xl shadow-md" style={{ border: `2px solid ${goldBorder}` }}>
                  <div className="aspect-square">
                    <img src={invitation.photoUrl} alt={`Gallery ${i+1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CLOSING ── */}
      <section className="relative py-16 sm:py-20 px-4 text-center overflow-hidden" style={{ background: `radial-gradient(at center, ${cream}, #E8D5C4)` }}>
        <div className="absolute inset-0 z-0">
          {invitation.photoUrl && <img src={invitation.photoUrl} alt="" className="w-full h-full object-cover opacity-15" />}
          <div className="absolute inset-0" style={{ backgroundColor: cream, opacity: 0.7 }} />
        </div>
        <div className="max-w-md mx-auto relative z-10">
          <Heart size={28} className="scroll-reveal-scale mx-auto mb-4 animate-heartbeat" style={{ color: ruby }} fill={ruby} />
          <h2 className="scroll-reveal text-3xl sm:text-4xl mb-4" style={{ color: ruby, fontFamily: 'Playfair Display, serif' }}>
            Terima Kasih
          </h2>
          <p className="scroll-reveal text-sm sm:text-base leading-relaxed mb-8" style={{ color: olive }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
          </p>
          <JavaneseDivider />
          <p className="scroll-reveal text-3xl sm:text-4xl font-handwriting mt-4" style={{ color: ruby }}>
            {invitation.groomName} & {invitation.brideName}
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-6 text-center text-white" style={{ backgroundColor: ruby }}>
        <p className="text-xs sm:text-sm opacity-80">
          Made with <Heart size={12} className="inline mx-1" fill="currentColor" /> by WD Group Company
        </p>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════
   GENERIC THEMED INVITATION (existing themes)
   ═══════════════════════════════════════ */
const GenericThemedInvitation = ({ invitation, guestName, t, countdown, isOpen, isClosing, isPlaying, audioRef, containerRef, handleOpen, toggleMusic }) => {
  const eventDate = new Date(invitation.date);
  const formattedDate = eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* Floating Petals */
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 8}s`,
    size: 8 + Math.random() * 14, variant: (i % 3) + 1, opacity: 0.3 + Math.random() * 0.4,
  }));

  const OrnamentDivider = ({ className = '' }) => (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <div className={`flex-1 max-w-[100px] h-px bg-gradient-to-r ${t.dividerColor}`} />
      <Heart size={16} className="animate-heartbeat" style={{ color: t.heartFill }} fill={t.heartFill} />
      <div className={`flex-1 max-w-[100px] h-px bg-gradient-to-l ${t.dividerColor}`} />
    </div>
  );

  if (!isOpen) {
    return (
      <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center ${t.cover.bg} ${isClosing ? 'animate-envelope-open' : ''}`}>
        <div className="absolute inset-0 z-0">
          <img src={invitation.photoUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80'}
            alt="Cover" className="w-full h-full object-cover opacity-30 scale-110" />
          <div className={`absolute inset-0 ${t.cover.overlay}`} />
        </div>
        <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-l-2 rounded-tl-xl z-10 ${t.cover.cornerBorder}`} />
        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 border-t-2 border-r-2 rounded-tr-xl z-10 ${t.cover.cornerBorder}`} />
        <div className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-16 h-16 sm:w-24 sm:h-24 border-b-2 border-l-2 rounded-bl-xl z-10 ${t.cover.cornerBorder}`} />
        <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 border-b-2 border-r-2 rounded-br-xl z-10 ${t.cover.cornerBorder}`} />
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-lg w-full">
          <p className={`text-xs uppercase tracking-[0.4em] mb-4 sm:mb-6 animate-fade-in-down ${t.cover.labelColor}`}>The Wedding Of</p>
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-handwriting mb-2 animate-fade-in-up ${t.cover.nameColor}`}>{invitation.groomName}</h1>
          <Heart size={22} className={`mx-auto animate-heartbeat my-2 sm:my-3 ${t.cover.accentColor}`} fill={t.heartFill} />
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-handwriting animate-fade-in-up stagger-2 ${t.cover.nameColor}`}>{invitation.brideName}</h1>
          <p className={`text-xs sm:text-sm mt-4 sm:mt-6 tracking-widest animate-fade-in-up stagger-3 ${t.cover.dateColor}`}>{formattedDate}</p>
          <div className={`mt-8 sm:mt-10 p-6 sm:p-8 backdrop-blur-xl rounded-3xl border shadow-2xl animate-fade-in-up stagger-4 ${t.cover.guestBg}`}>
            <p className={`text-xs uppercase tracking-widest mb-2 ${t.cover.guestLabel}`}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className={`font-serif text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${t.cover.guestName}`}>{guestName}</p>
            <button onClick={handleOpen} className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all text-base sm:text-lg ${t.cover.btnBg} ${t.cover.btnGlow}`}>
              💌 Buka Undangan
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 animate-bounce-down z-20">
          <ChevronDown size={24} className={`${t.cover.accentColor} opacity-60`} />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen font-sans">
      <audio ref={audioRef} loop><source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" /></audio>
      
      {/* Decorative Corner Flowers */}
      <div className="fixed top-0 left-0 opacity-40 pointer-events-none z-10 trj-flower-sway" style={{ animationDuration: '6s' }}>
        <FlowerOrnament />
      </div>
      <div className="fixed top-0 right-0 opacity-40 pointer-events-none z-10 trj-flower-sway trj-flower-sway--alt" style={{ animationDuration: '7s' }}>
        <FlowerOrnament flip />
      </div>

      {/* Floating Petals - Increased count and spread */}
      {Array.from({ length: 25 }, (_, i) => ({
        id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 15}s`,
        size: 10 + Math.random() * 16, variant: (i % 3) + 1, opacity: 0.2 + Math.random() * 0.5,
      })).map((p) => (
        <div key={p.id} className={`petal petal-${p.variant}`} style={{ left: p.left, animationDelay: p.delay, top: '-30px' }}>
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={t.petalColor.replace('%%OPACITY%%', String(p.opacity))} />
          </svg>
        </div>
      ))}
      <button onClick={toggleMusic} className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${t.musicBtn}`} aria-label="Toggle music">
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={invitation.photoUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80'} alt="Hero" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${t.hero.overlayGradient}`} />
        </div>
        <div className="relative z-10 px-4 animate-fade-in-up">
          <p className={`text-xs uppercase tracking-[0.35em] mb-4 sm:mb-6 ${t.hero.labelColor}`}>Pernikahan Kami</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-handwriting mb-2 sm:mb-3 drop-shadow-lg scroll-reveal-left" style={{ background: `linear-gradient(90deg, ${t.heartFill}, ${t.heartFill}aa, ${t.heartFill})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{invitation.groomName}</h1>
          <p className={`text-3xl sm:text-4xl font-handwriting animate-pulse-glow ${t.hero.ampersandColor}`}>&</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-handwriting mt-1 drop-shadow-lg scroll-reveal-right" style={{ background: `linear-gradient(90deg, ${t.heartFill}, ${t.heartFill}aa, ${t.heartFill})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{invitation.brideName}</h1>
          <p className={`font-serif text-base sm:text-lg mt-4 sm:mt-6 tracking-wide ${t.hero.dateColor}`}>{formattedDate}</p>
        </div>
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 animate-bounce-down z-10"><ChevronDown size={28} className="text-white/60" /></div>
      </section>

      {/* Countdown */}
      <section className={`relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden ${t.countdown.bg}`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-3xl pointer-events-none ${t.countdown.glowColor}`} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className={`scroll-reveal text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 ${t.countdown.labelSmall}`}>Menghitung Hari</p>
          <h2 className={`scroll-reveal text-3xl sm:text-4xl md:text-5xl font-handwriting mb-8 sm:mb-12 ${t.countdown.title}`}>Menuju Hari Bahagia</h2>
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-8">
            {[{ v: countdown.days, l: 'Hari' }, { v: countdown.hours, l: 'Jam' }, { v: countdown.minutes, l: 'Menit' }, { v: countdown.seconds, l: 'Detik' }].map((item, i) => (
              <div key={i} className="scroll-reveal-scale flex flex-col items-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl backdrop-blur-md border flex items-center justify-center mb-2 shadow-lg animate-pulse-glow ${t.countdown.cardBg}`}>
                  <span className={`text-2xl sm:text-3xl md:text-4xl font-bold font-serif ${t.countdown.valueColor}`}>{String(item.v).padStart(2, '0')}</span>
                </div>
                <span className={`text-[10px] sm:text-xs md:text-sm uppercase tracking-widest mt-1 ${t.countdown.unitColor}`}>{item.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      {invitation.story && (
        <section className={`py-16 sm:py-20 md:py-24 px-4 ${t.story.bg}`}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="scroll-reveal-scale"><svg className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 ${t.story.quoteColor}`} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg></div>
            <p className={`scroll-reveal text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic leading-relaxed px-2 ${t.story.textColor}`}>"{invitation.story}"</p>
            <OrnamentDivider className="mt-8 sm:mt-10" />
          </div>
        </section>
      )}

      {/* Event */}
      <section className={`relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden ${t.event.bg}`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full blur-3xl pointer-events-none ${t.countdown.glowColor}`} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <p className={`scroll-reveal text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 ${t.event.labelSmall}`}>Save The Date</p>
            <h2 className={`scroll-reveal text-3xl sm:text-4xl md:text-5xl font-handwriting mb-4 ${t.event.title}`}>Waktu & Tempat</h2>
            <OrnamentDivider />
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className={`scroll-reveal-left backdrop-blur-md border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center transition-all duration-500 ${t.event.cardBg}`}>
              <div className={`scroll-reveal-scale w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${t.event.iconBg}`}><Calendar size={28} className={t.event.iconColor} /></div>
              <h3 className={`text-xl sm:text-2xl font-serif font-bold mb-2 sm:mb-3 ${t.event.headingColor}`}>Tanggal & Waktu</h3>
              <p className={`text-base sm:text-lg mb-2 ${t.event.textColor}`}>{formattedDate}</p>
              <div className={`inline-flex items-center gap-2 mt-2 ${t.event.accentColor}`}><Clock size={16} /><span className="text-base sm:text-lg font-medium">{invitation.time} WIB – Selesai</span></div>
            </div>
            <div className={`scroll-reveal-right backdrop-blur-md border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center transition-all duration-500 ${t.event.cardBg}`}>
              <div className={`scroll-reveal-scale w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${t.event.iconBg}`}><MapPin size={28} className={t.event.iconColor} /></div>
              <h3 className={`text-xl sm:text-2xl font-serif font-bold mb-2 sm:mb-3 ${t.event.headingColor}`}>Lokasi Acara</h3>
              <p className={`text-base sm:text-lg mb-4 ${t.event.textColor}`}>{invitation.location}</p>
              {invitation.mapsLink && (
                <a href={invitation.mapsLink} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all shadow-lg text-sm sm:text-base ${t.event.btnBg}`}><MapPin size={16} />Buka Google Maps</a>
              )}
            </div>
          </div>
          {invitation.mapsLink && (
            <div className={`scroll-reveal mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl ${t.event.mapBorder}`}>
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(invitation.location)}&output=embed`} width="100%" height="250" style={{ border: 0 }} allowFullScreen="" loading="lazy" className="w-full sm:h-[300px]" title="Lokasi" />
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {invitation.photoUrl && (
        <section className={`py-16 sm:py-20 md:py-24 px-4 ${t.gallery.bg}`}>
          <div className="max-w-5xl mx-auto text-center">
            <p className={`scroll-reveal text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 ${t.gallery.labelSmall}`}>Galeri Kami</p>
            <h2 className={`scroll-reveal text-3xl sm:text-4xl md:text-5xl font-handwriting mb-4 ${t.gallery.title}`}>Momen Berharga</h2>
            <OrnamentDivider />
            <div className="scroll-reveal-scale mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <div className="aspect-square"><img src={invitation.photoUrl} alt={`Gallery ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing */}
      <section className={`relative py-16 sm:py-20 md:py-24 px-4 text-center overflow-hidden ${t.closing.bg}`}>
        <div className="absolute inset-0 z-0">
          <img src={invitation.photoUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80'} alt="" className="w-full h-full object-cover opacity-20" />
          <div className={`absolute inset-0 ${t.closing.overlayBg}`} />
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <Heart size={32} className={`scroll-reveal-scale mx-auto mb-4 sm:mb-6 animate-heartbeat ${t.closing.heartColor}`} fill={t.heartFill} />
          <h2 className={`scroll-reveal text-4xl sm:text-5xl md:text-6xl font-handwriting mb-4 sm:mb-6 ${t.closing.title}`}>Terima Kasih</h2>
          <p className={`scroll-reveal text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 px-2 ${t.closing.textColor}`}>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.</p>
          <OrnamentDivider />
          <p className="scroll-reveal text-3xl sm:text-4xl font-handwriting mt-6 sm:mt-8" style={{ background: `linear-gradient(90deg, ${t.heartFill}, ${t.heartFill}aa, ${t.heartFill})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{invitation.groomName} & {invitation.brideName}</p>
        </div>
      </section>

      <footer className={`py-6 sm:py-8 text-center border-t ${t.footerBg}`}>
        <p className={`text-xs sm:text-sm ${t.footerText}`}>Made with <Heart size={12} className="inline text-red-400 mx-1" fill="currentColor" /> by WD Group Company</p>
      </footer>
    </div>
  );
};

export default Invitation;
