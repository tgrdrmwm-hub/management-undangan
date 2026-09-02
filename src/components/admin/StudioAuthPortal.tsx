import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Palette, 
  Send, 
  Calendar, 
  Gift, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  Users, 
  Briefcase,
  ChevronLeft
} from 'lucide-react';
import { useWeddingData } from '../../context/WeddingDataContext';

export default function StudioAuthPortal() {
  const { login, registerStudio, setViewMode, projects, setActiveProjectId } = useWeddingData();

  // Mode state: 'landing' shows portfolio, 'auth' shows login/register
  const [showAuth, setShowAuth] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  


  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password, rememberMe);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal masuk. Periksa kembali email dan password.');
    }
  };





  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-[#dfb461] selection:text-neutral-950">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#dfb461]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[400px] bg-[#1a2333]/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-[-5%] w-[450px] h-[450px] bg-[#dfb461]/5 rounded-full blur-[130px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-neutral-800/80 bg-[#0d1017]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#dfb461] to-[#f4cf7b] flex items-center justify-center text-neutral-950 shadow-md shadow-[#dfb461]/20">
            <Sparkles className="w-5 h-5 fill-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury font-bold text-base sm:text-lg tracking-wide text-neutral-100">
                WD Group
              </h1>
            </div>
            <p className="text-[11px] text-neutral-400">
              Penyedia Layanan Undangan Pernikahan Digital
            </p>
          </div>
        </div>

        {/* Action Button: Login Toggle */}
        <button
          onClick={() => setShowAuth(!showAuth)}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-2 border border-neutral-700/60 transition-all cursor-pointer shadow-sm"
        >
          {showAuth ? (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-[#dfb461]" />
              <span>Login Admin</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {!showAuth ? (
          /* ================= LANDING PAGE / PORTFOLIO MODE ================= */
          <div className="space-y-12 animate-in fade-in zoom-in duration-500">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dfb461]/10 border border-[#dfb461]/30 text-[#dfb461] text-xs font-bold uppercase tracking-widest mx-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Katalog Undangan Digital</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-neutral-100 leading-tight">
                Undangan Pernikahan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfb461] via-[#f7dd9b] to-[#dfb461]">Mewah & Estetik</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                Temukan berbagai pilihan tema undangan digital interaktif. Lengkap dengan fitur RSVP, WhatsApp Blast, Amplop Digital (QRIS), dan Google Maps.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-800/60 mt-8">
              <div className="bg-[#121520]/80 p-4 rounded-2xl border border-neutral-800 hover:border-[#dfb461]/30 transition-all text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-3">
                  <Palette className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">Beragam Tema</h4>
                <p className="text-xs text-neutral-400">Pilihan desain mulai dari klasik, modern, hingga adat.</p>
              </div>
              <div className="bg-[#121520]/80 p-4 rounded-2xl border border-neutral-800 hover:border-[#dfb461]/30 transition-all text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-3">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">WhatsApp Blast</h4>
                <p className="text-xs text-neutral-400">Kirim undangan secara instan & personal ke ratusan tamu.</p>
              </div>
              <div className="bg-[#121520]/80 p-4 rounded-2xl border border-neutral-800 hover:border-[#dfb461]/30 transition-all text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-3">
                  <Gift className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">Angpao Digital</h4>
                <p className="text-xs text-neutral-400">Terima hadiah dengan mudah melalui QRIS atau transfer.</p>
              </div>
              <div className="bg-[#121520]/80 p-4 rounded-2xl border border-neutral-800 hover:border-[#dfb461]/30 transition-all text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">RSVP & Kehadiran</h4>
                <p className="text-xs text-neutral-400">Pantau secara live daftar tamu yang akan hadir.</p>
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif-luxury font-bold text-neutral-100 border-l-4 border-[#dfb461] pl-3">
                  Katalog & Portofolio
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="group relative bg-[#0f121a] rounded-2xl border border-neutral-800 overflow-hidden hover:border-[#dfb461]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                    {/* Dummy Thumbnail Image representation */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1e2b] to-[#121520] relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#dfb461]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-center p-6 relative z-10">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#dfb461]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Eye className="w-5 h-5 text-[#dfb461]" />
                        </div>
                        <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">{proj.title}</h4>
                        <p className="text-xs text-neutral-400 uppercase tracking-widest">{proj.config.theme || 'Midnight'}</p>
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-neutral-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-neutral-300">{proj.clientName}</div>
                        <div className="text-[10px] px-2 py-1 rounded-md bg-[#dfb461]/10 text-[#dfb461] border border-[#dfb461]/20">Premium</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActiveProjectId(proj.id);
                          setViewMode('invitation');
                        }}
                        className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-[#dfb461] text-neutral-300 hover:text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#dfb461]/20"
                      >
                        <span>Lihat Demo Undangan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ) : (
          /* ================= AUTHENTICATION MODE ================= */
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="bg-[#0f121a]/95 border border-neutral-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/60 relative backdrop-blur-xl">
              
              {/* Card Header & Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-100 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#dfb461]" />
                    <span>Masuk ke Dashboard</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Akses khusus admin WD Group
                  </p>
                </div>
              </div>

              {/* Error Message Feedback */}
              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <span className="font-bold text-sm leading-none mt-0.5">!</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Email Admin
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: admin@wdgroup.id"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Kata Sandi
                      </label>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-neutral-700 text-[#dfb461] focus:ring-0 bg-neutral-900 cursor-pointer"
                      />
                      <span>Ingat sesi saya</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#dfb461] to-[#f4cf7b] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#dfb461]/20 mt-2"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>Masuk ke Dashboard Admin</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 border-t border-neutral-900 bg-[#05070a] py-4 px-4 sm:px-8 text-center text-xs text-neutral-500 mt-auto">
        <p>© 2026 WD Group. Platform Undangan Pernikahan Digital Eksklusif.</p>
      </footer>
    </div>
  );
}
