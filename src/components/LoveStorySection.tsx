import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, Gem, Infinity as InfinityIcon, Heart } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

const iconMap: Record<string, typeof Sparkles> = {
  Sparkles,
  HeartHandshake,
  Gem,
  Infinity: InfinityIcon,
};

export default function LoveStorySection() {
  const { data } = useWeddingData();
  const milestones = data.loveStory || [];

  if (milestones.length === 0) return null;

  return (
    <section id="section-story" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-5xl mx-auto relative z-10">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5 sm:space-y-3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181b26] border border-[#dfb461]/30 text-xs text-[#dfb461] uppercase tracking-[0.2em] font-cinzel shadow-sm"
        >
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
          <span>Our Journey</span>
        </motion.div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Kisah Cinta Kami
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          Setiap kisah cinta itu indah, namun bagi kami, kisah ini adalah yang paling istimewa.
        </p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#dfb461] to-transparent mx-auto"
        />
      </motion.div>

      {/* Timeline Vertical Stack */}
      <div className="relative">
        {/* Central timeline golden spine line with smooth reveal */}
        <motion.div
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#dfb461]/20 via-[#dfb461]/70 to-[#dfb461]/20 shadow-[0_0_10px_rgba(223,180,97,0.3)]"
        />

        <div className="space-y-8 sm:space-y-12">
          {milestones.map((milestone, idx) => {
            const Icon = iconMap[milestone.icon] || Heart;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, x: isEven ? -25 : 25 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-12 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline node icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 + 0.2, type: 'spring', stiffness: 220 }}
                  className="md:absolute md:left-1/2 md:-translate-x-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#141722] border-2 border-[#dfb461] text-[#dfb461] flex items-center justify-center shadow-[0_0_18px_rgba(223,180,97,0.4)] group-hover:scale-110 transition-transform shrink-0"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>

                {/* Content Card */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.25 } }}
                    className="glass-panel border border-[#dfb461]/25 rounded-3xl p-4 sm:p-7 shadow-xl hover:border-[#dfb461]/60 transition-all group overflow-hidden"
                  >
                    {milestone.photoUrl && (
                      <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3.5 sm:mb-4 relative">
                        <img
                          src={milestone.photoUrl}
                          alt={milestone.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#0d0f16]/90 border border-[#dfb461]/40 text-[10px] sm:text-xs font-cinzel font-bold text-[#fce09c] backdrop-blur-md shadow-md">
                          {milestone.year}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="text-[11px] sm:text-xs font-cinzel font-semibold text-[#dfb461] tracking-wider uppercase">
                        {milestone.year}
                      </span>
                      <span className="text-neutral-600">•</span>
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-neutral-100">
                        {milestone.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
