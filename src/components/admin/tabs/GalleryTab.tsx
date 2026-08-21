import { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { GalleryItem } from '../../../types';

const SAMPLE_PHOTO_PRESETS = [
  {
    title: 'Eternal Elegance',
    category: 'studio' as const,
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dalam tatapan penuh ketulusan, kami menemukan rumah satu sama lain.',
    aspect: 'portrait' as const,
  },
  {
    title: 'Sunset Whispers',
    category: 'outdoor' as const,
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Senja mengajarkan bahwa hal terindah adalah saat kita melangkah bersama.',
    aspect: 'landscape' as const,
  },
  {
    title: 'Traditional Warmth',
    category: 'traditional' as const,
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    caption: 'Menghargai akar budaya yang mempertemukan restu keluarga.',
    aspect: 'portrait' as const,
  },
  {
    title: 'Joyful Laughter',
    category: 'candid' as const,
    imageUrl: 'https://images.unsplash.com/photo-1519225429875-585a97576579?auto=format&fit=crop&w=1200&q=80',
    caption: 'Tawa renyah yang selalu mencairkan segala lelah di penghujung hari.',
    aspect: 'square' as const,
  },
];

export default function GalleryTab() {
  const { data, updateData } = useWeddingData();
  const gallery = data.gallery || [];

  const handleUpdate = (newItems: GalleryItem[]) => {
    updateData({ gallery: newItems });
  };

  const handleAddPhoto = () => {
    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: 'Momen Prewedding',
      category: 'outdoor',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Cerita indah dalam satu bingkai cinta.',
      aspect: 'portrait',
    };
    handleUpdate([...gallery, newItem]);
  };

  const handleDelete = (index: number) => {
    if (confirm('Hapus foto ini dari galeri?')) {
      handleUpdate(gallery.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: keyof GalleryItem, value: any) => {
    const updated = [...gallery];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleUpdate(updated);
  };

  const handleLoadSamplePack = () => {
    if (confirm('Muat ulang 4 foto preset contoh berkualitas tinggi?')) {
      const formatted = SAMPLE_PHOTO_PRESETS.map((p, idx) => ({
        id: 'gal-preset-' + idx,
        ...p,
      }));
      handleUpdate(formatted);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Galeri Foto Prewedding & Dokumentasi
          </h3>
          <p className="text-xs text-neutral-400">
            Atur foto, kategori filter (Outdoor, Studio, Tradisional, Candid), dan rasio tampilan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSamplePack}
            className="px-3 py-2 rounded-xl bg-[#1a1e2d] border border-neutral-700 text-neutral-300 text-xs hover:border-[#dfb461] transition-all cursor-pointer"
          >
            Load Foto Contoh
          </button>
          <button
            type="button"
            onClick={handleAddPhoto}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-[#121520] border border-neutral-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between space-y-3"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-[#dfb461] backdrop-blur-sm">
                {item.category}
              </span>
              <button
                onClick={() => handleDelete(idx)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-neutral-400 hover:text-rose-400 hover:bg-black transition-colors cursor-pointer"
                title="Hapus Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Edit Fields */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-0.5">
                  URL Gambar Foto
                </label>
                <input
                  type="url"
                  value={item.imageUrl}
                  onChange={(e) => handleChange(idx, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-0.5">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                    placeholder="Judul foto..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-0.5">
                    Kategori Tab
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => handleChange(idx, 'category', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  >
                    <option value="outdoor">Outdoor</option>
                    <option value="studio">Studio</option>
                    <option value="traditional">Tradisional</option>
                    <option value="candid">Candid / Moments</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-0.5">
                  Caption / Cerita Foto
                </label>
                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleChange(idx, 'caption', e.target.value)}
                  placeholder="Keterangan singkat foto..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
