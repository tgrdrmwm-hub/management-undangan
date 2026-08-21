import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Users, 
  Camera, 
  MessageSquareHeart, 
  Gift, 
  Share2, 
  Flower2,
  ChevronUp
} from 'lucide-react';

import CoverModal from './CoverModal';
import PetalCanvas from './PetalCanvas';
import GoldenCursor from './GoldenCursor';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import HeroSection from './HeroSection';
import CoupleSection from './CoupleSection';
import LoveStorySection from './LoveStorySection';
import EventsSection from './EventsSection';
import GallerySection from './GallerySection';
import RsvpSection from './RsvpSection';
import WishesSection from './WishesSection';
import GiftSection from './GiftSection';
import ShareInvitationModal from './ShareInvitationModal';
import FooterSection from './FooterSection';
import AdminFloatingToggle from './admin/AdminFloatingToggle';
import { useWeddingData } from '../context/WeddingDataContext';

export default function InvitationView() {
  const { 
    guestName, 
    setGuestName, 
    wishes, 
    addWish, 
    toggleLikeWish 
  } = useWeddingData();

  // State for cover invitation opening
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [enablePetals, setEnablePetals] = useState(true);
  const [activeSection, setActiveSection] = useState('section-hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll progress indicator
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lock body scroll when cover is open
  useEffect(() => {
    if (isCoverOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCoverOpen]);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 500);
    });
  }, [scrollY]);

  // IntersectionObserver scroll-spy for active navigation section
  useEffect(() => {
    if (isCoverOpen) return;

    const sections = [
      'section-hero',
      'section-couple',
      'section-story',
      'section-events',
      'section-gallery',
      'section-rsvp',
      'section-wishes',
      'section-gift',
    ];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [isCoverOpen]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'section-hero', label: 'Beranda', icon: Heart },
    { id: 'section-couple', label: 'Mempelai', icon: Users },
    { id: 'section-story', label: 'Kisah', icon: Sparkles },
    { id: 'section-events', label: 'Acara', icon: Calendar },
    { id: 'section-gallery', label: 'Galeri', icon: Camera },
    { id: 'section-rsvp', label: 'RSVP', icon: Users },
    { id: 'section-wishes', label: 'Ucapan', icon: MessageSquareHeart },
    { id: 'section-gift', label: 'Kado', icon: Gift },
  ];

  return (
    <div id="wedding-app-root" className="min-h-screen bg-[#090a10] text-[#e8e6e3] font-sans selection:bg-[#dfb461]/30 selection:text-[#fce09c] relative">
      {/* Golden Scroll Progress Bar */}
      {!isCoverOpen && (
        <motion.div
          id="scroll-progress-bar"
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#dfb461] via-[#fce09c] to-[#b38728] z-50 origin-left shadow-[0_0_12px_rgba(223,180,97,0.8)]"
        />
      )}

      {/* Interactive Falling Rose Petals Canvas */}
      {enablePetals && <PetalCanvas />}

      {/* Luxury Golden Cursor & Trailing Sparkle Light (Desktop) */}
      <GoldenCursor />

      {/* Opening Envelope & Wax Seal Cover */}
      <CoverModal
        isOpen={isCoverOpen}
        onOpen={() => setIsCoverOpen(false)}
        guestName={guestName}
        onUpdateGuestName={(name) => setGuestName(name)}
      />

      {/* Floating Ambient Music Player & Quick Actions */}
      {!isCoverOpen && (
        <FloatingMusicPlayer
          onOpenShare={() => setShowShareModal(true)}
          onScrollToRsvp={() => scrollToSection('section-rsvp')}
        />
      )}

      {/* Top Floating Controls (Petal Toggle & Share Button) */}
      {!isCoverOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed top-5 right-5 z-40 flex items-center gap-2"
        >
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-full border border-[#dfb461]/40 bg-[#141722]/80 text-[#dfb461] text-xs flex items-center gap-1.5 backdrop-blur-md hover:bg-[#1f2436] transition-all cursor-pointer shadow-md"
            title="Bagikan Undangan"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">Bagi Link</span>
          </button>

          <button
            onClick={() => setEnablePetals(!enablePetals)}
            className={`p-2 rounded-full border text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
              enablePetals
                ? 'bg-[#141722]/80 border-[#dfb461]/40 text-[#dfb461]'
                : 'bg-[#10121a]/80 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={enablePetals ? 'Nonaktifkan Efek Kelopak Bunga' : 'Aktifkan Efek Kelopak Bunga'}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">
              {enablePetals ? 'Kelopak On' : 'Kelopak Off'}
            </span>
          </button>
        </motion.div>
      )}

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {!isCoverOpen && showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Kembali ke Atas"
            className="fixed bottom-20 sm:bottom-6 left-3.5 sm:left-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#141722]/90 border border-[#dfb461]/40 text-[#dfb461] flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-[#202536] hover:border-[#dfb461] transition-all cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Wedding Content */}
      <main id="main-content" className="relative z-10 pb-16 sm:pb-8">
        {/* 1. Hero / Countdown / Holy Ayat */}
        <HeroSection onScrollDown={() => scrollToSection('section-couple')} />

        {/* 2. Couple Profiles */}
        <CoupleSection />

        {/* 3. Love Story Timeline */}
        <LoveStorySection />

        {/* 4. Events & Google Maps */}
        <EventsSection />

        {/* 5. Prewedding Gallery & Lightbox */}
        <GallerySection />

        {/* 6. RSVP Form */}
        <RsvpSection guestName={guestName} onAddWish={addWish} />

        {/* 7. Wishes Wall & Guestbook */}
        <WishesSection
          wishes={wishes}
          onAddWish={addWish}
          onToggleLike={toggleLikeWish}
        />

        {/* 8. Digital Envelope / Gifts */}
        <GiftSection />

        {/* 9. Closing & Footer */}
        <FooterSection />
      </main>

      {/* Bottom Floating Navigation Dock with Sliding Spring Indicator */}
      {!isCoverOpen && (
        <motion.nav
          id="wedding-nav-dock"
          aria-label="Navigasi Undangan"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full glass-panel border border-[#dfb461]/30 shadow-2xl backdrop-blur-xl flex items-center gap-0.5 sm:gap-1.5 max-w-[96vw] overflow-x-auto no-scrollbar"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap cursor-pointer z-10 ${
                  isActive
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-300 hover:text-[#fce09c] hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] rounded-full -z-10 shadow-md"
                  />
                )}
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </motion.nav>
      )}

      {/* Share / Personalize Link Modal */}
      <ShareInvitationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        currentGuestName={guestName}
      />

      {/* Floating Admin & Studio Management Drawer Button */}
      <AdminFloatingToggle />
    </div>
  );
}
