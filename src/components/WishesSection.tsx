import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareHeart, Heart, Sparkles, Send, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { GuestWish } from '../types';

interface WishesSectionProps {
  wishes: GuestWish[];
  onAddWish: (wish: GuestWish) => void;
  onToggleLike: (id: string) => void;
}

export default function WishesSection({ wishes, onAddWish, onToggleLike }: WishesSectionProps) {
  const [filter, setFilter] = useState<'all' | 'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('all');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Sahabat');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState<'Hadir' | 'Masih Ragu' | 'Tidak Hadir'>('Hadir');

  const filteredWishes = filter === 'all'
    ? wishes
    : wishes.filter((w) => w.status === filter);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      status: attendance,
      message: message.trim(),
      createdAt: 'Baru saja',
      likes: 0,
      isLiked: false,
      relation,
    };

    onAddWish(newWish);
    setMessage('');
    setName('');
  };

  return (
    <section id="section-wishes" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-5xl mx-auto relative z-10">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-3"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#181b26] border border-[#dfb461]/30 text-xs text-[#dfb461] uppercase tracking-[0.2em] font-cinzel shadow-sm"
        >
          <MessageSquareHeart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
          <span>Doa & Harapan</span>
        </motion.div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Buku Tamu & Ucapan
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          Tinggalkan pesan, doa kebaikan, dan restu tulus Anda untuk mengiringi langkah baru kedua mempelai.
        </p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#dfb461] to-transparent mx-auto"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Form to Write Wish with Scroll Reveal */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel border border-[#dfb461]/30 rounded-3xl p-5 sm:p-7 shadow-xl sticky top-20 sm:top-24"
          >
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-neutral-100 mb-3.5 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#dfb461]" />
              <span>Kirim Ucapan & Doa</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap / Keluarga"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-xs focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Hubungan
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-2.5 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-xs focus:outline-none focus:border-[#dfb461]"
                  >
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Teman Kerja">Teman Kerja</option>
                    <option value="Teman Kuliah">Teman Kuliah</option>
                    <option value="Tamu Undangan">Tamu Undangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Kehadiran
                  </label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value as any)}
                    className="w-full px-2.5 sm:px-3 py-2.5 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-xs focus:outline-none focus:border-[#dfb461]"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Masih Ragu">Masih Ragu</option>
                    <option value="Tidak Hadir">Berhalangan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Untaian Doa & Pesan
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan doa restu yang tulus untuk Arya & Anindya..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141e] border border-neutral-700/80 text-neutral-100 text-xs focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d994] to-[#b38728] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_2px_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ucapan</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Wishes Wall List with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 40, x: 20 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-3.5 sm:space-y-4"
        >
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: `Semua (${wishes.length})` },
              { id: 'Hadir', label: 'Hadir' },
              { id: 'Masih Ragu', label: 'Ragu' },
              { id: 'Tidak Hadir', label: 'Berhalangan' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-[#dfb461] text-neutral-950 font-semibold'
                    : 'bg-[#151822] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Wishes List */}
          <div className="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredWishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel border border-[#dfb461]/20 rounded-2xl p-4 sm:p-5 shadow-md relative group hover:border-[#dfb461]/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#1b1e2a] to-[#252a3a] border border-[#dfb461]/40 text-[#fce09c] flex items-center justify-center font-cinzel font-bold text-xs shadow-inner shrink-0">
                        {wish.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-neutral-100 flex items-center gap-1.5 flex-wrap">
                          <span>{wish.name}</span>
                          {wish.relation && (
                            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#181b26] border border-neutral-700/60 text-neutral-400 font-normal">
                              {wish.relation}
                            </span>
                          )}
                        </h4>
                        <span className="text-[9px] sm:text-[10px] text-neutral-400">{wish.createdAt}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium shrink-0">
                      {wish.status === 'Hadir' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Hadir
                        </span>
                      )}
                      {wish.status === 'Masih Ragu' && (
                        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]">
                          <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Ragu
                        </span>
                      )}
                      {wish.status === 'Tidak Hadir' && (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]">
                          <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Berhalangan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message body */}
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-serif-luxury italic pl-9 sm:pl-10 mb-2.5 sm:mb-3">
                    "{wish.message}"
                  </p>

                  {/* Like Button */}
                  <div className="flex items-center justify-end pl-9 sm:pl-10">
                    <button
                      onClick={() => onToggleLike(wish.id)}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                        wish.isLiked
                          ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                          : 'bg-[#141722] text-neutral-400 hover:text-rose-300 border border-neutral-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${wish.isLiked ? 'fill-rose-400' : ''}`} />
                      <span>{wish.likes}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
