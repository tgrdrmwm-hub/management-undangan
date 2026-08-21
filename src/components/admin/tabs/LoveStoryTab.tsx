import { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  HeartHandshake, 
  Gem, 
  Infinity as InfinityIcon, 
  Star, 
  Coffee, 
  Calendar, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { LoveMilestone } from '../../../types';

const STORY_ICONS = [
  { id: 'Sparkles', label: 'Pertemuan (Sparkles)' },
  { id: 'HeartHandshake', label: 'Komitmen (Heart)' },
  { id: 'Gem', label: 'Lamaran / Cincin (Gem)' },
  { id: 'Infinity', label: 'Pernikahan (Infinity)' },
  { id: 'Coffee', label: 'Kencan Pertama (Coffee)' },
  { id: 'Star', label: 'Momen Spesial (Star)' },
];

export default function LoveStoryTab() {
  const { data, updateData } = useWeddingData();
  const milestones = data.loveStory || [];

  const handleUpdate = (newStory: LoveMilestone[]) => {
    updateData({ loveStory: newStory });
  };

  const handleAddMilestone = () => {
    const newItem: LoveMilestone = {
      year: new Date().getFullYear().toString(),
      title: 'Momen Bahagia Baru',
      description: 'Tuliskan kisah perjalanan cinta yang berkesan di tahun ini...',
      icon: 'Sparkles',
      photoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80',
    };
    handleUpdate([...milestones, newItem]);
  };

  const handleDelete = (index: number) => {
    if (confirm('Hapus babak kisah cinta ini?')) {
      handleUpdate(milestones.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, field: keyof LoveMilestone, value: string) => {
    const updated = [...milestones];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Perjalanan & Kisah Cinta (Love Story Timeline)
          </h3>
          <p className="text-xs text-neutral-400">
            Ceritakan momen pertama kali bertemu, jadian, lamaran, hingga menuju pelaminan.
          </p>
        </div>

        <button
          onClick={handleAddMilestone}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Babak Kisah</span>
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#dfb461]/20 text-[#dfb461] font-mono font-bold text-xs">
                  {m.year || 'Tahun'}
                </span>
                <h4 className="font-bold text-neutral-100 text-sm">{m.title}</h4>
              </div>

              {milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tahun / Waktu
                </label>
                <input
                  type="text"
                  value={m.year}
                  onChange={(e) => handleChange(idx, 'year', e.target.value)}
                  placeholder="Contoh: 2021 atau Oktober 2024"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Judul Babak
                </label>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  placeholder="Contoh: Pertemuan Pertama"
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Ikon Milestone
                </label>
                <select
                  value={m.icon || 'Sparkles'}
                  onChange={(e) => handleChange(idx, 'icon', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                >
                  {STORY_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Deskripsi & Cerita
                </label>
                <textarea
                  rows={2}
                  value={m.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  placeholder="Ceritakan momen ini secara singkat dan romantis..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  URL Foto Kenangan
                </label>
                <input
                  type="url"
                  value={m.photoUrl || ''}
                  onChange={(e) => handleChange(idx, 'photoUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
                {m.photoUrl && (
                  <div className="mt-2 h-14 w-24 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                    <img src={m.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
