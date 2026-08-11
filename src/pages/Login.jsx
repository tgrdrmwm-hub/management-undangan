import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Apply dark mode on login page too
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Trigger mount animation
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'password123') {
      localStorage.setItem('auth_token', 'true');
      navigate('/dashboard');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-200 dark:bg-surface-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/8 dark:bg-accent-gold/[0.06] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-accent-warm/6 dark:bg-accent-warm/[0.04] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-accent-gold/[0.03] rounded-full blur-[80px] hidden dark:block" />
      
      {/* Login card — double bezel */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ease-premium
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Outer shell */}
        <div className="rounded-3xl p-1.5 
          bg-surface-300/30 dark:bg-accent-gold/[0.04]
          ring-1 ring-surface-300 dark:ring-accent-gold/10"
        >
          {/* Inner core */}
          <div className="rounded-[calc(1.5rem-6px)] bg-white dark:bg-surface-900 p-8 sm:p-10
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-gold to-accent-warm mb-5 shadow-soft">
                <span className="text-white font-serif text-lg font-bold">W</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-surface-900 dark:text-white tracking-tight">
                Selamat Datang
              </h2>
              <p className="mt-2 text-sm text-surface-400 dark:text-surface-500">
                Masuk ke panel WD Group Company untuk mengelola undangan
              </p>
            </div>
            
            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 
                  ring-1 ring-red-200/50 dark:ring-red-800/30
                  text-red-600 dark:text-red-400 text-[13px] text-center animate-scale-in">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-surface-500 dark:text-surface-400 mb-2 tracking-wide">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-surface-300 dark:text-surface-600" strokeWidth={1.8} />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full pl-11 px-4 py-3
                        bg-surface-100 dark:bg-surface-800/50
                        border border-surface-300 dark:border-surface-700/50
                        text-surface-900 dark:text-white
                        placeholder-surface-300 dark:placeholder-surface-600
                        rounded-xl text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold/50
                        transition-all duration-500 ease-premium"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[13px] font-medium text-surface-500 dark:text-surface-400 mb-2 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-surface-300 dark:text-surface-600" strokeWidth={1.8} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full pl-11 px-4 py-3
                        bg-surface-100 dark:bg-surface-800/50
                        border border-surface-300 dark:border-surface-700/50
                        text-surface-900 dark:text-white
                        placeholder-surface-300 dark:placeholder-surface-600
                        rounded-xl text-[14px]
                        focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold/50
                        transition-all duration-500 ease-premium"
                      placeholder="password123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full
                  bg-surface-900 dark:bg-accent-gold
                  text-white dark:text-surface-900
                  text-[14px] font-medium tracking-wide
                  hover:bg-surface-700 dark:hover:bg-accent-amber
                  shadow-soft hover:shadow-lifted dark:shadow-glow-gold dark:hover:shadow-[0_0_40px_-8px_rgba(198,169,105,0.35)]
                  transition-all duration-500 ease-premium active:scale-[0.98]"
              >
                Masuk
                <span className="ml-1 w-7 h-7 rounded-full bg-white/10 dark:bg-surface-900/10 flex items-center justify-center
                  group-hover:translate-x-1 group-hover:scale-105
                  transition-transform duration-500 ease-premium">
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </button>
            </form>
          </div>
        </div>
        
        {/* Subtle hint */}
        <p className="text-center text-[11px] text-surface-300 dark:text-surface-600 mt-5 tracking-wide">
          Hint: admin / password123
        </p>
      </div>
    </div>
  );
};

export default Login;
