import { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Heart, 
  Trash2, 
  Download, 
  MessageSquare, 
  Users, 
  Search,
  Filter
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';

export default function RsvpWishesTab() {
  const { rsvps, wishes, deleteRsvp, deleteWish, activeProject } = useWeddingData();
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [wishSearch, setWishSearch] = useState('');

  // Calculations
  const hadirCount = rsvps
    .filter((r) => r.attendance === 'Hadir')
    .reduce((acc, curr) => acc + (curr.paxCount || 1), 0);
  const raguCount = rsvps.filter((r) => r.attendance === 'Masih Ragu').length;
  const tidakHadirCount = rsvps.filter((r) => r.attendance === 'Tidak Hadir').length;

  const filteredRsvps = rsvps.filter((r) =>
    r.guestName.toLowerCase().includes(rsvpSearch.toLowerCase())
  );

  const filteredWishes = wishes.filter(
    (w) =>
      (w.name || w.senderName || '').toLowerCase().includes(wishSearch.toLowerCase()) ||
      (w.message || '').toLowerCase().includes(wishSearch.toLowerCase())
  );

  const handleExportRsvps = () => {
    if (rsvps.length === 0) {
      alert('Belum ada data RSVP untuk diekspor!');
      return;
    }

    const headers = ['Nama Tamu', 'Konfirmasi Kehadiran', 'Jumlah Pax', 'Sesi Acara', 'Catatan / Alergi', 'Waktu Pengisian'];
    const rows = rsvps.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.attendance}"`,
      r.paxCount || 1,
      `"${r.eventSession || r.selectedEventId || 'Semua Sesi'}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.createdAt || r.submittedAt || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-rsvp-${activeProject.slug || 'wedding'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Rekap Konfirmasi Kehadiran (RSVP) & Buku Tamu
          </h3>
          <p className="text-xs text-neutral-400">
            Pantau total kehadiran tamu secara real-time dan kelola ucapan selamat dari para tamu.
          </p>
        </div>

        <button
          onClick={handleExportRsvps}
          className="px-4 py-2 rounded-xl bg-[#1e2436] border border-[#dfb461]/40 text-[#dfb461] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#283048] transition-all cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Rekap RSVP (.CSV)</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121520] border border-emerald-500/30 p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Konfirmasi Hadir</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-300">
            {hadirCount} <span className="text-sm font-normal text-neutral-400">Pax / Orang</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Dari {rsvps.filter((r) => r.attendance === 'Hadir').length} konfirmasi masuk
          </p>
        </div>

        <div className="bg-[#121520] border border-amber-500/30 p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Masih Ragu-Ragu</span>
            <HelpCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-300">
            {raguCount} <span className="text-sm font-normal text-neutral-400">Tamu</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Perlu follow-up konfirmasi lebih lanjut</p>
        </div>

        <div className="bg-[#121520] border border-rose-500/30 p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Tidak Dapat Hadir</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-300">
            {tidakHadirCount} <span className="text-sm font-normal text-neutral-400">Tamu</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Mengirimkan doa dari kejauhan</p>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="font-bold text-neutral-100 text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-[#dfb461]" />
            <span>Tabel Konfirmasi RSVP ({rsvps.length})</span>
          </h4>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={rsvpSearch}
              onChange={(e) => setRsvpSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none w-48"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {filteredRsvps.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs">
            Belum ada data konfirmasi kehadiran yang masuk.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Nama Tamu</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Jumlah Pax</th>
                  <th className="py-3 px-3">Catatan</th>
                  <th className="py-3 px-3">Waktu Masuk</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredRsvps.map((r, rIdx) => (
                  <tr key={r.id || rIdx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-bold text-neutral-200">{r.guestName}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.attendance === 'Hadir'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : r.attendance === 'Masih Ragu'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {r.attendance}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-300">{r.paxCount || 1} Pax</td>
                    <td className="py-3 px-3 text-neutral-400 text-[11px] max-w-xs truncate">
                      {r.notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-[10px] text-neutral-500">{r.createdAt || r.submittedAt || '-'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteRsvp(r.id || rIdx)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wishes Moderation */}
      <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="font-bold text-neutral-100 text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Moderasi Buku Tamu & Doa Restu ({wishes.length})</span>
          </h4>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari pesan / pengirim..."
              value={wishSearch}
              onChange={(e) => setWishSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none w-48"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWishes.map((w) => (
            <div
              key={w.id}
              className="bg-[#0a0c12] border border-neutral-800/80 p-4 rounded-2xl flex flex-col justify-between space-y-2 relative"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-200">{w.name || w.senderName}</span>
                    {w.relation && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">
                        {w.relation}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteWish(w.id)}
                    className="text-neutral-600 hover:text-rose-400 p-1 cursor-pointer"
                    title="Hapus Ucapan"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-neutral-300 mt-2 leading-relaxed italic">
                  "{w.message}"
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
                <span>{w.createdAt || 'Baru saja'}</span>
                <span className="text-rose-400/80">❤️ {w.likes || 0} suka</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
