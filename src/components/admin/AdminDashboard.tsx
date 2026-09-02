import { useState } from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Users, 
  Calendar, 
  BookHeart, 
  Image as ImageIcon, 
  Gift, 
  Send, 
  CheckSquare, 
  Eye, 
  Sparkles, 
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Layers,
  ArrowLeft,
  LogOut,
  UserCheck,
  Database
} from 'lucide-react';
import { useWeddingData } from '../../context/WeddingDataContext';
import OverviewTab from './tabs/OverviewTab';
import ThemeTab from './tabs/ThemeTab';
import CoupleTab from './tabs/CoupleTab';
import EventsTab from './tabs/EventsTab';
import LoveStoryTab from './tabs/LoveStoryTab';
import GalleryTab from './tabs/GalleryTab';
import GiftTab from './tabs/GiftTab';
import GuestsBlastTab from './tabs/GuestsBlastTab';
import RsvpWishesTab from './tabs/RsvpWishesTab';
import DatabaseTab from './tabs/DatabaseTab';

const NAV_ITEMS = [
  { id: 'overview', label: 'Ringkasan & Job', icon: LayoutDashboard, badge: null },
  { id: 'theme', label: 'Tema & Tampilan', icon: Palette, badge: '20+ Tema' },
  { id: 'couple', label: 'Profil Mempelai', icon: Users, badge: null },
  { id: 'events', label: 'Rangkaian Acara', icon: Calendar, badge: null },
  { id: 'story', label: 'Kisah Cinta (Story)', icon: BookHeart, badge: null },
  { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon, badge: null },
  { id: 'gifts', label: 'Amplop & Kado', icon: Gift, badge: null },
  { id: 'guests', label: 'Tamu & WhatsApp Blast', icon: Send, badge: 'Generator Link' },
  { id: 'rsvps', label: 'Rekap RSVP & Buku Tamu', icon: CheckSquare, badge: null },
  { id: 'database', label: 'Database & Cloud', icon: Database, badge: 'Supabase' },
];

export default function AdminDashboard() {
  const { 
    activeTab, 
    setActiveTab, 
    activeProject, 
    projects, 
    setActiveProjectId, 
    setViewMode, 
    data,
    currentUser,
    logout,
    isSupabaseConnected
  } = useWeddingData();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onSwitchTab={(tab) => setActiveTab(tab)} />;
      case 'theme':
        return <ThemeTab />;
      case 'couple':
        return <CoupleTab />;
      case 'events':
        return <EventsTab />;
      case 'story':
        return <LoveStoryTab />;
      case 'gallery':
        return <GalleryTab />;
      case 'gifts':
        return <GiftTab />;
      case 'guests':
        return <GuestsBlastTab />;
      case 'rsvps':
        return <RsvpWishesTab />;
      case 'database':
        return <DatabaseTab />;
      default:
        return <OverviewTab onSwitchTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-[#dfb461] selection:text-neutral-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#dfb461] to-[#f4cf7b] flex items-center justify-center text-neutral-950 shadow-md">
              <Sparkles className="w-4 h-4 fill-neutral-950" />
            </div>
            <div>
              <h1 className="font-serif-luxury font-bold text-sm sm:text-base tracking-wide text-neutral-100 flex items-center gap-1.5">
                <span>WD Group</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40 uppercase">
                  Studio
                </span>
                {isSupabaseConnected ? (
                  <button 
                    onClick={() => setActiveTab('database')}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase Live
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('database')}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Local Mode
                  </button>
                )}
              </h1>
              <p className="text-[10px] text-neutral-400 hidden sm:block">
                Digital Wedding Invitation & Client Management System
              </p>
            </div>
          </div>
        </div>

        {/* Project Selector, User Info & Preview Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#121520] border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-[#dfb461]" />
            <span className="text-neutral-400">Job:</span>
            <select
              value={activeProject.id}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-transparent text-neutral-200 font-bold focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#121520] text-neutral-200">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Badge (Header) */}
          {currentUser && (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#121520] border border-neutral-800 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#dfb461]/20 border border-[#dfb461]/40 flex items-center justify-center text-[#dfb461] text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-semibold text-neutral-200 text-[11px] leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-[#dfb461] leading-none">
                  {currentUser.studioName || 'Studio Admin'}
                </div>
              </div>
            </div>
          )}

          {/* Preview Button */}
          <button
            onClick={() => setViewMode('invitation')}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#dfb461]/20"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Undangan</span>
            <span className="sm:hidden">Preview</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Keluar dari Studio"
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-neutral-700/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-30 w-64 bg-[#0a0c12] border-r border-neutral-800 p-4 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Menu Manajemen Undangan
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#181d2c] text-[#dfb461] border border-[#dfb461]/30 shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#dfb461]' : 'text-neutral-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#dfb461]/15 text-[#dfb461] font-mono shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Client Info & Profile Box in Sidebar */}
          <div className="pt-3 border-t border-neutral-800/80 space-y-2">
            <div className="bg-[#121520] p-3 rounded-2xl border border-neutral-800 text-[11px]">
              <div className="text-neutral-400">Pengantin Aktif:</div>
              <div className="font-bold text-neutral-100 truncate mt-0.5">
                {data.groom?.name || 'Groom'} & {data.bride?.name || 'Bride'}
              </div>
              <div className="text-[10px] text-[#dfb461] mt-1 flex items-center justify-between">
                <span>Tema: {data.theme || 'Classic'}</span>
                <span className="text-neutral-500">{data.events?.length || 0} Acara</span>
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center justify-between px-2 py-1.5 text-neutral-400 text-[11px]">
                <div className="truncate">
                  <span className="text-neutral-500">Login: </span>
                  <span className="text-neutral-300 font-medium">{currentUser.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-rose-400 hover:underline text-[10px] cursor-pointer ml-1"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
