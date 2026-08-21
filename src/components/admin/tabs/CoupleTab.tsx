import { useState } from 'react';
import { 
  Users, 
  Instagram, 
  Image as ImageIcon, 
  Heart, 
  Check, 
  Upload, 
  Sparkles,
  Link
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';

const SAMPLE_GROOM_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
];

const SAMPLE_BRIDE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
];

export default function CoupleTab() {
  const { data, updateData } = useWeddingData();
  const [saved, setSaved] = useState(false);

  const handleUpdateGroom = (partial: any) => {
    updateData({
      groom: {
        ...data.groom,
        ...partial,
      },
    });
    showSaveIndicator();
  };

  const handleUpdateBride = (partial: any) => {
    updateData({
      bride: {
        ...data.bride,
        ...partial,
      },
    });
    showSaveIndicator();
  };

  const showSaveIndicator = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Data Profil Kedua Mempelai
          </h3>
          <p className="text-xs text-neutral-400">
            Lengkapi nama panggilan, nama lengkap, gelar, orang tua, foto, dan media sosial.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Tersimpan!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. DATA MEMPELAI PRIA (GROOM) */}
        <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#dfb461]/20 text-[#dfb461] flex items-center justify-center font-bold text-xs">
                ♂
              </span>
              <h4 className="font-bold text-neutral-100 text-base">Mempelai Pria (Groom)</h4>
            </div>
            <span className="text-[11px] font-bold text-[#dfb461] uppercase tracking-wider">
              {data.groom?.name || 'Pria'}
            </span>
          </div>

          {/* Photo Preview & URL */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-24 rounded-2xl overflow-hidden border-2 border-[#dfb461]/40 shrink-0 bg-neutral-900">
              <img
                src={data.groom?.photoUrl || SAMPLE_GROOM_PHOTOS[0]}
                alt="Groom Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                URL Foto Profil Pria
              </label>
              <input
                type="url"
                value={data.groom?.photoUrl || ''}
                onChange={(e) => handleUpdateGroom({ photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-500">Preset:</span>
                {SAMPLE_GROOM_PHOTOS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUpdateGroom({ photoUrl: url })}
                    className="w-5 h-5 rounded-md overflow-hidden border border-neutral-700 hover:border-[#dfb461] cursor-pointer"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Nama Panggilan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.groom?.name || ''}
              onChange={(e) => handleUpdateGroom({ name: e.target.value })}
              placeholder="Contoh: Arya"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Nama Lengkap Beserta Gelar <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.groom?.fullName || ''}
              onChange={(e) => handleUpdateGroom({ fullName: e.target.value })}
              placeholder="Contoh: Arya Pratama, S.T., M.Kom."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Keterangan Orang Tua <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.groom?.parentInfo || ''}
              onChange={(e) => handleUpdateGroom({ parentInfo: e.target.value })}
              placeholder="Putra Pertama dari Bpk. ... & Ibu ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Username Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.groom?.instagram || ''}
                onChange={(e) => handleUpdateGroom({ instagram: e.target.value })}
                placeholder="@aryapratama.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
              <Instagram className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Deskripsi Singkat / Kutipan Pribadi
            </label>
            <textarea
              rows={2}
              value={data.groom?.description || ''}
              onChange={(e) => handleUpdateGroom({ description: e.target.value })}
              placeholder="Ungkapan tentang pasangan..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>
        </div>

        {/* 2. DATA MEMPELAI WANITA (BRIDE) */}
        <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                ♀
              </span>
              <h4 className="font-bold text-neutral-100 text-base">Mempelai Wanita (Bride)</h4>
            </div>
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              {data.bride?.name || 'Wanita'}
            </span>
          </div>

          {/* Photo Preview & URL */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-24 rounded-2xl overflow-hidden border-2 border-rose-400/40 shrink-0 bg-neutral-900">
              <img
                src={data.bride?.photoUrl || SAMPLE_BRIDE_PHOTOS[0]}
                alt="Bride Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                URL Foto Profil Wanita
              </label>
              <input
                type="url"
                value={data.bride?.photoUrl || ''}
                onChange={(e) => handleUpdateBride({ photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-500">Preset:</span>
                {SAMPLE_BRIDE_PHOTOS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUpdateBride({ photoUrl: url })}
                    className="w-5 h-5 rounded-md overflow-hidden border border-neutral-700 hover:border-rose-400 cursor-pointer"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Nama Panggilan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.bride?.name || ''}
              onChange={(e) => handleUpdateBride({ name: e.target.value })}
              placeholder="Contoh: Anindya"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Nama Lengkap Beserta Gelar <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.bride?.fullName || ''}
              onChange={(e) => handleUpdateBride({ fullName: e.target.value })}
              placeholder="Contoh: Anindya Larasati, S.Ds."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Keterangan Orang Tua <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={data.bride?.parentInfo || ''}
              onChange={(e) => handleUpdateBride({ parentInfo: e.target.value })}
              placeholder="Putri Kedua dari Bpk. ... & Ibu ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Username Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.bride?.instagram || ''}
                onChange={(e) => handleUpdateBride({ instagram: e.target.value })}
                placeholder="@anindyalarasati"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
              />
              <Instagram className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Deskripsi Singkat / Kutipan Pribadi
            </label>
            <textarea
              rows={2}
              value={data.bride?.description || ''}
              onChange={(e) => handleUpdateBride({ description: e.target.value })}
              placeholder="Ungkapan tentang pasangan..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
