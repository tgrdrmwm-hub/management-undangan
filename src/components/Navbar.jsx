import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, PlusCircle, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = isDarkMode;
    
    const updateTheme = () => {
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDarkMode(false);
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDarkMode(true);
      }
    };

    if (!document.startViewTransition) {
      updateTheme();
      return;
    }

    const nextMode = isDark ? 'light' : 'dark';
    const transitionClass = nextMode === 'dark' ? 'theme-transition-dark' : 'theme-transition-light';

    document.documentElement.classList.add(transitionClass);
    const transition = document.startViewTransition(updateTheme);
    
    transition.finished.finally(() => {
      document.documentElement.classList.remove(transitionClass);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `group flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-500 ease-premium ${
      isActive(path) 
        ? 'bg-surface-900 text-white dark:bg-accent-gold/15 dark:text-accent-gold shadow-soft dark:shadow-[0_0_20px_-6px_rgba(198,169,105,0.15)]' 
        : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-accent-gold'
    }`;

  return (
    <nav className="sticky top-0 z-40">
      {/* Floating nav container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <div className="flex items-center justify-between h-14 px-5 rounded-2xl 
          bg-white/90 dark:bg-surface-900/60 backdrop-blur-2xl
          border border-surface-300 dark:border-accent-gold/10
          shadow-lifted dark:shadow-[0_0_30px_-10px_rgba(198,169,105,0.08)]
          transition-all duration-500 ease-premium"
        >
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-gold to-accent-warm flex items-center justify-center shadow-soft">
              <span className="text-white font-serif text-sm font-bold">W</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-semibold text-surface-900 dark:text-white tracking-tight">WD</span>
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-surface-400 dark:text-surface-500 hidden sm:inline">
                Group Company
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              <LayoutDashboard size={15} strokeWidth={1.8} />
              Dashboard
            </Link>
            <Link to="/dashboard/create" className={navLinkClass('/dashboard/create')}>
              <PlusCircle size={15} strokeWidth={1.8} />
              Buat Undangan
            </Link>
            
            {/* Separator */}
            <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-2" />

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2.5 rounded-full text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-all duration-500 ease-premium hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-95"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-4 h-4">
                <Sun 
                  size={16} strokeWidth={1.8}
                  className={`absolute inset-0 transition-all duration-500 ease-premium ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}
                />
                <Moon 
                  size={16} strokeWidth={1.8}
                  className={`absolute inset-0 transition-all duration-500 ease-premium ${isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}
                />
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full text-surface-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-500 ease-premium hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-95"
              aria-label="Logout"
            >
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-all duration-300 active:scale-95"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full text-surface-500 hover:text-surface-900 dark:hover:text-white transition-all duration-300 active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <X 
                  size={20} strokeWidth={1.8}
                  className={`absolute inset-0 transition-all duration-300 ease-premium ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}
                />
                <Menu 
                  size={20} strokeWidth={1.8}
                  className={`absolute inset-0 transition-all duration-300 ease-premium ${isMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-premium ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-2 p-3 rounded-2xl 
          bg-white/95 dark:bg-surface-900/90 backdrop-blur-2xl
          border border-surface-300 dark:border-surface-800/50 
          shadow-lifted dark:shadow-none space-y-1"
        >
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={`${navLinkClass('/dashboard')} w-full`}
          >
            <LayoutDashboard size={16} strokeWidth={1.8} />
            Dashboard
          </Link>
          <Link
            to="/dashboard/create"
            onClick={() => setIsMenuOpen(false)}
            className={`${navLinkClass('/dashboard/create')} w-full`}
          >
            <PlusCircle size={16} strokeWidth={1.8} />
            Buat Undangan
          </Link>
          <button
            onClick={() => { setIsMenuOpen(false); handleLogout(); }}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-full text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
