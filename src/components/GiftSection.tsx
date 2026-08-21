import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Copy, Check, QrCode, MapPin, CreditCard, ChevronDown } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function GiftSection() {
  const { data } = useWeddingData();
  const bankAccounts = data.bankAccounts || [];
  const giftAddress = data.giftAddress;

  const [showGifts, setShowGifts] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  if (bankAccounts.length === 0 && !giftAddress) {
    return null;
  }

  return (
    <section id="section-gift" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-4xl mx-auto relative z-10">
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
          <Gift className="w-3 h-3 text-[#dfb461]" />
          <span>Tanda Kasih</span>
        </motion.div>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-neutral-100">
          Amplop Digital & Kado
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, fitur amplop digital ini kami sediakan untuk memudahkan.
        </p>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '6rem' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#dfb461] to-transparent mx-auto"
        />
      </motion.div>

      {/* Main Trigger Toggle with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-center mb-6 sm:mb-8"
      >
        <motion.button
          onClick={() => setShowGifts(!showGifts)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#161a26] border border-[#dfb461]/50 text-[#fce09c] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 sm:gap-2.5 shadow-lg hover:border-[#dfb461] transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-[#dfb461]" />
          <span>{showGifts ? 'Sembunyikan Rekening' : 'Buka Rekening & Tanda Kasih'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showGifts ? 'rotate-180' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Accordion / Expandable Content */}
      <AnimatePresence>
        {showGifts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5 sm:space-y-6 overflow-hidden"
          >
            {/* Bank Accounts Grid */}
            {bankAccounts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {bankAccounts.map((bank, bIdx) => (
                  <div
                    key={bank.id || bIdx}
                    className="glass-panel border border-[#dfb461]/30 rounded-3xl p-5 sm:p-6 shadow-xl relative group hover:border-[#dfb461]/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="font-cinzel text-xs font-bold text-[#dfb461] uppercase tracking-wider">
                          {bank.bankName}
                        </span>
                        {bank.logoType === 'qris' ? (
                          <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#dfb461]" />
                        ) : (
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-[#dfb461] transition-colors" />
                        )}
                      </div>

                      <div className="space-y-1 my-3 sm:my-4">
                        <div className="text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-widest">
                          Nomor Rekening / ID
                        </div>
                        <div className="font-mono text-lg sm:text-2xl font-bold text-neutral-100 tracking-wider">
                          {bank.accountNumber}
                        </div>
                        <div className="text-xs text-neutral-300 font-medium">
                          a.n. {bank.accountHolder}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3.5 sm:pt-4 border-t border-neutral-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(bank.accountNumber.replace(/[^0-9]/g, '') || bank.accountNumber, bank.id || String(bIdx))}
                        className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          copiedId === (bank.id || String(bIdx))
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#181b26] border border-[#dfb461]/40 text-[#fce09c] hover:bg-[#222738]'
                        }`}
                      >
                        {copiedId === (bank.id || String(bIdx)) ? (
                          <>
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Salin Nomor</span>
                          </>
                        )}
                      </button>

                      {bank.logoType === 'qris' && (
                        <button
                          onClick={() => setShowQrisModal(true)}
                          className="py-2.5 px-3 rounded-xl bg-[#181b26] border border-[#dfb461]/40 text-[#fce09c] text-xs font-semibold hover:bg-[#222738] transition-all cursor-pointer"
                          title="Tampilkan Kode QRIS"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gift Shipping Address Card */}
            {giftAddress && (
              <div className="glass-panel border border-[#dfb461]/30 rounded-3xl p-5 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-[#161a26] border border-[#dfb461]/30 text-[#dfb461] shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif-luxury text-lg sm:text-xl font-bold text-neutral-100 mb-1">
                      Kirim Kado Fisik ke Alamat Mempelai
                    </h4>
                    <div className="text-xs text-neutral-300 font-semibold mb-1">
                      Penerima: {giftAddress.recipient} {giftAddress.phone ? `(${giftAddress.phone})` : ''}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-2.5 sm:mb-3">
                      {giftAddress.address}
                    </p>
                    {giftAddress.note && (
                      <p className="text-[10px] sm:text-[11px] text-amber-300/80 italic mb-3.5 sm:mb-4">
                        *{giftAddress.note}
                      </p>
                    )}

                    <button
                      onClick={() => handleCopy(`${giftAddress.recipient}\n${giftAddress.phone || ''}\n${giftAddress.address}`, 'address')}
                      className={`py-2 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                        copiedId === 'address'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#181b26] border border-[#dfb461]/40 text-[#fce09c] hover:bg-[#222738]'
                      }`}
                    >
                      {copiedId === 'address' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Alamat Berhasil Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Alamat Lengkap</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QRIS Modal */}
      <AnimatePresence>
        {showQrisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07080d]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="glass-panel border border-[#dfb461]/40 rounded-3xl p-5 sm:p-8 max-w-xs sm:max-w-sm w-full text-center relative shadow-2xl">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100 mb-1">
                QRIS Digital
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 mb-3 sm:mb-4">
                Scan via GoPay, OVO, Dana, ShopeePay, atau BCA Mobile
              </p>

              {/* QR Pattern visual container */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-inner flex flex-col items-center justify-between border-4 border-[#0c0d12]">
                <div className="text-[9px] sm:text-[10px] font-bold text-neutral-800 tracking-wider">QRIS STANDAR NASIONAL</div>
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-2 border-neutral-900 flex items-center justify-center relative p-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Wedding-Gift-${encodeURIComponent(data.groom.name + '-' + data.bride.name)}`}
                    alt="QRIS Wedding Gift"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[8px] sm:text-[9px] font-semibold text-neutral-600">{data.groom.fullName} & {data.bride.fullName}</div>
              </div>

              <button
                onClick={() => setShowQrisModal(false)}
                className="mt-5 sm:mt-6 px-6 py-2 rounded-full bg-[#dfb461] text-neutral-950 font-bold text-xs hover:bg-[#ebd08c] transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
