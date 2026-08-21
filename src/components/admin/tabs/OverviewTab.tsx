import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Heart, 
  Copy, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy as DuplicateIcon,
  Download,
  Upload,
  Clock,
  MapPin,
  Check,
  Palette,
  LayoutGrid,
  Layers,
  Crown
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { THEMES } from '../../../data/weddingData';
import { LAYOUT_ARCHETYPES, getLayoutArchetype } from '../../../data/layoutArchetypes';
import { WeddingTheme, LayoutArchetype } from '../../../types';

export default function OverviewTab({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const { 
    projects, 
    activeProjectId, 
    activeProject, 
    setActiveProjectId, 
    createProject, 
    duplicateProject, 
    deleteProject, 
    updateProjectMeta,
    data,
    guests,
    rsvps,
    wishes,
    setViewMode,
    exportProjectJson,
    importProjectJson
  } = useWeddingData();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newTheme, setNewTheme] = useState<WeddingTheme>('classic-midnight');
  const [newLayout, setNewLayout] = useState<LayoutArchetype>('royal-symmetrical');
  const [modalTab, setModalTab] = useState<'theme' | 'layout'>('theme');
  const [themeFilterCat, setThemeFilterCat] = useState<string>('all');
  const [layoutFilterCat, setLayoutFilterCat] = useState<string>('all');

  // Stats calculation
  const totalGuests = guests.length;
  const sentGuests = guests.filter((g) => g.isSent).length;
  const hadirCount = rsvps.filter((r) => r.attendance === 'Hadir').reduce((acc, curr) => acc + (curr.paxCount || 1), 0);
  const raguCount = rsvps.filter((r) => r.attendance === 'Masih Ragu').length;
  const tidakHadirCount = rsvps.filter((r) => r.attendance === 'Tidak Hadir').length;
  const totalWishes = wishes.length;

  const currentTheme = THEMES.find((t) => t.id === data.theme) || THEMES[0];
  const currentLayout = getLayoutArchetype(data.layoutStyle || currentTheme.defaultLayout || 'royal-symmetrical');

  const selectedNewThemeObj = THEMES.find((t) => t.id === newTheme) || THEMES[0];
  const selectedNewLayoutObj = getLayoutArchetype(newLayout);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const publicShareUrl = `${baseUrl}?job=${activeProject.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectThemeInModal = (themeId: WeddingTheme) => {
    setNewTheme(themeId);
    const thObj = THEMES.find((t) => t.id === themeId);
    if (thObj && thObj.defaultLayout) {
      setNewLayout(thObj.defaultLayout);
    }
  };

  const handleCreateNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createProject(newTitle.trim(), newClient.trim() || newTitle.trim(), newTheme, newLayout);
    setShowNewModal(false);
    setNewTitle('');
    setNewClient('');
    setNewTheme('classic-midnight');
    setNewLayout('royal-symmetrical');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        const res = importProjectJson(text);
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const json = exportProjectJson(activeProjectId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-${activeProject.slug || 'project'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Project Selector & Quick Header */}
      <div className="bg-[#121520] border border-[#dfb461]/30 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40">
                Job Aktif Saat Ini
              </span>
              <span className="text-xs text-neutral-400 font-mono">ID: {activeProject.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-neutral-100">
              {activeProject.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Klien: <strong className="text-neutral-200">{activeProject.clientName}</strong> • Tanggal Update: {activeProject.updatedAt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('invitation')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Tampilan Undangan</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 rounded-xl bg-[#1a1e2e] border border-[#dfb461]/40 text-[#fce09c] text-xs font-semibold flex items-center gap-2 hover:bg-[#252b42] transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Klien'}</span>
            </button>

            <button
              onClick={() => setShowNewModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#1e2334] border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 hover:border-[#dfb461] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#dfb461]" />
              <span>+ Buat Job Baru</span>
            </button>
          </div>
        </div>

        {/* Quick URL & Slug Info */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400 overflow-hidden">
            <span className="text-neutral-500 shrink-0">Tautan Undangan:</span>
            <code className="bg-[#090a10] px-2.5 py-1 rounded-md text-[#dfb461] border border-neutral-800 text-[11px] truncate max-w-md">
              {publicShareUrl}
            </code>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportJson}
              className="text-neutral-400 hover:text-[#dfb461] flex items-center gap-1 text-xs cursor-pointer transition-colors"
              title="Download backup file JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            <label className="text-neutral-400 hover:text-[#dfb461] flex items-center gap-1 text-xs cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Undangan & Terkirim */}
        <div 
          onClick={() => onSwitchTab('guests')}
          className="bg-[#121520] border border-neutral-800 hover:border-[#dfb461]/50 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daftar Tamu</span>
            <Users className="w-4 h-4 text-[#dfb461] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100">
            {totalGuests} <span className="text-xs text-neutral-500 font-normal">orang</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{sentGuests} undangan terkirim</span>
          </div>
        </div>

        {/* Konfirmasi Kehadiran */}
        <div 
          onClick={() => onSwitchTab('rsvps')}
          className="bg-[#121520] border border-neutral-800 hover:border-[#dfb461]/50 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">RSVP Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
            {hadirCount} <span className="text-xs text-neutral-500 font-normal">pax</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {raguCount} ragu • {tidakHadirCount} tidak hadir
          </div>
        </div>

        {/* Doa & Ucapan */}
        <div 
          onClick={() => onSwitchTab('rsvps')}
          className="bg-[#121520] border border-neutral-800 hover:border-[#dfb461]/50 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ucapan & Doa</span>
            <Heart className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-100">
            {totalWishes} <span className="text-xs text-neutral-500 font-normal">pesan</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Buku tamu interaktif aktif
          </div>
        </div>

        {/* Tema & Warna Aktif */}
        <div 
          onClick={() => onSwitchTab('theme')}
          className="bg-[#121520] border border-neutral-800 hover:border-[#dfb461]/50 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tema Aktif</span>
            <Sparkles className="w-4 h-4 text-[#dfb461] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-bold text-neutral-100 truncate">
            {currentTheme.name}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentTheme.primaryColor }} />
            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentTheme.secondaryColor }} />
            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentTheme.bgHex }} />
            <span className="text-[10px] text-neutral-400 ml-1">Ubah Tema &rarr;</span>
          </div>
        </div>
      </div>

      {/* List of All Saved Wedding Jobs */}
      <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-100 font-serif-luxury text-lg">
              Daftar Semua Job / Pesanan Undangan Klien
            </h3>
            <p className="text-xs text-neutral-400">
              Pilih job untuk mengedit isi nama, foto, acara, tema, dan kelola tamu undangan.
            </p>
          </div>
          <span className="text-xs font-mono bg-neutral-800 px-2.5 py-1 rounded-lg text-neutral-300">
            Total: {projects.length} Job
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const isCurrent = proj.id === activeProjectId;
            const projTheme = THEMES.find((t) => t.id === proj.config?.theme) || THEMES[0];
            const eventCount = proj.config?.events?.length || 0;
            const guestCount = proj.guests?.length || 0;

            return (
              <div
                key={proj.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                  isCurrent
                    ? 'bg-[#181d2c] border-[#dfb461] shadow-lg shadow-[#dfb461]/10'
                    : 'bg-[#0f1118] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-neutral-300">
                        {proj.clientName}
                      </span>
                      <h4 className="font-bold text-neutral-100 text-sm mt-1 line-clamp-1">
                        {proj.title}
                      </h4>
                    </div>

                    {isCurrent && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dfb461] text-neutral-950">
                        Aktif
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 my-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#dfb461]" />
                      <span>{new Date(proj.config.weddingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="truncate">{proj.config.cityLocation || 'Indonesia'}</span>
                    </div>

                    {/* Theme & Layout Info */}
                    <div className="pt-2 border-t border-neutral-800/60 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 truncate bg-[#07090f] px-2 py-1 rounded-md border border-neutral-800">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20" 
                          style={{ backgroundColor: projTheme.primaryColor }}
                        />
                        <span className="truncate text-neutral-300 font-medium">{projTheme.name}</span>
                      </div>

                      {(() => {
                        const projLayout = getLayoutArchetype(proj.config?.layoutStyle || projTheme.defaultLayout || 'royal-symmetrical');
                        return (
                          <div className="flex items-center gap-1.5 truncate bg-[#07090f] px-2 py-1 rounded-md border border-neutral-800" title={projLayout.name}>
                            <LayoutGrid className="w-3 h-3 text-[#dfb461] shrink-0" />
                            <span className="truncate text-neutral-300 font-medium">{projLayout.name}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  {!isCurrent ? (
                    <button
                      onClick={() => setActiveProjectId(proj.id)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#dfb461]/20 border border-[#dfb461]/40 text-[#dfb461] hover:bg-[#dfb461] hover:text-neutral-950 text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      Pilih Job Ini
                    </button>
                  ) : (
                    <button
                      onClick={() => onSwitchTab('couple')}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#dfb461] text-neutral-950 text-xs font-bold hover:brightness-110 transition-all cursor-pointer text-center"
                    >
                      Edit Data Pengantin
                    </button>
                  )}

                  <button
                    onClick={() => duplicateProject(proj.id)}
                    className="p-2 rounded-lg bg-[#141722] text-neutral-400 hover:text-[#dfb461] hover:bg-[#1f2436] transition-colors cursor-pointer"
                    title="Duplikat Job Ini"
                  >
                    <DuplicateIcon className="w-3.5 h-3.5" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Hapus job "${proj.title}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-[#141722] text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Hapus Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Buat Job Baru */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121520] border border-[#dfb461]/40 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl my-8 relative">
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40">
                  New Client Order
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
                  Buat Job / Pesanan Undangan Baru
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tentukan data pengantin serta kombinasi tema warna dan struktur tata letak undangan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewJob} className="space-y-4">
              {/* Form Input Dasar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Judul Undangan / Pasangan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: The Wedding of Kevin & Natasha"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nama Klien / Domisili Kota
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kevin & Natasha (Surabaya)"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>
              </div>

              {/* Selection Summary Pill */}
              <div className="p-3 rounded-2xl bg-[#090b11] border border-[#dfb461]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-medium">Tema:</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: selectedNewThemeObj.primaryColor }}
                    />
                    <strong className="text-neutral-100 font-semibold">{selectedNewThemeObj.name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-medium">Layout:</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#dfb461]/15 border border-[#dfb461]/40 text-[#f6d78a]">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#dfb461]" />
                    <strong>{selectedNewLayoutObj.name}</strong>
                    <span className="text-[10px] text-neutral-400">({selectedNewLayoutObj.category})</span>
                  </div>
                </div>
              </div>

              {/* Tab Selector: Theme vs Layout */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 bg-[#090b10] p-1 rounded-2xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setModalTab('theme')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      modalTab === 'theme'
                        ? 'bg-[#dfb461] text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Pilih 24 Tema Warna</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab('layout')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      modalTab === 'layout'
                        ? 'bg-[#dfb461] text-neutral-950 shadow-md'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Pilih 22+ Struktur Layout</span>
                  </button>
                </div>

                {/* Sub Tab: Theme Selection */}
                {modalTab === 'theme' && (
                  <div className="space-y-2.5">
                    {/* Theme Filter Categories */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                      {['all', 'Signature Luxury', 'Botanical Nature', 'Romantic Floral', 'Ocean & Sapphire', 'Heritage Nusantara', 'Modern Editorial'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setThemeFilterCat(cat)}
                          className={`px-2.5 py-1 rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
                            themeFilterCat === cat
                              ? 'bg-neutral-200 text-neutral-950 border-white font-bold'
                              : 'bg-[#090b10] text-neutral-400 border-neutral-800 hover:text-neutral-200'
                          }`}
                        >
                          {cat === 'all' ? 'Semua Kategori (24)' : cat}
                        </button>
                      ))}
                    </div>

                    {/* Themes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-neutral-800/80 rounded-2xl bg-[#090b10]">
                      {THEMES.filter((th) => themeFilterCat === 'all' || th.category === themeFilterCat).map((th) => (
                        <button
                          type="button"
                          key={th.id}
                          onClick={() => handleSelectThemeInModal(th.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            newTheme === th.id
                              ? 'border-[#dfb461] bg-[#1a1e2d] shadow-sm ring-1 ring-[#dfb461]'
                              : 'border-neutral-800/60 bg-[#0c0e16] hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div
                              className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-xs"
                              style={{ backgroundColor: th.primaryColor }}
                            />
                            <div className="truncate">
                              <div className="text-xs font-semibold text-neutral-200 truncate">{th.name}</div>
                              <div className="text-[10px] text-neutral-500 truncate">{th.category}</div>
                            </div>
                          </div>
                          {newTheme === th.id && (
                            <Check className="w-4 h-4 text-[#dfb461] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-400 italic">
                      * Memilih tema akan otomatis mengatur struktur layout bawaan tema, namun Anda bebas mengganti layout di tab sebelah.
                    </p>
                  </div>
                )}

                {/* Sub Tab: Layout Selection */}
                {modalTab === 'layout' && (
                  <div className="space-y-2.5">
                    {/* Layout Filter Categories */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                      {['all', 'Imperial Luxury', 'Adat Nusantara', 'Modern & Editorial', 'Nature & Botanical', 'Romantic & Celestial'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setLayoutFilterCat(cat)}
                          className={`px-2.5 py-1 rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
                            layoutFilterCat === cat
                              ? 'bg-[#dfb461] text-neutral-950 border-[#dfb461] font-bold'
                              : 'bg-[#090b10] text-neutral-400 border-neutral-800 hover:text-neutral-200'
                          }`}
                        >
                          {cat === 'all' ? 'Semua Layout (22+)' : cat}
                        </button>
                      ))}
                    </div>

                    {/* Layouts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-neutral-800/80 rounded-2xl bg-[#090b10]">
                      {LAYOUT_ARCHETYPES.filter((l) => layoutFilterCat === 'all' || l.category === layoutFilterCat).map((l) => {
                        const isSelected = newLayout === l.id;
                        return (
                          <button
                            type="button"
                            key={l.id}
                            onClick={() => setNewLayout(l.id as LayoutArchetype)}
                            className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1.5 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#dfb461] bg-[#1a1e2d] shadow-sm ring-1 ring-[#dfb461]'
                                : 'border-neutral-800/60 bg-[#0c0e16] hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold text-neutral-200 truncate">{l.name}</span>
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-[#dfb461] shrink-0" />
                              ) : (
                                l.culturalTag && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 truncate">
                                    {l.culturalTag}
                                  </span>
                                )
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-400 line-clamp-1">
                              {l.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold hover:brightness-110 cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-neutral-950" />
                  <span>Buat Job Undangan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
