import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive(path) ? 'bg-wedding-gold text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="font-serif text-2xl font-bold text-wedding-gold">Eterna</span>
              <span className="ml-2 text-sm text-gray-500 font-medium hidden sm:inline">Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              <LayoutDashboard size={18} className="mr-1.5" />
              Dashboard
            </Link>
            <Link to="/dashboard/create" className={navLinkClass('/dashboard/create')}>
              <PlusCircle size={18} className="mr-1.5" />
              Buat Undangan
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-1.5" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-up">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className={`${navLinkClass('/dashboard')} w-full`}
            >
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </Link>
            <Link
              to="/dashboard/create"
              onClick={() => setIsMenuOpen(false)}
              className={`${navLinkClass('/dashboard/create')} w-full`}
            >
              <PlusCircle size={18} className="mr-2" />
              Buat Undangan
            </Link>
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
