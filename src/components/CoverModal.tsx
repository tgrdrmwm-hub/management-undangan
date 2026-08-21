import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MailOpen, Sparkles, Volume2, UserCheck, Edit3 } from 'lucide-react';
import { weddingAudio } from '../utils/audio';
import { useWeddingData } from '../context/WeddingDataContext';
import { THEMES } from '../data/weddingData';
import { ThemeCornerOrnament, ThemeCulturalBadge, useActiveLayout } from './ThemeDecorations';

interface CoverModalProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
  onUpdateGuestName: (name: string) => void;
}

export default function CoverModal({ isOpen, onOpen, guestName, onUpdateGuestName }: CoverModalProps) {
  const { data } = useWeddingData();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(guestName);

  const activeTheme = THEMES.find((t) => t.id === data.theme) || THEMES[0];
  const activeLayout = useActiveLayout();
  const primaryColor = activeTheme.primaryColor;
  const secondaryColor = activeTheme.secondaryColor;

  const groomInitial = data.groom?.name?.charAt(0) || 'A';
  const brideInitial = data.bride?.name?.charAt(0) || 'A';
  const dateFormatted = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Sabtu, 24 Oktober 2026';

  const handleOpenInvitation = () => {
    // Fire celebratory confetti bursts with theme colors
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [primaryColor, secondaryColor, '#ffffff', '#e8a598', '#dfb461'],
    });

    // Start ambient romantic melody
    try {
      weddingAudio.start();
    } catch {
      // Audio autoplay policy fallback handled smoothly
    }

    onOpen();
  };

  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateGuestName(tempName.trim());
      setIsEditing(false);
    }
  };

  // Determine cover card shape based on active layout
  let coverFrameClass = activeTheme.cardRadius || 'rounded-3xl';
  if (activeLayout.id === 'boho-arch' || activeLayout.id === 'monaco-velvet') {
    coverFrameClass = 'rounded-t-full rounded-b-3xl pt-12';
  } else if (activeLayout.id === 'split-editorial' || activeLayout.id === 'bauhaus-quadrant' || activeLayout.id === 'minimalist-swiss') {
    coverFrameClass = 'rounded-xl border-l-4 border-l-[#dfb461]';
  } else if (activeLayout.id === 'victorian-cameo' || activeLayout.id === 'haute-couture') {
    coverFrameClass = 'rounded-[2.5rem]';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="wedding-cover-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: activeTheme.bgHex }}
        >
          {/* Ambient background glow and imagery */}
          <div className="absolute inset-0 z-0 opacity-40">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${activeTheme.bgHex} 10%, transparent 60%, ${activeTheme.bgHex} 100%)`
              }} 
            />
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
              alt="Romantic Background"
              className="w-full h-full object-cover scale-105 filter blur-[2px]"
            />
          </div>

          {/* Radial theme spotlight */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: activeTheme.glowHex || `${primaryColor}20` }} 
          />

          {/* Luxury Frame Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`relative z-10 w-full max-w-lg mx-3 sm:mx-4 max-h-[92vh] overflow-y-auto no-scrollbar p-6 sm:p-8 md:p-10 ${coverFrameClass} shadow-2xl text-center flex flex-col items-center justify-between my-auto border`}
            style={{
              backgroundColor: `${activeTheme.cardBgHex}f0`,
              borderColor: `${primaryColor}40`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${activeTheme.glowHex || 'rgba(0,0,0,0.2)'}`
            }}
          >
            <ThemeCornerOrnament />

            {/* Top Monogram Seal / Cultural Tag */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
              <ThemeCulturalBadge />
              <span 
                className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-cinzel font-semibold"
                style={{ color: primaryColor }}
              >
                {activeLayout.culturalTag ? `Pernikahan Adat ${activeLayout.culturalTag}` : 'The Wedding Celebration'}
              </span>
              <div 
                className="w-12 h-[1px]" 
                style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
              />
            </div>

            {/* Couple Monogram Circle */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative my-2 sm:my-3 flex items-center justify-center"
            >
              <div 
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border flex items-center justify-center p-1 sm:p-1.5 backdrop-blur-md"
                style={{ 
                  borderColor: `${primaryColor}60`,
                  backgroundColor: `${activeTheme.cardBgHex}cc`,
                  boxShadow: `0 0 25px ${primaryColor}30`
                }}
              >
                <div 
                  className="w-full h-full rounded-full border border-dashed flex items-center justify-center"
                  style={{ borderColor: `${primaryColor}80` }}
                >
                  <span 
                    className="font-script text-2xl sm:text-4xl select-none"
                    style={{
                      background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {groomInitial} & {brideInitial}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Couple Names */}
            <div className="space-y-1 mb-4 sm:mb-6">
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-semibold text-neutral-100 tracking-wide">
                {data.groom.name} & {data.bride.name}
              </h1>
              <p 
                className="text-[11px] sm:text-xs tracking-widest uppercase font-cinzel font-medium"
                style={{ color: primaryColor }}
              >
                {dateFormatted}
              </p>
            </div>

            {/* Recipient Invitation Card Inside Envelope */}
            <div 
              className="w-full border rounded-2xl p-4 sm:p-5 mb-5 sm:mb-8 text-neutral-200 relative group shadow-inner"
              style={{
                backgroundColor: `${activeTheme.bgHex}cc`,
                borderColor: `${primaryColor}35`
              }}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mb-1">
                <UserCheck className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span className="tracking-wider uppercase text-[9px] sm:text-[10px]">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveName} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900/80 border text-neutral-100 text-sm text-center focus:outline-none"
                    style={{ borderColor: `${primaryColor}60` }}
                    placeholder="Ketik nama tamu..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-neutral-950 font-medium text-xs transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Simpan
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="font-semibold text-base sm:text-xl text-neutral-100 font-serif-luxury tracking-wide">
                    {guestName || 'Tamu Undangan Yang Berbahagia'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(guestName);
                      setIsEditing(true);
                    }}
                    title="Ganti Nama Tamu"
                    className="p-1 rounded-full text-neutral-400 hover:text-white transition-all opacity-70 group-hover:opacity-100"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1 italic">
                *Mohon maaf apabila ada kesalahan penulisan nama/gelar
              </p>
            </div>

            {/* Open Button with Wax Seal Accent */}
            <motion.button
              id="btn-open-invitation"
              onClick={handleOpenInvitation}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 text-neutral-950 shadow-lg cursor-pointer transition-all"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                boxShadow: `0 6px 25px ${primaryColor}60`
              }}
            >
              <MailOpen className="w-4 h-4 text-neutral-950 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide">Buka Undangan</span>
              <Sparkles className="w-4 h-4 text-neutral-950 animate-pulse" />
            </motion.button>

            {/* Audio Hint */}
            <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400">
              <Volume2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Musik latar romantis akan diputar otomatis</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
