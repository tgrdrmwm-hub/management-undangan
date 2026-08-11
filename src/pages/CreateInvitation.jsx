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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start sm:items-center mb-6 sm:mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-3 sm:mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 mt-0.5 sm:mt-0"
        >
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-gray-900">Buat Undangan Baru</h1>
          <p className="text-xs sm:text-base text-gray-500 mt-1">Lengkapi data berikut untuk menghasilkan link undangan digital.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          
          {/* Theme Selection */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">Pilih Tema Undangan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allThemes.map((theme) => {
                const colors = theme.previewColors || themePreviewColors[theme.id] || { bg: '#e5e7eb', accent: '#374151', light: '#9ca3af' };
                const isSelected = formData.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, theme: theme.id }))}
                    className={`relative group rounded-xl p-3 sm:p-4 text-left transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-gray-900 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center z-10">
                        <Check size={14} className="text-white" />
                      </div>
                    )}

                    {/* Mini preview */}
                    <div 
                      className="w-full h-20 sm:h-24 rounded-lg mb-3 relative overflow-hidden"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {/* Simulated invitation preview */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div 
                          className="text-[8px] uppercase tracking-[0.2em] mb-1 opacity-60"
                          style={{ color: colors.accent }}
                        >
                          The Wedding Of
                        </div>
                        <div 
                          className="font-handwriting text-lg sm:text-xl"
                          style={{ color: colors.light }}
                        >
                          A <span style={{ color: colors.accent }}>&</span> B
                        </div>
                        <div className="flex gap-2 mt-2">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm opacity-40"
                              style={{ backgroundColor: colors.accent }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Theme info */}
                    <p className="font-medium text-sm text-gray-900">{theme.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{theme.preview}</p>

                    {/* Color dots */}
                    <div className="flex gap-1.5 mt-2">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: colors.bg }} />
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: colors.accent }} />
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: colors.light }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Mempelai */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">Data Mempelai</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">Waktu & Tempat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="mt-3 sm:mt-4">
              <FormInput 
                label="Lokasi Acara" 
                id="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                placeholder="Contoh: Gedung Serbaguna Jakarta..."
              />
            </div>
            <div className="mt-3 sm:mt-4">
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
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-100 pb-2 mb-4">Media & Cerita</h3>
            <div className="mb-3 sm:mb-4">
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
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-wedding-gold text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors shadow-sm"
            >
              <Save size={18} className="mr-2" />
              Simpan & Generate Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvitation;
