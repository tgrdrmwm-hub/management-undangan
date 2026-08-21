import { useState } from 'react';
import { Settings, Sparkles, X, Layers, Users, Palette, Check } from 'lucide-react';
import { useWeddingData } from '../../context/WeddingDataContext';
import { THEMES } from '../../data/weddingData';

export default function AdminFloatingToggle() {
  const { 
    viewMode, 
    setViewMode, 
    setActiveTab, 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    data, 
    updateData 
  } = useWeddingData();

  const [expanded, setExpanded] = useState(false);

  if (viewMode === 'admin') return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      {/* Quick Drawer Popup */}
      {expanded && (
        <div className="mb-3 bg-[#0d1017]/95 backdrop-blur-md border border-[#dfb461]/40 rounded-3xl p-4 shadow-2xl w-72 text-neutral-100 animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfb461]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wedding Management</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Job Switcher */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Ganti Job / Pesanan:
            </label>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#141722] border border-neutral-700 text-xs text-neutral-200 focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Theme Switcher */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
              Ganti Tema Cepat:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateData({ theme: th.id })}
                  className={`p-1.5 rounded-lg border text-[10px] flex items-center gap-1 truncate cursor-pointer ${
                    (data.theme || 'classic-midnight') === th.id
                      ? 'border-[#dfb461] bg-[#1a1e2d] text-[#dfb461]'
                      : 'border-neutral-800 bg-[#090b10] text-neutral-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: th.primaryColor }}
                  />
                  <span className="truncate">{th.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Jump to Admin Dashboard */}
          <div className="pt-2 border-t border-neutral-800 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setViewMode('admin');
                setActiveTab('overview');
              }}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Buka Management Dashboard</span>
            </button>

            <button
              onClick={() => {
                setViewMode('admin');
                setActiveTab('guests');
              }}
              className="w-full py-1.5 rounded-xl bg-[#141722] hover:bg-[#1a1e2d] border border-neutral-700 text-neutral-300 text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Users className="w-3 h-3 text-[#dfb461]" />
              <span>Generator Link Tamu / WA Blast</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="px-3.5 py-2.5 rounded-full bg-[#0d1017]/90 hover:bg-[#151924] border border-[#dfb461]/60 text-[#dfb461] shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer group"
        title="Buka Menu Manajemen Undangan"
      >
        <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
        <span className="text-xs font-bold tracking-wide">Management Studio</span>
      </button>
    </div>
  );
}
