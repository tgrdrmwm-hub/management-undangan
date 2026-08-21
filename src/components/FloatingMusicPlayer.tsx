import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Disc3, Volume2, VolumeX, Sparkles, Share2 } from 'lucide-react';
import { weddingAudio } from '../utils/audio';

interface FloatingMusicPlayerProps {
  onOpenShare: () => void;
  onScrollToRsvp: () => void;
}

export default function FloatingMusicPlayer({ onOpenShare, onScrollToRsvp }: FloatingMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check audio status periodically
    const interval = setInterval(() => {
      setIsPlaying(weddingAudio.getStatus());
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAudio = () => {
    const status = weddingAudio.toggle();
    setIsPlaying(status);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
      {/* Quick Action: Share / Generate Link Button */}
      <motion.button
        id="btn-floating-share"
        onClick={onOpenShare}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title="Bagikan Undangan / Buat Link Tamu"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#12141d]/90 border border-[#dfb461]/40 text-[#dfb461] flex items-center justify-center shadow-lg hover:bg-[#1c202e] hover:border-[#dfb461] transition-all cursor-pointer backdrop-blur-md"
      >
        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </motion.button>

      {/* Quick RSVP Floating Pill on Mobile/Desktop */}
      <motion.button
        id="btn-floating-rsvp"
        onClick={onScrollToRsvp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161a26]/90 border border-[#dfb461]/40 text-xs font-medium text-[#fce09c] shadow-lg backdrop-blur-md hover:border-[#dfb461] transition-all cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#dfb461]" />
        <span>Konfirmasi RSVP</span>
      </motion.button>

      {/* Main Music Player Disk */}
      <div className="relative group">
        <motion.button
          id="btn-music-toggle"
          onClick={handleToggleAudio}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#1b1e2a] to-[#252a3a] border-[#dfb461] text-[#dfb461] shadow-[0_0_20px_rgba(223,180,97,0.35)]'
              : 'bg-[#10121a]/90 border-neutral-700 text-neutral-400'
          }`}
          aria-label="Toggle Background Music"
        >
          {isPlaying ? (
            <Disc3 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow text-[#dfb461]" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
          )}
        </motion.button>

        {/* Audio Wave Visualizer Bars when active */}
        {isPlaying && (
          <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-2.5 sm:h-3 px-1 py-0.5 bg-[#0f1118]/80 border border-[#dfb461]/30 rounded-full">
            <span className="w-0.5 h-2 bg-[#dfb461] rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-0.5 h-2.5 sm:h-3 bg-[#dfb461] rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-0.5 h-1.5 bg-[#dfb461] rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#10121a] border border-[#dfb461]/30 text-[11px] text-[#fce09c] whitespace-nowrap shadow-xl">
            {isPlaying ? 'Matikan Musik' : 'Putar Musik Romantis'}
          </div>
        )}
      </div>
    </div>
  );
}
