import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Phone,
  FileText
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { GuestContact } from '../../../types';

export default function GuestsBlastTab() {
  const { 
    guests, 
    addGuest, 
    addBatchGuests, 
    updateGuest, 
    deleteGuest, 
    toggleGuestSent, 
    clearAllGuests,
    data,
    activeProject
  } = useWeddingData();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add single guest modal/form
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleCategory, setSingleCategory] = useState<GuestContact['category']>('Umum');
  const [singlePax, setSinglePax] = useState<number>(2);

  // Batch paste modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchNames, setBatchNames] = useState('');
  const [batchCategory, setBatchCategory] = useState<GuestContact['category']>('Umum');
  const [batchPax, setBatchPax] = useState<number>(2);

  // Template WA text
  const [waTemplate, setWaTemplate] = useState<string>(
    `Kepada Yth. {nama_tamu}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

💍 *The Wedding of {mempelai}*
📅 Tanggal: {tanggal}
📍 Lokasi: {venue}

Untuk melihat rincian acara, galeri, dan konfirmasi kehadiran (RSVP), silakan buka tautan undangan digital berikut:
👉 {link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.

Terima kasih,
*{mempelai}*`
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const coupleNames = `${data.groom?.name || 'Mempelai Pria'} & ${data.bride?.name || 'Mempelai Wanita'}`;
  const weddingDateStr = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Sabtu, 24 Oktober 2026';
  const mainVenue = data.events?.[0]?.venueName || 'The Venue';

  // Helper to generate personalized message
  const generateMessage = (guest: GuestContact) => {
    const inviteLink = `${baseUrl}?to=${encodeURIComponent(guest.name)}&job=${activeProject.slug}`;
    return waTemplate
      .replace(/{nama_tamu}/g, guest.name)
      .replace(/{mempelai}/g, coupleNames)
      .replace(/{tanggal}/g, weddingDateStr)
      .replace(/{venue}/g, mainVenue)
      .replace(/{link}/g, inviteLink);
  };

  const handleSendWhatsApp = (guest: GuestContact) => {
    const message = generateMessage(guest);
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      formattedPhone = '62' + cleanPhone;
    }

    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
    if (!guest.isSent) {
      toggleGuestSent(guest.id);
    }
  };

  const handleCopyLink = (guest: GuestContact) => {
    const link = `${baseUrl}?to=${encodeURIComponent(guest.name)}&job=${activeProject.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFormattedMessage = (guest: GuestContact) => {
    const message = generateMessage(guest);
    navigator.clipboard.writeText(message);
    setCopiedMsgId(guest.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleName.trim()) return;

    addGuest({
      name: singleName.trim(),
      phone: singlePhone.trim(),
      category: singleCategory,
      paxLimit: singlePax,
      isSent: false,
    });

    setSingleName('');
    setSinglePhone('');
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNames.trim()) return;

    const count = addBatchGuests(batchNames, batchCategory, batchPax);
    setShowBatchModal(false);
    setBatchNames('');
    alert(`Berhasil menambahkan ${count} nama tamu undangan secara massal!`);
  };

  // Export CSV
  const handleExportCsv = () => {
    if (guests.length === 0) {
      alert('Belum ada data tamu undangan untuk diekspor!');
      return;
    }

    const headers = ['Nama Tamu', 'Kategori', 'No Telepon', 'Batas Pax', 'Status Pengiriman', 'Tautan Undangan'];
    const rows = guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.category}"`,
      `"${g.phone || ''}"`,
      g.paxLimit || 2,
      g.isSent ? 'Terkirim' : 'Belum Kirim',
      `"${baseUrl}?to=${encodeURIComponent(g.name)}&job=${activeProject.slug}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daftar-tamu-${activeProject.slug || 'wedding'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchQuery = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || (g.phone && g.phone.includes(searchQuery));
      const matchCat = categoryFilter === 'all' || g.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'sent' ? g.isSent : !g.isSent);
      return matchQuery && matchCat && matchStatus;
    });
  }, [guests, searchQuery, categoryFilter, statusFilter]);

  const sentCount = guests.filter((g) => g.isSent).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
            Generator Link Tamu & WhatsApp Blast
          </h3>
          <p className="text-xs text-neutral-400">
            Buat link personalisasi nama tamu (`?to=Nama+Tamu`), kirim pesan WA 1-klik, dan export data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1e2436] border border-[#dfb461]/40 text-[#dfb461] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#283048] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tempel Massal (Batch Paste)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-[#141722] border border-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 hover:border-[#dfb461] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. Add Single Guest Bar */}
      <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb461] mb-3">
          Tambah Satu Tamu Undangan
        </h4>

        <form onSubmit={handleAddSingle} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <input
              type="text"
              required
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Nama Tamu (Contoh: Bpk. Ridwan & Keluarga)"
              className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="tel"
              value={singlePhone}
              onChange={(e) => setSinglePhone(e.target.value)}
              placeholder="No WA (0812...)"
              className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={singleCategory}
              onChange={(e) => setSingleCategory(e.target.value as GuestContact['category'])}
              className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
            >
              <option value="VIP">VIP</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Tamu</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. WhatsApp Message Template Customizer */}
      <details className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 shadow-xl group">
        <summary className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between cursor-pointer list-none">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#dfb461]" />
            <span>Kustomisasi Format Pesan WhatsApp Blast</span>
          </div>
          <span className="text-[11px] text-[#dfb461] group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>

        <div className="pt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="text-neutral-400">Variabel Tersedia:</span>
            <code className="bg-black px-1.5 py-0.5 rounded text-[#dfb461]">{"{nama_tamu}"}</code>
            <code className="bg-black px-1.5 py-0.5 rounded text-[#dfb461]">{"{mempelai}"}</code>
            <code className="bg-black px-1.5 py-0.5 rounded text-[#dfb461]">{"{tanggal}"}</code>
            <code className="bg-black px-1.5 py-0.5 rounded text-[#dfb461]">{"{venue}"}</code>
            <code className="bg-black px-1.5 py-0.5 rounded text-[#dfb461]">{"{link}"}</code>
          </div>

          <textarea
            rows={7}
            value={waTemplate}
            onChange={(e) => setWaTemplate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 font-mono leading-relaxed focus:border-[#dfb461] focus:outline-none"
          />
        </div>
      </details>

      {/* 3. Guests List Table & Search */}
      <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-neutral-100 text-base">Daftar Tamu Undangan</h4>
            <span className="text-xs font-mono bg-neutral-800 px-2 py-0.5 rounded-md text-neutral-300">
              {sentCount} / {guests.length} Terkirim
            </span>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama / telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none w-44"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              <option value="VIP">VIP</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="Umum">Umum</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="sent">Sudah Kirim</option>
              <option value="unsent">Belum Kirim</option>
            </select>
          </div>
        </div>

        {/* Table / List */}
        {filteredGuests.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 text-xs">
            {guests.length === 0
              ? 'Belum ada tamu yang ditambahkan. Silakan tambah tamu atau gunakan tombol "Tempel Massal".'
              : 'Tidak ada tamu yang cocok dengan pencarian / filter Anda.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Nama Tamu</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">WhatsApp</th>
                  <th className="py-3 px-3 text-right">Aksi Kirim / Salin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredGuests.map((g) => {
                  const isCopied = copiedId === g.id;
                  const isCopiedMsg = copiedMsgId === g.id;

                  return (
                    <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Checkbox Sent Status */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleGuestSent(g.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                            g.isSent
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-neutral-700 text-transparent hover:border-neutral-500'
                          }`}
                          title={g.isSent ? 'Tandai Belum Kirim' : 'Tandai Terkirim'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Guest Name & Link */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-100">{g.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate max-w-xs">
                          ?to={encodeURIComponent(g.name)}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-neutral-300">
                          {g.category}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 text-neutral-300 font-mono">
                        {g.phone || <span className="text-neutral-600">-</span>}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send WhatsApp Direct */}
                          <button
                            onClick={() => handleSendWhatsApp(g)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Kirim Pesan WhatsApp Langsung"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA</span>
                          </button>

                          {/* Copy Link Only */}
                          <button
                            onClick={() => handleCopyLink(g)}
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-[#dfb461] hover:bg-neutral-700 transition-colors cursor-pointer"
                            title="Salin Link Personalisasi"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {/* Copy Formatted Text */}
                          <button
                            onClick={() => handleCopyFormattedMessage(g)}
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-[#dfb461] hover:bg-neutral-700 transition-colors cursor-pointer"
                            title="Salin Teks Lengkap Pesan WA"
                          >
                            {isCopiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteGuest(g.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                            title="Hapus Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Batch Paste */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121520] border border-[#dfb461]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="font-serif-luxury text-2xl font-bold text-neutral-100 mb-1">
              Tempel Daftar Tamu Massal (Batch Paste)
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Tempel daftar nama tamu di bawah ini, satu nama per baris (copy-paste langsung dari Excel / WhatsApp).
            </p>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value as GuestContact['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Batas Kuota / Pax Default
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={batchPax}
                    onChange={(e) => setBatchPax(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Daftar Nama (1 Baris = 1 Tamu)
                </label>
                <textarea
                  rows={8}
                  required
                  value={batchNames}
                  onChange={(e) => setBatchNames(e.target.value)}
                  placeholder={`Contoh:\nBpk. Bambang Sutrisno & Keluarga\nDr. Hendra Wijaya\nRaditya & Anissa\nKeluarga Besar Bpk. Subroto`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 font-mono focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold hover:brightness-110 cursor-pointer shadow-lg"
                >
                  Tambahkan Semua Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
