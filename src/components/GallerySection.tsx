import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { GalleryItem } from '../types';

export default function GallerySection() {
  const { data } = useWeddingData();
  const galleryPhotos = data.gallery || [];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(galleryPhotos.map((p) => p.category).filter(Boolean)));
    const list = [{ id: 'all', label: 'Semua Foto' }];
    uniqueCats.forEach((cat) => {
      list.push({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      });
    });
    return list;
  }, [galleryPhotos]);

  const filteredPhotos = activeCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter((p) => p.category === activeCategory);

  const handleNextPhoto = () => {
    if (!selectedPhoto || filteredPhotos.length === 0) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto || filteredPhotos.length === 0) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, filteredPhotos]);

  if (galleryPhotos.length === 0) return null;

  return (
    <section id="section-gallery" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-6xl mx-auto relative z-10">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181b26] border border-[#dfb461]/30 text-xs text-[#dfb461] uppercase tracking-[0.2em] font-cinzel shadow-sm"
        >
          <Camera className="w-3 h-3 text-[#dfb461]" />
          <span>Momen Bahagia</span>
        </motion.div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Galeri Prewedding
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          Potret kenangan yang merekam cinta, tawa, dan komitmen kami sebelum melangkah ke gerbang pernikahan.
        </p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#dfb461] to-transparent mx-auto"
        />
      </motion.div>

      {/* Filter Tabs with Smooth Horizontal Scroll on Mobile */}
      {categories.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 mb-6 sm:mb-10 px-1 -mx-2 sm:mx-0"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#dfb461] text-neutral-950 font-semibold shadow-[0_2px_15px_rgba(223,180,97,0.3)]'
                  : 'bg-[#151822] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Photos Grid: 2 columns on mobile, 3 on desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              layout
              key={photo.id || idx}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-[#dfb461]/25 aspect-[4/5] cursor-pointer shadow-lg hover:border-[#dfb461] transition-all"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title || 'Foto Galeri'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Mobile permanent badge / Desktop hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/40 to-transparent opacity-0 group-hover:opacity-100 sm:transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6">
                {photo.category && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] sm:text-[11px] font-cinzel text-[#fce09c] uppercase tracking-wider">
                      {photo.category}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dfb461]" />
                  </div>
                )}
                {photo.title && (
                  <h4 className="font-serif-luxury text-sm sm:text-xl font-bold text-neutral-100 mb-0.5 sm:mb-1">
                    {photo.title}
                  </h4>
                )}
                {photo.caption && (
                  <p className="text-[10px] sm:text-xs text-neutral-300 italic line-clamp-2 hidden sm:block">
                    "{photo.caption}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07080d]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-[#dfb461] hover:border-[#dfb461] transition-all z-20 cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-200 hover:text-[#dfb461] hover:border-[#dfb461] transition-all z-20 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-200 hover:text-[#dfb461] hover:border-[#dfb461] transition-all z-20 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image & Caption View */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center text-center px-4"
            >
              <div className="max-h-[65vh] sm:max-h-[70vh] rounded-2xl overflow-hidden border border-[#dfb461]/40 shadow-2xl mb-3 sm:mb-4 bg-black">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title || 'Foto Galeri'}
                  className="max-h-[65vh] sm:max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              {selectedPhoto.title && (
                <h3 className="font-serif-luxury text-lg sm:text-2xl font-bold text-neutral-100 mb-0.5 sm:mb-1">
                  {selectedPhoto.title}
                </h3>
              )}
              {selectedPhoto.caption && (
                <p className="text-xs sm:text-sm text-neutral-300 font-light italic max-w-xl">
                  "{selectedPhoto.caption}"
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
