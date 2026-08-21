import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, X, MessageCircle } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

interface ShareInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuestName: string;
}

export default function ShareInvitationModal({ isOpen, onClose, currentGuestName }: ShareInvitationModalProps) {
  const { data } = useWeddingData();
  const [recipientName, setRecipientName] = useState(currentGuestName || 'Bapak/Ibu/Saudara/i');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const invitationUrl = `${baseUrl}?to=${encodeURIComponent(recipientName.trim())}`;

  const mainVenue = data.events?.[0]?.venueName || 'The Venue';
  const mainCity = data.cityLocation || '';
  const dateStr = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Sabtu, 24 Oktober 2026';

  const shareText = `Kepada Yth. ${recipientName}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*The Wedding of ${data.groom.name} & ${data.bride.name}*
🗓️ ${dateStr}
📍 ${mainVenue}${mainCity ? ', ' + mainCity : ''}

Buka tautan undangan resmi berikut:
${invitationUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
${data.groom.name} & ${data.bride.name}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#07080d]/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-panel border border-[#dfb461]/40 rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[92vh] overflow-y-auto relative shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 pr-8">
              <Share2 className="w-4 h-4 text-[#dfb461]" />
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100">
                Bagikan Undangan
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 mb-4 sm:mb-6">
              Kustomisasi nama tamu penerima untuk membuat link undangan personal.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Nama Tamu Penerima:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Contoh: Dimas & Keluarga"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12141e] border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus:border-[#dfb461] focus:ring-1 focus:ring-[#dfb461]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Link Undangan Personal:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invitationUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0f1118] border border-neutral-800 text-neutral-400 text-xs truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      copied ? 'bg-emerald-600 text-white' : 'bg-[#181b26] border border-[#dfb461]/40 text-[#fce09c]'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Share to WhatsApp button */}
            <div className="space-y-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim via WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-[#141620] text-neutral-400 hover:text-white font-medium text-xs transition-colors"
              >
                Selesai
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
