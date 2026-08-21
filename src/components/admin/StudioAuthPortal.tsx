import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Palette, 
  Users, 
  Calendar, 
  Send, 
  Gift, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  Layers, 
  Heart,
  Briefcase
} from 'lucide-react';
import { useWeddingData } from '../../context/WeddingDataContext';

export default function StudioAuthPortal() {
  const { login, quickDemoLogin, registerStudio, setViewMode, projects, setActiveProjectId } = useWeddingData();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [email, setEmail] = useState('admin@weddingpro.id');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regStudio, setRegStudio] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await registerStudio(regName, regEmail, regStudio, regPassword);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Gagal membuat studio baru.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@weddingpro.id');
    setPassword('admin123');
    setErrorMsg(null);
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
                WeddingPro
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-[#dfb461]/20 text-[#dfb461] border border-[#dfb461]/40 uppercase tracking-wider">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Platform Manajemen & Desain Undangan Pernikahan Digital
            </p>
          </div>
        </div>

        {/* Action Button: Guest View Direct Access */}
        <button
          onClick={() => setViewMode('invitation')}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center gap-2 border border-neutral-700/60 transition-all cursor-pointer shadow-sm"
        >
          <Eye className="w-3.5 h-3.5 text-[#dfb461]" />
          <span>Lihat Demo Undangan</span>
        </button>
      </header>

      {/* Main Content Hero & Auth Form */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dfb461]/10 border border-[#dfb461]/30 text-[#dfb461] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Undangan Pernikahan Interaktif</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-neutral-100 leading-tight">
                Kelola, Desain, dan Kirim Undangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfb461] via-[#f7dd9b] to-[#dfb461]">Secara Eksklusif</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Masuk ke Studio Management untuk menentukan tema visual, profil calon pengantin, jadwal acara dengan Google Maps, generator link tamu WhatsApp blast otomatis, dan monitoring RSVP secara langsung.
              </p>
            </div>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">24 Tema Estetik</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Midnight, Java, Sunda, Minang, Bali, Emerald, Rose Gold & Editorial</p>
              </div>

              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">WhatsApp Blast</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Generator link & personalisasi nama tamu instan</p>
              </div>

              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">Akad & Resepsi</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Google Maps, dresscode, dan kalender</p>
              </div>

              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">Amplop & QRIS</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">BCA, Mandiri, BRI & alamat kado fisik</p>
              </div>

              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">Multi-Job Klien</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Kelola banyak pesanan pasangan sekaligus</p>
              </div>

              <div className="p-3 rounded-xl bg-[#121520]/80 border border-neutral-800/80 hover:border-[#dfb461]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#dfb461]/15 text-[#dfb461] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-neutral-200">Rekap RSVP Live</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Statistik kehadiran & ekspor file CSV</p>
              </div>
            </div>

            {/* Quick Demo Proyek Preview Pills */}
            <div className="pt-2">
              <p className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5 font-medium">
                <Heart className="w-3.5 h-3.5 text-[#dfb461]" />
                <span>Job Aktif Tersedia:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {projects.slice(0, 3).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      quickDemoLogin();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#151924] hover:bg-[#1f2536] border border-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#dfb461]" />
                    <span>{proj.title}</span>
                    <span className="text-[10px] text-neutral-500">({proj.config.theme || 'Midnight'})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f121a]/95 border border-neutral-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/60 relative backdrop-blur-xl">
              
              {/* Card Header & Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-100 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#dfb461]" />
                    <span>{authMode === 'login' ? 'Masuk ke Studio' : 'Daftar Studio Baru'}</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {authMode === 'login' 
                      ? 'Kelola pengaturan tema, mempelai, dan data undangan' 
                      : 'Buat akun studio atau wedding planner baru'}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex rounded-xl bg-[#080a10] p-1 border border-neutral-800 mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                    authMode === 'login'
                      ? 'bg-[#dfb461] text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                    authMode === 'register'
                      ? 'bg-[#dfb461] text-neutral-950 shadow-md font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Daftar Studio
                </button>
              </div>

              {/* Error Message Feedback */}
              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <span className="font-bold text-sm leading-none mt-0.5">!</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Email Studio / Admin
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: admin@weddingpro.id"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={handleFillDemo}
                        className="text-[11px] text-[#dfb461] hover:underline cursor-pointer font-medium"
                      >
                        Gunakan Akun Demo
                      </button>
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
                    <span className="text-[11px] text-neutral-500 font-mono">Demo: admin123</span>
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
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-[#0f121a] px-2 text-neutral-500 font-bold">atau</span>
                    </div>
                  </div>

                  {/* 1-Click Quick Demo Login */}
                  <button
                    type="button"
                    onClick={quickDemoLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#181d2c] hover:bg-[#20273b] border border-neutral-700/80 text-neutral-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb461]" />
                    <span>Masuk Instan (1-Klik Demo Access)</span>
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nama Penanggung Jawab / Admin
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="contoh: Arya Wicaksono"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Nama Studio / Wedding Organizer
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regStudio}
                        onChange={(e) => setRegStudio(e.target.value)}
                        placeholder="contoh: Royal Bliss Wedding"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@studioanda.com"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 4 karakter"
                        className="w-full bg-[#141824] border border-neutral-700/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#dfb461] transition-colors"
                      />
                    </div>
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
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Daftarkan Studio & Masuk</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Security Footnote */}
              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb461]" />
                <span>Data tersimpan aman di browser Anda & siap diekspor</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 border-t border-neutral-900 bg-[#05070a] py-4 px-4 sm:px-8 text-center text-xs text-neutral-500">
        <p>© 2026 WeddingPro Digital Studio Management. Platform Undangan Pernikahan Eksklusif.</p>
      </footer>
    </div>
  );
}
