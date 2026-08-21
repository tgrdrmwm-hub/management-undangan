import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Video, 
  Sparkles, 
  Check,
  Palette
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { WeddingEvent } from '../../../types';

export default function EventsTab() {
  const { data, updateData } = useWeddingData();
  const events = data.events || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdateEvents = (newEvents: WeddingEvent[]) => {
    updateData({ events: newEvents });
  };

  const handleAddEvent = () => {
    const newEv: WeddingEvent = {
      id: 'event-' + Date.now(),
      title: 'Resepsi Pernikahan',
      subtitle: 'Perayaan Syukuran & Doa Bersama',
      dateString: 'Sabtu, 24 Oktober 2026',
      timeRange: '19.00 - 21.00 WIB',
      venueName: 'Grand Ballroom Hotel',
      address: 'Jl. Utama No. 1, Kota',
      googleMapsUrl: 'https://maps.google.com',
      calendarEventTitle: 'Resepsi Pernikahan',
      dresscode: 'Formal / Batik Elegan',
      dresscodeColors: [
        { name: 'Gold', hex: '#dfb461' },
        { name: 'Emerald', hex: '#164e3b' },
      ],
      isVirtualAvailable: false,
    };
    handleUpdateEvents([...events, newEv]);
    setEditingIndex(events.length);
  };

  const handleDeleteEvent = (index: number) => {
    if (confirm('Hapus sesi acara ini?')) {
      const updated = events.filter((_, i) => i !== index);
      handleUpdateEvents(updated);
      setEditingIndex(null);
    }
  };

  const handleFieldChange = (index: number, field: keyof WeddingEvent, value: any) => {
    const updated = [...events];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleUpdateEvents(updated);
  };

  const handleAddColor = (eventIdx: number) => {
    const ev = events[eventIdx];
    const newColors = [...(ev.dresscodeColors || []), { name: 'Warna Baru', hex: '#dfb461' }];
    handleFieldChange(eventIdx, 'dresscodeColors', newColors);
  };

  const handleRemoveColor = (eventIdx: number, colorIdx: number) => {
    const ev = events[eventIdx];
    const newColors = (ev.dresscodeColors || []).filter((_, i) => i !== colorIdx);
    handleFieldChange(eventIdx, 'dresscodeColors', newColors);
  };

  const handleColorChange = (eventIdx: number, colorIdx: number, key: 'name' | 'hex', val: string) => {
    const ev = events[eventIdx];
    const newColors = [...(ev.dresscodeColors || [])];
    newColors[colorIdx] = {
      ...newColors[colorIdx],
      [key]: val,
    };
    handleFieldChange(eventIdx, 'dresscodeColors', newColors);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Rangkaian Sesi Acara (Akad & Resepsi)
          </h3>
          <p className="text-xs text-neutral-400">
            Atur waktu, lokasi gedung, tautan Google Maps navigasi, dresscode, dan siaran langsung.
          </p>
        </div>

        <button
          onClick={handleAddEvent}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Acara Baru</span>
        </button>
      </div>

      {/* Events List Cards */}
      <div className="space-y-4">
        {events.map((ev, idx) => {
          return (
            <div
              key={ev.id || idx}
              className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#dfb461]/20 text-[#dfb461] flex items-center justify-center font-mono font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-neutral-100 text-base">{ev.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(idx)}
                      className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-colors cursor-pointer"
                      title="Hapus Acara"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nama / Judul Acara
                  </label>
                  <input
                    type="text"
                    value={ev.title}
                    onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                    placeholder="Contoh: Akad Nikah / Pemberkatan / Resepsi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Sub-judul / Tagline Acara
                  </label>
                  <input
                    type="text"
                    value={ev.subtitle || ''}
                    onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                    placeholder="Contoh: Momen Sakral Ikrar Suci"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Format Tanggal Tertulis
                  </label>
                  <input
                    type="text"
                    value={ev.dateString}
                    onChange={(e) => handleFieldChange(idx, 'dateString', e.target.value)}
                    placeholder="Sabtu, 24 Oktober 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Waktu / Jam Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={ev.timeRange}
                    onChange={(e) => handleFieldChange(idx, 'timeRange', e.target.value)}
                    placeholder="08.00 - 10.00 WIB / Selesai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nama Gedung / Venue / Tempat
                  </label>
                  <input
                    type="text"
                    value={ev.venueName}
                    onChange={(e) => handleFieldChange(idx, 'venueName', e.target.value)}
                    placeholder="Grand Ballroom The Dharmawangsa"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tautan Google Maps Lokasi
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={ev.googleMapsUrl}
                      onChange={(e) => handleFieldChange(idx, 'googleMapsUrl', e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Alamat Lengkap Venue
                  </label>
                  <textarea
                    rows={2}
                    value={ev.address}
                    onChange={(e) => handleFieldChange(idx, 'address', e.target.value)}
                    placeholder="Jl. Brawijaya Raya No. 26, Kebayoran Baru, Jakarta Selatan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Petunjuk Dresscode
                  </label>
                  <input
                    type="text"
                    value={ev.dresscode || ''}
                    onChange={(e) => handleFieldChange(idx, 'dresscode', e.target.value)}
                    placeholder="Contoh: Formal Batik / Kebaya Modern"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                {/* Dresscode Colors Palette */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Palet Warna Pakaian (Dresscode)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddColor(idx)}
                      className="text-[11px] text-[#dfb461] hover:underline cursor-pointer"
                    >
                      + Tambah Warna
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(ev.dresscodeColors || []).map((col, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center gap-1.5 bg-[#0a0c12] border border-neutral-700 px-2 py-1 rounded-lg text-xs"
                      >
                        <input
                          type="color"
                          value={col.hex}
                          onChange={(e) => handleColorChange(idx, cIdx, 'hex', e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleColorChange(idx, cIdx, 'name', e.target.value)}
                          className="w-20 bg-transparent text-[11px] text-neutral-200 focus:outline-none"
                          placeholder="Nama Warna"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx, cIdx)}
                          className="text-neutral-500 hover:text-rose-400 text-xs px-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Virtual Livestream */}
                <div className="md:col-span-2 pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ev.isVirtualAvailable || false}
                      onChange={(e) => handleFieldChange(idx, 'isVirtualAvailable', e.target.checked)}
                      className="rounded bg-[#0a0c12] border-neutral-700 text-[#dfb461] focus:ring-0"
                    />
                    <span>Sediakan Tombol Siaran Langsung (Virtual Live Stream)</span>
                  </label>

                  {ev.isVirtualAvailable && (
                    <div className="flex-1 sm:max-w-md">
                      <input
                        type="url"
                        value={ev.virtualStreamUrl || ''}
                        onChange={(e) => handleFieldChange(idx, 'virtualStreamUrl', e.target.value)}
                        placeholder="Link YouTube Live / Zoom / Instagram Live"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
