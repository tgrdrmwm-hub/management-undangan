import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import FormInput from '../components/FormInput';
import { getAllThemes } from '../themes';

const themePreviewColors = {
  elegantGold: { bg: '#1a1a2e', accent: '#d4af37', light: '#f5e6a3' },
  gardenRomance: { bg: '#1b3a2d', accent: '#a8d5a2', light: '#d4ebd0' },
  royalNavy: { bg: '#0a1628', accent: '#c0a86e', light: '#e8d9b0' },
  rosePetal: { bg: '#2a1520', accent: '#e8a0b8', light: '#f0c4d4' },
  mocha: { bg: '#2c1e13', accent: '#c9a96e', light: '#e0cba8' },
  royalJavanese: { bg: '#FFF0E5', accent: '#700F06', light: '#CEB172' },
};

const CreateInvitation = () => {
  const navigate = useNavigate();
  const allThemes = getAllThemes();
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    date: '',
    time: '',
    location: '',
    mapsLink: '',
    photoUrl: '',
    story: '',
    theme: 'elegantGold',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (groom, bride) => {
    return `${groom.toLowerCase().trim()}-${bride.toLowerCase().trim()}`.replace(/\s+/g, '-');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newInvitation = {
      ...formData,
      id: Date.now().toString(),
      slug: generateSlug(formData.groomName, formData.brideName),
      createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('invitations');
    const invitations = saved ? JSON.parse(saved) : [];
    
    invitations.push(newInvitation);
    localStorage.setItem('invitations', JSON.stringify(invitations));
    
    alert('Undangan berhasil dibuat!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start sm:items-center mb-10 sm:mb-14">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2.5 rounded-full 
            bg-surface-100 dark:bg-surface-800
            text-surface-500 dark:text-surface-400
            hover:bg-surface-200 dark:hover:bg-accent-gold/10 dark:hover:text-accent-gold
            transition-all duration-500 ease-premium active:scale-95
            flex-shrink-0 mt-0.5 sm:mt-0"
        >
          <ArrowLeft size={18} strokeWidth={1.8} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-surface-900 dark:text-white tracking-tight">
            Buat Undangan Baru
          </h1>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1.5">
            Lengkapi data berikut untuk menghasilkan link undangan digital.
          </p>
        </div>
      </div>

      {/* Form — double bezel */}
      <div className="rounded-3xl p-1.5
        bg-surface-300/30 dark:bg-accent-gold/[0.03]
        ring-1 ring-surface-300 dark:ring-accent-gold/10"
      >
        <div className="rounded-[calc(1.5rem-6px)] bg-white dark:bg-surface-900 p-6 sm:p-8 md:p-10
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
        >
          <form onSubmit={handleSubmit}>
            
            {/* Theme Selection */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-surface-400 dark:text-surface-500">
                  Pilih Tema Undangan
                </h3>
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allThemes.map((theme) => {
                  const colors = theme.previewColors || themePreviewColors[theme.id] || { bg: '#e5e7eb', accent: '#374151', light: '#9ca3af' };
                  const isSelected = formData.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                      className={`relative group rounded-2xl p-1 text-left transition-all duration-500 ease-premium
                        ${isSelected
                          ? 'ring-2 ring-accent-gold shadow-glow-gold scale-[1.02]'
                        : 'ring-1 ring-surface-300 dark:ring-surface-700/40 hover:ring-surface-400 dark:hover:ring-surface-600 hover:shadow-lifted'
                        }`}
                    >
                      {/* Selected badge */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center z-10 shadow-soft animate-scale-in">
                          <Check size={13} className="text-white" strokeWidth={2.5} />
                        </div>
                      )}

                      {/* Inner core */}
                      <div className="rounded-[calc(1rem-4px)] overflow-hidden bg-white dark:bg-surface-900">
                        {/* Mini preview */}
                        <div 
                          className="w-full h-24 sm:h-28 relative overflow-hidden"
                          style={{ backgroundColor: colors.bg }}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div 
                              className="text-[8px] uppercase tracking-[0.25em] mb-1 opacity-50"
                              style={{ color: colors.accent }}
                            >
                              The Wedding Of
                            </div>
                            <div 
                              className="font-handwriting text-xl"
                              style={{ color: colors.light }}
                            >
                              A <span style={{ color: colors.accent }}>&</span> B
                            </div>
                            <div className="flex gap-2 mt-2.5">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i}
                                  className="w-5 h-5 rounded-sm opacity-30"
                                  style={{ backgroundColor: colors.accent }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Theme info */}
                        <div className="p-3.5">
                          <p className="font-medium text-[13px] text-surface-900 dark:text-white">{theme.name}</p>
                          <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">{theme.preview}</p>

                          {/* Color dots */}
                          <div className="flex gap-1.5 mt-2.5">
                            <div className="w-3.5 h-3.5 rounded-full ring-1 ring-surface-200/50 dark:ring-surface-600/50" style={{ backgroundColor: colors.bg }} />
                            <div className="w-3.5 h-3.5 rounded-full ring-1 ring-surface-200/50 dark:ring-surface-600/50" style={{ backgroundColor: colors.accent }} />
                            <div className="w-3.5 h-3.5 rounded-full ring-1 ring-surface-200/50 dark:ring-surface-600/50" style={{ backgroundColor: colors.light }} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Mempelai */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-surface-400 dark:text-surface-500">
                  Data Mempelai
                </h3>
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput 
                  label="Nama Mempelai Pria" 
                  id="groomName" 
                  value={formData.groomName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Contoh: Andi"
                />
                <FormInput 
                  label="Nama Mempelai Wanita" 
                  id="brideName" 
                  value={formData.brideName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Contoh: Siti"
                />
              </div>
            </div>

            {/* Waktu & Tempat */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-surface-400 dark:text-surface-500">
                  Waktu & Tempat
                </h3>
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <FormInput 
                  label="Tanggal Acara" 
                  id="date" 
                  type="date"
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
                <FormInput 
                  label="Waktu Acara" 
                  id="time" 
                  type="time"
                  value={formData.time} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mt-4 sm:mt-5">
                <FormInput 
                  label="Lokasi Acara" 
                  id="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="Contoh: Gedung Serbaguna Jakarta..."
                />
              </div>
              <div className="mt-4 sm:mt-5">
                <FormInput 
                  label="Link Google Maps" 
                  id="mapsLink" 
                  type="url"
                  value={formData.mapsLink} 
                  onChange={handleChange} 
                  placeholder="Contoh: https://goo.gl/maps/..."
                />
              </div>
            </div>

            {/* Media & Cerita */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-surface-400 dark:text-surface-500">
                  Media & Cerita
                </h3>
                <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700/50" />
              </div>
              <div className="mb-4 sm:mb-5">
                <FormInput 
                  label="URL Foto Pasangan (Opsional)" 
                  id="photoUrl" 
                  type="url"
                  value={formData.photoUrl} 
                  onChange={handleChange} 
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <FormInput 
                  label="Kisah Cinta / Pesan Singkat (Opsional)" 
                  id="story" 
                  as="textarea"
                  rows={4}
                  value={formData.story} 
                  onChange={handleChange} 
                  placeholder="Tuliskan kisah cinta atau pesan singkat..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-surface-100 dark:border-surface-800">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-full
                  text-[13px] font-medium tracking-wide text-center
                  text-surface-500 dark:text-surface-400
                  ring-1 ring-surface-200 dark:ring-surface-700
                  hover:bg-surface-100 dark:hover:bg-surface-800
                  transition-all duration-500 ease-premium active:scale-[0.97]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full
                  bg-surface-900 dark:bg-accent-gold
                  text-white dark:text-surface-900
                  text-[13px] font-medium tracking-wide
                  hover:bg-surface-700 dark:hover:bg-accent-amber
                  shadow-soft hover:shadow-lifted dark:shadow-glow-gold dark:hover:shadow-[0_0_40px_-8px_rgba(198,169,105,0.35)]
                  transition-all duration-500 ease-premium active:scale-[0.97]"
              >
                <Save size={15} strokeWidth={1.8} />
                Simpan & Generate Link
                <span className="ml-1 w-6 h-6 rounded-full bg-white/10 dark:bg-surface-900/10 flex items-center justify-center
                  group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105
                  transition-transform duration-500 ease-premium">
                  <span className="text-xs">→</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInvitation;
