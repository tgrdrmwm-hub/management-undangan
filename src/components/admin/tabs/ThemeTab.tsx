import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Music, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Check, 
  Volume2, 
  Flower2, 
  Palette,
  Search,
  SlidersHorizontal,
  Eye,
  Heart,
  LayoutGrid,
  Columns,
  Layers,
  Crown,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useWeddingData } from '../../../context/WeddingDataContext';
import { THEMES, HOLY_QUOTE_PRESETS } from '../../../data/weddingData';
import { LAYOUT_ARCHETYPES, getLayoutArchetype } from '../../../data/layoutArchetypes';
import { PetalType, WeddingTheme, LayoutArchetype } from '../../../types';

export default function ThemeTab() {
  const { data, updateData, setViewMode } = useWeddingData();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'themes' | 'layouts' | 'extras'>('themes');
  
  // Theme filters
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<string>('all');
  const [themeSearchQuery, setThemeSearchQuery] = useState<string>('');

  // Layout filters
  const [selectedLayoutCategory, setSelectedLayoutCategory] = useState<string>('all');
  const [layoutSearchQuery, setLayoutSearchQuery] = useState<string>('');

  const handleUpdate = (partial: any) => {
    updateData(partial);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSelectQuotePreset = (preset: (typeof HOLY_QUOTE_PRESETS)[0]) => {
    handleUpdate({
      holyQuote: {
        surah: preset.surah,
        text: preset.text,
      },
    });
  };

  // Theme Categories list
  const themeCategories = useMemo(() => {
    const set = new Set<string>();
    THEMES.forEach((t) => set.add(t.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered themes
  const filteredThemes = useMemo(() => {
    return THEMES.filter((theme) => {
      const matchCat = selectedThemeCategory === 'all' || theme.category === selectedThemeCategory;
      const matchSearch = 
        theme.name.toLowerCase().includes(themeSearchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(themeSearchQuery.toLowerCase()) ||
        theme.category.toLowerCase().includes(themeSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedThemeCategory, themeSearchQuery]);

  // Layout Categories list
  const layoutCategories = useMemo(() => {
    const set = new Set<string>();
    LAYOUT_ARCHETYPES.forEach((l) => set.add(l.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered layouts
  const filteredLayouts = useMemo(() => {
    return LAYOUT_ARCHETYPES.filter((layout) => {
      const matchCat = selectedLayoutCategory === 'all' || layout.category === selectedLayoutCategory;
      const matchSearch = 
        layout.name.toLowerCase().includes(layoutSearchQuery.toLowerCase()) ||
        layout.description.toLowerCase().includes(layoutSearchQuery.toLowerCase()) ||
        layout.category.toLowerCase().includes(layoutSearchQuery.toLowerCase()) ||
        (layout.culturalTag && layout.culturalTag.toLowerCase().includes(layoutSearchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedLayoutCategory, layoutSearchQuery]);

  const activeThemeObj = useMemo(() => {
    return THEMES.find((t) => t.id === (data.theme || 'classic-midnight')) || THEMES[0];
  }, [data.theme]);

  const activeLayoutObj = useMemo(() => {
    const layoutId = data.layoutStyle || activeThemeObj.defaultLayout || 'royal-symmetrical';
    return getLayoutArchetype(layoutId);
  }, [data.layoutStyle, activeThemeObj]);

  const themeCategoryLabels: Record<string, string> = {
    all: `Semua Tema (${THEMES.length})`,
    'Signature Luxury': 'Signature Luxury (4)',
    'Botanical Nature': 'Botanical Nature (4)',
    'Romantic Floral': 'Romantic Floral (5)',
    'Ocean & Sapphire': 'Ocean & Sapphire (4)',
    'Heritage Nusantara': 'Heritage Nusantara (5)',
    'Modern Editorial': 'Modern Editorial (4)',
  };

  const layoutCategoryLabels: Record<string, string> = {
    all: `Semua Layout (${LAYOUT_ARCHETYPES.length})`,
    'Imperial Luxury': 'Imperial Luxury (4)',
    'Adat Nusantara': 'Adat Nusantara (5)',
    'Modern & Editorial': 'Modern & Editorial (5)',
    'Nature & Botanical': 'Nature & Botanical (4)',
    'Romantic & Celestial': 'Romantic & Celestial (4)',
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold font-serif-luxury text-neutral-100">
              Desain, 24 Tema & 22+ Layout Berbeda
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Kombinasikan bebas 24 palet tema warna dengan 22 layout struktur independen!
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 animate-fade-in self-start sm:self-auto shadow-md">
            <Check className="w-4 h-4" />
            Pengaturan Berhasil Diterapkan!
          </span>
        )}
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0e111a] border border-neutral-800 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('themes')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'themes'
              ? 'bg-[#dfb461] text-neutral-950 shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>24 Tema Warna</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">24</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('layouts')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'layouts'
              ? 'bg-[#dfb461] text-neutral-950 shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>22+ Struktur Layout</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">{LAYOUT_ARCHETYPES.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('extras')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'extras'
              ? 'bg-[#dfb461] text-neutral-950 shadow-lg'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Animasi, BGM & Doa</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: 24 THEMES PALETTE
         ========================================================================= */}
      {activeSubTab === 'themes' && (
        <div className="space-y-6">
          {/* Active Theme Summary Card */}
          <div className="p-5 sm:p-6 rounded-3xl border border-[#dfb461]/30 bg-gradient-to-r from-[#121522] via-[#161a29] to-[#121522] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#dfb461]/10 blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40">
                    Tema Aktif Saat Ini
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    Kategori: <strong className="text-neutral-200">{activeThemeObj.category}</strong>
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100">
                  {activeThemeObj.name}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  {activeThemeObj.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-neutral-800 text-xs">
                    <span className="text-neutral-400">Palet Warna:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: activeThemeObj.primaryColor }} title={`Primary: ${activeThemeObj.primaryColor}`} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: activeThemeObj.secondaryColor }} title={`Secondary: ${activeThemeObj.secondaryColor}`} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: activeThemeObj.cardBgHex }} title={`Card: ${activeThemeObj.cardBgHex}`} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: activeThemeObj.bgHex }} title={`Background: ${activeThemeObj.bgHex}`} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('invitation')}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#dfb461]" />
                    <span>Lihat Live di Undangan</span>
                  </button>
                </div>
              </div>

              {/* Theme Live Preview Swatch */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 shadow-inner text-center" style={{ backgroundColor: activeThemeObj.bgHex }}>
                <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 shadow-lg" style={{ borderColor: activeThemeObj.primaryColor, backgroundColor: activeThemeObj.cardBgHex, color: activeThemeObj.primaryColor }}>
                  <Crown className="w-5 h-5" />
                </div>
                <span className="font-serif-luxury text-sm font-bold" style={{ color: activeThemeObj.primaryColor }}>Preview Palet</span>
                <span className="text-[10px] text-neutral-300">{activeThemeObj.fontStyle} Typography</span>
              </div>
            </div>
          </div>

          {/* Theme Search & Category Filter */}
          <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={themeSearchQuery}
                  onChange={(e) => setThemeSearchQuery(e.target.value)}
                  placeholder="Cari dari 24 tema (contoh: Javanese, Emerald, Sapphire, Velvet, Rose)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a0c12] border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461]"
                />
                {themeSearchQuery && (
                  <button
                    onClick={() => setThemeSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {themeCategories.map((cat) => {
                const isCatActive = selectedThemeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedThemeCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isCatActive
                        ? 'bg-[#dfb461] text-neutral-950 border-[#dfb461] shadow-md font-bold'
                        : 'bg-[#0a0c12] border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {themeCategoryLabels[cat] || cat}
                  </button>
                );
              })}
            </div>

            {/* 24 Themes Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
              {filteredThemes.map((theme) => {
                const isSelected = (data.theme || 'classic-midnight') === theme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => handleUpdate({ theme: theme.id as WeddingTheme })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#181d2e] border-[#dfb461] shadow-xl shadow-[#dfb461]/20 ring-2 ring-[#dfb461]/40'
                        : 'bg-[#0b0d14] border-neutral-800 hover:border-neutral-700 hover:bg-[#10131d]'
                    }`}
                  >
                    <div>
                      {/* Theme Gradient Preview Strip */}
                      <div 
                        className="h-20 rounded-xl mb-3 p-3 flex flex-col justify-between border border-white/10 relative overflow-hidden transition-transform group-hover:scale-[1.02]" 
                        style={{ backgroundColor: theme.bgHex }}
                      >
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/50 text-neutral-200 backdrop-blur-sm">
                              {theme.category}
                            </span>
                            {theme.culturalLabel && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-200 border border-amber-500/30">
                                {theme.culturalLabel}
                              </span>
                            )}
                          </div>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#dfb461] text-neutral-950 flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Pilih
                            </span>
                          )}
                        </div>

                        {/* Color Swatch Dots & Ornament type */}
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: theme.primaryColor }} title={`Primary: ${theme.primaryColor}`} />
                            <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: theme.secondaryColor }} title={`Secondary: ${theme.secondaryColor}`} />
                            <div className="w-4 h-4 rounded-full border border-white/40 shadow-xs" style={{ backgroundColor: theme.cardBgHex }} title={`Card: ${theme.cardBgHex}`} />
                          </div>
                          {theme.ornamentType && (
                            <span className="text-[8px] font-mono uppercase tracking-wider text-white/70 px-1 rounded bg-black/40">
                              {theme.ornamentType}
                            </span>
                          )}
                        </div>

                        {/* Subtle inner background shine */}
                        <div 
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{ background: `radial-gradient(circle at top right, ${theme.primaryColor}, transparent 70%)` }}
                        />
                      </div>

                      <h5 className="font-bold text-neutral-100 text-sm flex items-center justify-between">
                        <span>{theme.name}</span>
                      </h5>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500 font-mono text-[10px]">{theme.primaryColor}</span>
                      <span className={isSelected ? 'text-[#dfb461] font-bold' : 'text-neutral-400 group-hover:text-neutral-200'}>
                        {isSelected ? '✓ Sedang Dipakai' : 'Gunakan Tema'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: 22+ DISTINCT STRUCTURAL LAYOUT ARCHETYPES
         ========================================================================= */}
      {activeSubTab === 'layouts' && (
        <div className="space-y-6">
          {/* Active Layout Summary Highlight */}
          <div className="p-5 sm:p-6 rounded-3xl border border-[#dfb461]/30 bg-gradient-to-r from-[#141824] via-[#1a2030] to-[#141824] shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40">
                    Layout Aktif Saat Ini
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    Kategori: <strong className="text-neutral-200">{activeLayoutObj.category}</strong>
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100">
                  {activeLayoutObj.name}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  {activeLayoutObj.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-black/40 text-neutral-300 border border-neutral-800">
                    Hero: <strong className="text-[#dfb461]">{activeLayoutObj.heroLayout}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/40 text-neutral-300 border border-neutral-800">
                    Couple: <strong className="text-[#dfb461]">{activeLayoutObj.coupleCardStyle}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/40 text-neutral-300 border border-neutral-800">
                    Events: <strong className="text-[#dfb461]">{activeLayoutObj.eventsStyle}</strong>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-neutral-800 text-center space-y-3">
                <span className="text-xs text-neutral-300 font-medium">Uji Coba Tampilan</span>
                <button
                  type="button"
                  onClick={() => setViewMode('invitation')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#dfb461] text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat di Halaman Undangan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Layout Search & Categories */}
          <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={layoutSearchQuery}
                  onChange={(e) => setLayoutSearchQuery(e.target.value)}
                  placeholder="Cari layout (contoh: Javanese Kraton, Split Editorial, Vogue, Bauhaus, Astral, Cameo)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0a0c12] border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461]"
                />
                {layoutSearchQuery && (
                  <button
                    onClick={() => setLayoutSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {layoutCategories.map((cat) => {
                const isCatActive = selectedLayoutCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedLayoutCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isCatActive
                        ? 'bg-[#dfb461] text-neutral-950 border-[#dfb461] shadow-md font-bold'
                        : 'bg-[#0a0c12] border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {layoutCategoryLabels[cat] || cat}
                  </button>
                );
              })}
            </div>

            {/* 22+ Layout Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {filteredLayouts.map((layout) => {
                const currentLayoutId = data.layoutStyle || activeThemeObj.defaultLayout || 'royal-symmetrical';
                const isSelected = currentLayoutId === layout.id;

                return (
                  <div
                    key={layout.id}
                    onClick={() => handleUpdate({ layoutStyle: layout.id as LayoutArchetype })}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#181d2e] border-[#dfb461] shadow-xl shadow-[#dfb461]/20 ring-2 ring-[#dfb461]/40'
                        : 'bg-[#0b0d14] border-neutral-800 hover:border-neutral-700 hover:bg-[#10131d]'
                    }`}
                  >
                    <div>
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-black/40 text-neutral-300 border border-neutral-800">
                          {layout.category}
                        </span>
                        {layout.culturalTag && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            {layout.culturalTag}
                          </span>
                        )}
                      </div>

                      <h5 className="font-serif-luxury font-bold text-neutral-100 text-base mb-1.5 flex items-center justify-between">
                        <span>{layout.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#dfb461]" />}
                      </h5>

                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        {layout.description}
                      </p>

                      {/* Structural Features Matrix */}
                      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-black/50 border border-neutral-800 text-[10px] font-mono text-center">
                        <div className="p-1">
                          <span className="block text-neutral-500 text-[8px]">HERO</span>
                          <span className="text-neutral-200 font-semibold truncate">{layout.heroLayout}</span>
                        </div>
                        <div className="p-1 border-x border-neutral-800">
                          <span className="block text-neutral-500 text-[8px]">COUPLE</span>
                          <span className="text-neutral-200 font-semibold truncate">{layout.coupleCardStyle}</span>
                        </div>
                        <div className="p-1">
                          <span className="block text-neutral-500 text-[8px]">EVENTS</span>
                          <span className="text-neutral-200 font-semibold truncate">{layout.eventsStyle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className={isSelected ? 'text-[#dfb461] font-bold' : 'text-neutral-400 group-hover:text-neutral-200'}>
                        {isSelected ? '✓ Layout Aktif' : 'Terapkan Layout'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isSelected ? 'text-[#dfb461]' : 'text-neutral-500'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: EXTRAS (DATE, PETALS, AUDIO, QUOTES)
         ========================================================================= */}
      {activeSubTab === 'extras' && (
        <div className="space-y-6">
          {/* 1. Tanggal Utama, Countdown & Lokasi */}
          <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#dfb461]" />
              <h4 className="font-bold text-neutral-100 text-base">Tanggal Utama Pernikahan & Lokasi Kota</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Tanggal & Waktu Akad / Acara Utama (Untuk Countdown Timer)
                </label>
                <input
                  type="datetime-local"
                  value={data.weddingDate ? data.weddingDate.substring(0, 16) : '2026-10-24T08:00'}
                  onChange={(e) => handleUpdate({ weddingDate: new Date(e.target.value).toISOString() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Digunakan untuk menghitung mundur hari, jam, menit, dan detik di halaman utama.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Lokasi Kota / Daerah (Header)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.cityLocation || ''}
                    placeholder="Contoh: Jakarta, Indonesia atau Bandung, Jawa Barat"
                    onChange={(e) => handleUpdate({ cityLocation: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Tampil di bagian hero banner dan kartu undangan.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Efek Partikel Melayang & Musik Latar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efek Bunga / Partikel */}
            <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Flower2 className="w-5 h-5 text-[#dfb461]" />
                <h4 className="font-bold text-neutral-100 text-sm">Efek Animasi Partikel Melayang</h4>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Pilih efek kelopak bunga atau kilau emas yang melayang anggun di layar.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rose', label: 'Kelopak Mawar Merah', icon: '🌹' },
                  { id: 'jasmine', label: 'Melati Putih Suci', icon: '🌸' },
                  { id: 'gold_sparkles', label: 'Kilau Butiran Emas', icon: '✨' },
                  { id: 'none', label: 'Nonaktifkan Efek', icon: '🚫' },
                ].map((p) => {
                  const isPSelected = (data.petalEffect || 'rose') === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleUpdate({ petalEffect: p.id as PetalType })}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isPSelected
                          ? 'border-[#dfb461] bg-[#1a1e2f] text-neutral-100'
                          : 'border-neutral-800 bg-[#0a0c12] text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-xs font-medium">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Musik Pengiring */}
            <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-5 h-5 text-[#dfb461]" />
                <h4 className="font-bold text-neutral-100 text-sm">Audio Musik Pengiring (BGM)</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Judul Lagu / Instrumen
                  </label>
                  <input
                    type="text"
                    value={data.audioTitle || ''}
                    placeholder="Contoh: Romantic Acoustic Piano - Canon in D"
                    onChange={(e) => handleUpdate({ audioTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    URL File Audio (MP3 Direct Link)
                  </label>
                  <input
                    type="url"
                    value={data.audioUrl || ''}
                    placeholder="Biarkan kosong untuk synthesizer piano bawaan otomatis"
                    onChange={(e) => handleUpdate({ audioUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0c12] border border-neutral-700 text-xs text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    *Jika URL kosong, web otomatis menggunakan generator instrumen piano harmonis bawaan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ayat Suci / Religious Quote */}
          <div className="bg-[#121520] border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#dfb461]" />
                <h4 className="font-bold text-neutral-100 text-base">Ayat Suci / Kutipan Doa Pernikahan</h4>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-xs text-neutral-400 block mb-2 font-medium">
                Pilih Cepat dari Preset Populer:
              </span>
              <div className="flex flex-wrap gap-2">
                {HOLY_QUOTE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => handleSelectQuotePreset(preset)}
                    className="px-3 py-1.5 rounded-lg bg-[#0a0c12] border border-neutral-800 hover:border-[#dfb461] text-neutral-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-[#dfb461] font-semibold">
                      {preset.category}
                    </span>
                    <span>{preset.surah}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Sumber / Nama Surat / Referensi
                </label>
                <input
                  type="text"
                  value={data.holyQuote?.surah || ''}
                  placeholder="Contoh: QS. Ar-Rum : 21 atau 1 Korintus 13:4-7"
                  onChange={(e) =>
                    handleUpdate({
                      holyQuote: {
                        ...data.holyQuote,
                        surah: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Isi Teks Kutipan / Terjemahan Ayat
                </label>
                <textarea
                  rows={3}
                  value={data.holyQuote?.text || ''}
                  placeholder="Tuliskan terjemahan ayat atau kata mutiara pernikahan..."
                  onChange={(e) =>
                    handleUpdate({
                      holyQuote: {
                        ...data.holyQuote,
                        text: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0c12] border border-neutral-700 text-sm text-neutral-100 focus:border-[#dfb461] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
