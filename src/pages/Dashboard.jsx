import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import InvitationCard from '../components/InvitationCard';

const Dashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('invitations');
    if (saved) {
      setInvitations(JSON.parse(saved));
    }
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Kelola semua undangan digital klien Anda.</p>
        </div>
        <Link 
          to="/dashboard/create" 
          className="inline-flex items-center justify-center px-4 py-2.5 bg-wedding-gold text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto"
        >
          <PlusCircle size={20} className="mr-2" />
          Buat Undangan Baru
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama mempelai..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-wedding-gold focus:border-wedding-gold outline-none transition-colors text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredInvitations.map(invitation => (
            <InvitationCard 
              key={invitation.id} 
              invitation={invitation} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-20 bg-white rounded-xl border border-gray-100 border-dashed px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-50 mb-4">
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">Tidak ada undangan ditemukan</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">Mulai buat undangan pertama Anda untuk klien.</p>
          <Link 
            to="/dashboard/create" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-wedding-gold bg-wedding-gold/10 rounded-lg hover:bg-wedding-gold hover:text-white transition-colors"
          >
            Buat Sekarang
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
