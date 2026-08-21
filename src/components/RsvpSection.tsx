import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserCheck, CheckCircle2, XCircle, HelpCircle, Send, Sparkles, Users } from 'lucide-react';
import { GuestWish } from '../types';

interface RsvpSectionProps {
  guestName: string;
  onAddWish: (wish: GuestWish) => void;
}

export default function RsvpSection({ guestName, onAddWish }: RsvpSectionProps) {
  const [name, setName] = useState(guestName || '');
  const [phone, setPhone] = useState('');
  const [pax, setPax] = useState('2');
  const [status, setStatus] = useState<'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('Hadir');
  const [session, setSession] = useState('Keduanya');
  const [wishesMessage, setWishesMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#e6c575', '#fce09c', '#ffffff', '#4ade80'],
    });

    if (wishesMessage.trim()) {
      const newWish: GuestWish = {
        id: `wish-${Date.now()}`,
        name: name.trim(),
        status,
        message: wishesMessage.trim(),
        createdAt: 'Baru saja',
        likes: 1,
        isLiked: true,
        relation: 'Tamu Undangan',
      };
      onAddWish(newWish);
    }

    setIsSubmitted(true);
  };

  return (
    <section id="section-rsvp" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-4xl mx-auto relative z-10">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5 sm:space-y-3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181b26] border border-[#dfb461]/30 text-xs text-[#dfb461] uppercase tracking-[0.2em] font-cinzel shadow-sm"
        >
          <UserCheck className="w-3 h-3 text-[#dfb461]" />
          <span>Konfirmasi Kehadiran</span>
        </motion.div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          RSVP Kehadiran
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          Mohon konfirmasikan kehadiran Anda untuk membantu kami mempersiapkan jamuan terbaik bagi seluruh tamu undangan.
        </p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#dfb461] to-transparent mx-auto"
        />
      </motion.div>

      {/* Main RSVP Card with Smooth Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel border border-[#dfb461]/30 rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6 sm:py-10 space-y-3.5 sm:space-y-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-100">
              Terima Kasih, {name}!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Konfirmasi kehadiran Anda telah berhasil dicatat ({status === 'Hadir' ? `Hadir (${pax} Orang)` : status}). Kami sangat menantikan kehadiran dan doa restu Anda.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-3 sm:mt-4 px-6 py-2.5 rounded-full bg-[#181b26] border border-[#dfb461]/40 text-xs font-semibold text-[#fce09c] hover:bg-[#222738] transition-all cursor-pointer"
            >
              Ubah Konfirmasi RSVP
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                Nama Lengkap Tamu <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bpk. Hendrawan & Rekan"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] transition-all"
              />
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                Nomor WhatsApp (Untuk Reminder Acara)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] transition-all"
              />
            </div>

            {/* Attendance Status Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                Konfirmasi Kehadiran <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { value: 'Hadir', label: 'Ya, Saya Hadir', icon: CheckCircle2, color: 'text-emerald-400' },
                  { value: 'Masih Ragu', label: 'Masih Ragu', icon: HelpCircle, color: 'text-amber-400' },
                  { value: 'Tidak Hadir', label: 'Berhalangan Hadir', icon: XCircle, color: 'text-rose-400' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = status === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => setStatus(item.value as any)}
                      className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#181b26] border-[#dfb461] text-[#fce09c] shadow-[0_0_15px_rgba(223,180,97,0.2)]'
                          : 'bg-[#12141e] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {status === 'Hadir' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Pax */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                    Jumlah Tamu Hadir
                  </label>
                  <select
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] transition-all cursor-pointer"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang (Sekeluarga)</option>
                  </select>
                </div>

                {/* Sesi Acara */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                    Sesi Acara yang Dihadiri
                  </label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] transition-all cursor-pointer"
                  >
                    <option value="Keduanya">Akad & Resepsi (Keduanya)</option>
                    <option value="Akad Nikah">Akad Nikah Saja (Pagi)</option>
                    <option value="Resepsi">Resepsi Saja (Malam)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Wishes Message field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 sm:mb-2">
                Ucapan & Doa Restu untuk Mempelai
              </label>
              <textarea
                rows={3}
                value={wishesMessage}
                onChange={(e) => setWishesMessage(e.target.value)}
                placeholder="Tuliskan ucapan selamat dan doa terbaik Anda di sini..."
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d994] to-[#b38728] text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_35px_rgba(212,175,55,0.6)] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-neutral-950" />
              <span>Kirim Konfirmasi RSVP</span>
            </motion.button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
