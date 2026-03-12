import React from 'react';

const LogoKousa = ({ className, branding }) => {
  const b = branding || {};
  
  if (b.logoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img 
          src={b.logoUrl} 
          alt="Logo" 
          className="max-h-16 max-w-full object-contain mb-1"
        />
        {b.tagline && (
          <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">{b.tagline}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-baseline gap-1">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          {b.logoText || 'KOUSA'} <span className="text-luxury-red">{b.logoSubtext || 'LUXURY'}</span>
        </h1>
      </div>
      <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">{b.tagline || 'Auto Import & Care'}</p>
    </div>
  );
};

export default LogoKousa;
