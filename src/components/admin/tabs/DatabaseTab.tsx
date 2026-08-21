import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Palette, 
  Eye, 
  EyeOff, 
  AlertCircle,
  HelpCircle,
  FileCode2,
  Table,
  Zap
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection 
} from '../../../lib/supabase';
import { syncAllLocalDataToSupabase } from '../../../services/supabaseService';
import { THEMES } from '../../../data/weddingData';
import { LAYOUT_ARCHETYPES } from '../../../data/layoutArchetypes';

export default function DatabaseTab() {
  const { 
    projects, 
    activeProject, 
    isSupabaseConnected, 
    reloadFromSupabase,
    isSyncingWithDb 
  } = useWeddingData();

  const [config, setConfig] = useState(() => getSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [showKey, setShowKey] = useState(false);
  
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingStatus, setSyncingStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [activeSchemaTab, setActiveSchemaTab] = useState<'guide' | 'sql' | 'tables'>('guide');

  useEffect(() => {
    const current = getSupabaseConfig();
    setConfig(current);
    setUrlInput(current.url);
    setKeyInput(current.anonKey);
  }, [isSupabaseConnected]);

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Menghubungkan ke Supabase...');

    const result = await testSupabaseConnection(urlInput, keyInput);
    if (result.success) {
      setTestingStatus('success');
      setTestMessage(result.message);
    } else {
      setTestingStatus('error');
      setTestMessage(result.message);
    }
  };

  const handleSaveConfig = async () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Mohon masukkan URL dan Anon Key Supabase.');
      return;
    }

    setTestingStatus('testing');
    setTestMessage('Menguji dan menyimpan konfigurasi...');

    const result = await testSupabaseConnection(urlInput, keyInput);
    if (result.success) {
      saveSupabaseConfig(urlInput, keyInput);
      setConfig(getSupabaseConfig());
      setTestingStatus('success');
      setTestMessage('Koneksi berhasil! Konfigurasi tersimpan.');
      if (reloadFromSupabase) {
        reloadFromSupabase();
      }
    } else {
      setTestingStatus('error');
      setTestMessage(`Gagal terhubung: ${result.message}`);
    }
  };

  const handleClearConfig = () => {
    if (confirm('Yakin ingin memutuskan koneksi Supabase dan kembali ke penyimpanan lokal?')) {
      clearSupabaseConfig();
      setConfig(getSupabaseConfig());
      setUrlInput('');
      setKeyInput('');
      setTestingStatus('idle');
      setTestMessage('');
      if (reloadFromSupabase) {
        reloadFromSupabase();
      }
    }
  };

  const handleCopySql = async () => {
    try {
      const response = await fetch('/supabase/schema.sql');
      let text = '';
      if (response.ok) {
        text = await response.text();
      }
      if (!text || text.length < 50) {
        // Fallback SQL text schema
        text = `-- Jalankan SQL Schema lengkap dari file /supabase/schema.sql di project Anda`;
      }
      await navigator.clipboard.writeText(text);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      // Fallback
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const handleSyncLocalToCloud = async () => {
    setSyncingStatus('syncing');
    setSyncMessage('Mengunggah seluruh data tema, layout, & project ke Supabase...');

    try {
      const result = await syncAllLocalDataToSupabase(projects, THEMES, LAYOUT_ARCHETYPES);
      if (result.success) {
        setSyncingStatus('success');
        setSyncMessage(result.message);
      } else {
        setSyncingStatus('error');
        setSyncMessage(result.message);
      }
    } catch (err: any) {
      setSyncingStatus('error');
      setSyncMessage(`Terjadi kesalahan: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Integrasi Database Supabase
                {isSupabaseConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Mode Penyimpanan Lokal (Ready to Connect)
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Kelola penyimpanan terpusat untuk 20+ tema, susunan layout dinamis, data undangan, RSVP real-time, dan buku tamu.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSyncLocalToCloud}
            disabled={!config.isConfigured || syncingStatus === 'syncing'}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-lg ${
              config.isConfigured
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <UploadCloud className={`w-4 h-4 ${syncingStatus === 'syncing' ? 'animate-bounce' : ''}`} />
            {syncingStatus === 'syncing' ? 'Menyinkronkan...' : 'Upload Data ke Supabase'}
          </button>

          {config.isConfigured && reloadFromSupabase && (
            <button
              type="button"
              onClick={() => reloadFromSupabase()}
              disabled={isSyncingWithDb}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Muat ulang dari Cloud"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingWithDb ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncMessage && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
          syncingStatus === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : syncingStatus === 'error'
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
        }`}>
          {syncingStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {syncingStatus === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {syncingStatus === 'syncing' && <RefreshCw className="w-5 h-5 text-blue-400 shrink-0 animate-spin mt-0.5" />}
          <div className="text-sm">
            <p className="font-semibold">{syncingStatus === 'success' ? 'Sukses' : syncingStatus === 'error' ? 'Peringatan' : 'Memproses'}</p>
            <p className="mt-0.5 opacity-90">{syncMessage}</p>
          </div>
        </div>
      )}

      {/* Grid: Credentials & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-lg">Kredensial Koneksi Supabase</h3>
            </div>
            {config.source !== 'none' && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                Sumber: {config.source === 'env' ? '.env file' : 'Browser Storage'}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzabcdefg.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">Ditemukan di Supabase Dashboard → Project Settings → API → Project URL</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Supabase Anon / Public Key (API Key)
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 pr-11 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Gunakan key <span className="text-emerald-400 font-mono">anon / public</span>, bukan service_role key demi keamanan browser.</p>
            </div>

            {/* Test result banner */}
            {testMessage && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testingStatus === 'success' 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                  : testingStatus === 'error'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
              }`}>
                {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {testingStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                {testingStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 animate-spin mt-0.5" />}
                <div>{testMessage}</div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={testingStatus === 'testing'}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Simpan & Hubungkan
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingStatus === 'testing' || !urlInput.trim() || !keyInput.trim()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`w-4 h-4 ${testingStatus === 'testing' ? 'animate-spin' : ''}`} />
                Uji Koneksi
              </button>

              {config.isConfigured && (
                <button
                  type="button"
                  onClick={handleClearConfig}
                  className="px-3.5 py-2.5 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-xl text-sm font-medium transition-all ml-auto"
                >
                  Putuskan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cloud Overview Stats (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Status Struktur Data Cloud
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-slate-300">Master Tema (Themes)</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {THEMES.length} Tema Siap Pakai
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Master Layout Archetypes</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {LAYOUT_ARCHETYPES.length} Variasi Layout
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">Undangan Aktif ({activeProject.slug})</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {activeProject.wishes?.length || 0} Ucapan • {activeProject.rsvps?.length || 0} RSVP
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Realtime WebSocket Aktif:</strong> Setiap ucapan atau RSVP yang dikirim tamu di HP/laptop akan otomatis ter-update di layar ini secara langsung tanpa reload!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Setup & Migration Center */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-teal-400" />
              SQL Schema & Seed Script (1-Click Deploy)
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Script otomatis untuk membuat tabel <span className="font-mono text-xs text-slate-300">themes</span>, <span className="font-mono text-xs text-slate-300">layout_archetypes</span>, <span className="font-mono text-xs text-slate-300">wedding_projects</span>, <span className="font-mono text-xs text-slate-300">rsvp_submissions</span>, & <span className="font-mono text-xs text-slate-300">guest_wishes</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySql}
              className="px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedSql ? 'Tersalin ke Clipboard!' : 'Salin Seluruh SQL Schema'}
            </button>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              Buka Supabase Console
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveSchemaTab('guide')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSchemaTab === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Panduan 3 Langkah Cepat
          </button>
          <button
            type="button"
            onClick={() => setActiveSchemaTab('tables')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSchemaTab === 'tables'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            Struktur 6 Tabel Database
          </button>
          <button
            type="button"
            onClick={() => setActiveSchemaTab('sql')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSchemaTab === 'sql'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Preview SQL DDL
          </button>
        </div>

        {/* Tab 1: 3-Step Guide */}
        {activeSchemaTab === 'guide' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h4 className="font-bold text-white text-base mb-1">Buat Project Supabase</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>, login, lalu buat project baru (gratis).
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-900/60 p-2.5 rounded-lg font-mono border border-slate-800">
                Settings → API → Salin Project URL & anon key
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h4 className="font-bold text-white text-base mb-1">Eksekusi SQL Schema</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Di Supabase Dashboard, klik menu <strong>SQL Editor</strong> → New Query, lalu paste file <span className="text-emerald-400 font-mono">supabase/schema.sql</span> dan tekan <strong>RUN</strong>.
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-900/60 p-2.5 rounded-lg font-mono border border-slate-800">
                Semua 20 Tema & 20 Layout otomatis di-insert!
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h4 className="font-bold text-white text-base mb-1">Sambungkan ke Web</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Paste URL & Anon Key pada form di atas, lalu klik <strong>"Simpan & Hubungkan"</strong>. Sistem akan langsung sinkron otomatis.
              </p>
              <div className="text-[11px] text-slate-500 bg-slate-900/60 p-2.5 rounded-lg font-mono border border-slate-800">
                Tamu RSVP & Wishes langsung realtime!
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Database Tables Overview */}
        {activeSchemaTab === 'tables' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">themes</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">20 Baris</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Menyimpan konfigurasi palet warna hex, font gradient, glow, ornamen SVG, dan frame radius.</p>
              <div className="text-[11px] font-mono text-slate-500">primary_color, bg_hex, ornament_type, etc.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">layout_archetypes</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">20 Baris</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Menyimpan struktur layout (heroLayout, coupleCardStyle, eventsStyle) dari Nusantara hingga Luxury.</p>
              <div className="text-[11px] font-mono text-slate-500">hero_layout, couple_card_style, events_style</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">wedding_projects</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Multi-tenant</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Menyimpan data utama undangan masing-masing pasangan (slug URL, acara, foto galeri, profil mempelai).</p>
              <div className="text-[11px] font-mono text-slate-500">slug, client_name, config (JSONB)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">guest_contacts</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">WA Blast</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Buku tamu kontak WhatsApp generator & status pengiriman link undangan personal.</p>
              <div className="text-[11px] font-mono text-slate-500">name, phone, category, is_sent, pax_limit</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">rsvp_submissions</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">⚡ Realtime</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Data konfirmasi kehadiran tamu (Hadir/Tidak Hadir, jumlah pax, pilihan sesi akad/resepsi).</p>
              <div className="text-[11px] font-mono text-slate-500">attendance, pax_count, notes, submitted_at</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">guest_wishes</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">⚡ Realtime</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Buku ucapan doa & selamat dari para tamu lengkap dengan live like counter.</p>
              <div className="text-[11px] font-mono text-slate-500">name, message, status, relation, likes</div>
            </div>
          </div>
        )}

        {/* Tab 3: SQL Code Preview */}
        {activeSchemaTab === 'sql' && (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
{`-- 1. EXTENSIONS & TABLES
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    bg_hex TEXT NOT NULL,
    card_bg_hex TEXT NOT NULL,
    gradient_text TEXT NOT NULL,
    glow_hex TEXT NOT NULL,
    ornament_type TEXT NOT NULL,
    card_radius TEXT NOT NULL DEFAULT 'rounded-2xl',
    frame_style TEXT NOT NULL DEFAULT 'royal-arch',
    default_layout TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.layout_archetypes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    hero_layout TEXT NOT NULL,
    couple_card_style TEXT NOT NULL,
    events_style TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_projects (
    id TEXT PRIMARY KEY DEFAULT ('proj-' || uuid_generate_v4()),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File lengkap berada di: supabase/schema.sql`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
