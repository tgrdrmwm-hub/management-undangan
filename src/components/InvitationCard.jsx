import React from 'react';
import { ExternalLink, Copy, Trash2, Calendar } from 'lucide-react';

const InvitationCard = ({ invitation, onDelete }) => {
  const { id, slug, brideName, groomName, date, photoUrl } = invitation;
  const invitationLink = `${window.location.origin}/undangan/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink);
    alert('Link berhasil disalin!');
  };

  return (
    /* Double-bezel outer shell */
    <div className="group rounded-3xl p-1.5 
      bg-surface-300/50 dark:bg-accent-gold/[0.04]
      ring-1 ring-surface-300 dark:ring-accent-gold/10
      hover:ring-accent-gold/40 dark:hover:ring-accent-gold/25
      transition-all duration-700 ease-premium
      hover:shadow-elevated dark:hover:shadow-[0_0_50px_-12px_rgba(198,169,105,0.2)]
      hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Inner core */}
      <div className="rounded-[calc(1.5rem-6px)] overflow-hidden
        bg-white dark:bg-surface-900
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
      >
        {/* Image */}
        <div className="h-44 sm:h-52 relative overflow-hidden">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={`${groomName} & ${brideName}`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center 
              bg-gradient-to-br from-surface-100 to-surface-200 
              dark:from-surface-850 dark:to-surface-900 dark:bg-[radial-gradient(ellipse_at_center,rgba(198,169,105,0.06),transparent_70%)]"
            >
              <div className="text-center">
                <span className="text-surface-300 dark:text-surface-600 font-serif text-2xl italic">No Photo</span>
              </div>
            </div>
          )}
          
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          {/* Open link button */}
          <a
            href={`/undangan/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 p-2 rounded-full 
              bg-white/90 dark:bg-surface-800/80 dark:backdrop-blur-sm
              text-surface-600 dark:text-accent-gold/70
              hover:text-accent-gold dark:hover:text-accent-gold 
              transition-all duration-500 ease-premium
              opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
              shadow-soft dark:shadow-[0_0_15px_-4px_rgba(198,169,105,0.15)]
              active:scale-95"
            title="Buka Undangan"
          >
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        </div>
        
        {/* Info */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-surface-900 dark:text-white truncate tracking-tight">
            {groomName} & {brideName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 mb-5">
            <Calendar size={12} strokeWidth={1.8} className="text-surface-400 dark:text-accent-gold/40" />
            <p className="text-xs text-surface-400 dark:text-surface-500 tracking-wide">
              {new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full
                text-xs font-medium tracking-wide
                bg-surface-900 text-white 
                dark:bg-accent-gold/15 dark:text-accent-gold dark:ring-1 dark:ring-accent-gold/20
                hover:bg-surface-700 
                dark:hover:bg-accent-gold/25 dark:hover:shadow-[0_0_20px_-6px_rgba(198,169,105,0.2)]
                transition-all duration-500 ease-premium active:scale-[0.97]
                shadow-soft"
            >
              <Copy size={13} strokeWidth={2} />
              Copy Link
            </button>
            
            <button 
              onClick={() => onDelete(id)}
              className="flex items-center justify-center p-2.5 rounded-full
                text-surface-400 dark:text-surface-500
                hover:text-red-500 dark:hover:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/10
                transition-all duration-500 ease-premium active:scale-[0.95]"
            >
              <Trash2 size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
