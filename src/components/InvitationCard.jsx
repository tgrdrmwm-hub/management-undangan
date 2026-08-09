import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, Trash2 } from 'lucide-react';

const InvitationCard = ({ invitation, onDelete }) => {
  const { id, slug, brideName, groomName, date, photoUrl } = invitation;
  const invitationLink = `${window.location.origin}/undangan/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    alert('Link berhasil disalin!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-36 sm:h-48 bg-gray-200 relative">
        {photoUrl ? (
          <img src={photoUrl} alt="Wedding" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-wedding-dark/10">
            <span className="text-gray-400 text-sm">No Photo</span>
          </div>
        )}
        <a
          href={`/undangan/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-700 hover:text-wedding-gold transition-colors shadow-sm"
          title="Buka Undangan"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      
      {/* Info */}
      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 truncate">
          {groomName} & {brideName}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-3 sm:mb-4">
          {new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium text-wedding-gold bg-wedding-gold/10 rounded-md hover:bg-wedding-gold hover:text-white transition-colors"
          >
            <Copy size={14} className="mr-1.5" />
            Copy Link
          </button>
          
          <button 
            onClick={() => onDelete(id)}
            className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-600 hover:text-white transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
