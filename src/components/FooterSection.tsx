import { motion } from 'motion/react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function FooterSection() {
  const { data } = useWeddingData();
  const groomInitial = data.groom?.name?.charAt(0) || 'A';
  const brideInitial = data.bride?.name?.charAt(0) || 'A';

  return (
    <footer id="section-footer" className="relative z-10 pt-20 pb-28 border-t border-[#dfb461]/20 bg-[#08090e] text-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Monogram Seal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full border border-[#dfb461]/40 mx-auto flex items-center justify-center p-1 bg-[#10121a] shadow-[0_0_20px_rgba(223,180,97,0.25)]"
        >
          <div className="w-full h-full rounded-full border border-dashed border-[#dfb461]/60 flex items-center justify-center">
            <span className="font-script text-2xl text-gold-gradient">{groomInitial} & {brideInitial}</span>
          </div>
        </motion.div>

        {/* Closing words */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h3 className="font-serif-luxury text-2xl sm:text-4xl font-semibold text-neutral-100">
            Terima Kasih
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
          </p>
        </div>

        {/* Family Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="pt-6 border-t border-neutral-800/80 max-w-md mx-auto space-y-1.5"
        >
          <p className="text-xs text-[#dfb461] uppercase tracking-widest font-cinzel font-semibold mb-2">
            Kami Yang Berbahagia,
          </p>
          <p className="text-sm font-serif-luxury font-bold text-neutral-200">
            {data.groom.parentInfo}
          </p>
          <p className="text-sm font-serif-luxury font-bold text-neutral-200">
            {data.bride.parentInfo}
          </p>
          <p className="font-serif-luxury text-2xl font-bold text-gold-gradient pt-2">
            {data.groom.name} & {data.bride.name}
          </p>
        </motion.div>

        <div className="text-[11px] text-neutral-600 pt-6">
          © {new Date().getFullYear()} The Wedding of {data.groom.name} & {data.bride.name}.
        </div>
      </motion.div>
    </footer>
  );
}
