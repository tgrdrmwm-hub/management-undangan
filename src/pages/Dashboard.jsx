import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, UploadCloud, Sparkles } from 'lucide-react';
import InvitationCard from '../components/InvitationCard';

const Dashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('invitations');
    if (saved) {
      setInvitations(JSON.parse(saved));
    }
  }, []);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.id || !json.name || !json.cover) {
          alert("Format file tema tidak valid. Harus memiliki id, name, dan cover.");
          return;
        }

        const saved = localStorage.getItem('uploaded_themes');
        const uploadedThemes = saved ? JSON.parse(saved) : [];
        
        const existingIndex = uploadedThemes.findIndex(t => t.id === json.id);
        if (existingIndex >= 0) {
          uploadedThemes[existingIndex] = json;
        } else {
          uploadedThemes.push(json);
        }

        localStorage.setItem('uploaded_themes', JSON.stringify(uploadedThemes));
        alert(`Tema "${json.name}" berhasil diupload dan disimpan!`);
      } catch (error) {
        console.error(error);
        alert("Gagal membaca file JSON.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus undangan ini?')) {
      const updated = invitations.filter(inv => inv.id !== id);
      setInvitations(updated);
      localStorage.setItem('invitations', JSON.stringify(updated));
    }
  };

  const filteredInvitations = invitations.filter(inv => 
    inv.brideName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.groomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-6">
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 dark:bg-accent-gold/10 dark:ring-1 dark:ring-accent-gold/15 mb-4">
            <Sparkles size={11} className="text-accent-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-accent-gold">
              Panel Administrasi
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-surface-900 dark:text-white tracking-tight text-balance">
            Dashboard
          </h1>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-2 max-w-md">
            Kelola semua undangan digital klien Anda dari satu tempat.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full
              bg-surface-200 dark:bg-accent-gold/10
              text-surface-600 dark:text-accent-gold
              hover:bg-surface-300 dark:hover:bg-accent-gold/20
              ring-1 ring-surface-300 dark:ring-accent-gold/15
              dark:hover:shadow-[0_0_25px_-6px_rgba(198,169,105,0.15)]
              transition-all duration-500 ease-premium active:scale-[0.97]
              text-[13px] font-medium tracking-wide w-full sm:w-auto"
          >
            <UploadCloud size={16} strokeWidth={1.8} className="group-hover:-translate-y-0.5 transition-transform duration-500 ease-premium" />
            Upload Tema
          </button>
          <Link 
            to="/dashboard/create" 
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full
              bg-surface-900 dark:bg-accent-gold
              text-white dark:text-surface-900
              hover:bg-surface-700 dark:hover:bg-accent-amber
              shadow-soft hover:shadow-lifted dark:shadow-glow-gold dark:hover:shadow-[0_0_40px_-8px_rgba(198,169,105,0.35)]
              transition-all duration-500 ease-premium active:scale-[0.97]
              text-[13px] font-medium tracking-wide w-full sm:w-auto"
          >
            <PlusCircle size={16} strokeWidth={1.8} />
            Buat Undangan Baru
            {/* trailing icon pill */}
            <span className="ml-1 w-6 h-6 rounded-full bg-white/10 dark:bg-surface-900/10 flex items-center justify-center
              group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105
              transition-transform duration-500 ease-premium">
              <span className="text-xs">→</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Search — double bezel */}
      <div className={`rounded-2xl p-1 mb-10 sm:mb-14
        transition-all duration-700 ease-premium
        ${isSearchFocused 
          ? 'bg-accent-gold/10 ring-1 ring-accent-gold/30 shadow-glow-gold' 
          : 'bg-surface-300/40 dark:bg-accent-gold/[0.03] ring-1 ring-surface-300 dark:ring-accent-gold/10'
        }`}
      >
        <div className="relative rounded-[calc(1rem-4px)] overflow-hidden bg-white dark:bg-surface-900">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 transition-colors duration-500 ${isSearchFocused ? 'text-accent-gold' : 'text-surface-300 dark:text-surface-600'}`} strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Cari nama mempelai..."
            className="pl-11 w-full px-4 py-3.5 
              bg-transparent
              text-surface-900 dark:text-white 
              placeholder-surface-300 dark:placeholder-surface-600
              text-[14px]
              focus:outline-none
              transition-colors duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      {/* Content */}
      {filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredInvitations.map((invitation, i) => (
            <div 
              key={invitation.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <InvitationCard 
                invitation={invitation} 
                onDelete={handleDelete} 
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty state — double bezel */
        <div className="rounded-3xl p-1.5 bg-surface-300/30 dark:bg-accent-gold/[0.03] ring-1 ring-surface-300 dark:ring-accent-gold/10">
          <div className="rounded-[calc(1.5rem-6px)] bg-white dark:bg-surface-900 py-20 sm:py-28 px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-50 dark:bg-surface-800 mb-6">
              <Sparkles className="h-7 w-7 text-accent-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif font-semibold text-surface-900 dark:text-white mb-2 tracking-tight">
              Belum ada undangan
            </h3>
            <p className="text-sm text-surface-400 dark:text-surface-500 mb-8 max-w-sm mx-auto">
              Buat undangan pertama untuk klien Anda dan mulai menerima tamu secara digital.
            </p>
            <Link 
              to="/dashboard/create" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                bg-surface-900 dark:bg-accent-gold
                text-white dark:text-surface-900
                text-[13px] font-medium tracking-wide
                hover:bg-surface-700 dark:hover:bg-accent-amber
                shadow-soft hover:shadow-lifted dark:shadow-glow-gold
                transition-all duration-500 ease-premium active:scale-[0.97]"
            >
              <PlusCircle size={15} strokeWidth={1.8} />
              Buat Sekarang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
