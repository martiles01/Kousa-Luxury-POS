import React from 'react';

const LogoKousa = ({ className }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="flex items-baseline gap-1">
      <h1 className="text-2xl font-black tracking-tighter text-white">
        KOUSA <span className="text-luxury-red">LUXURY</span>
      </h1>
    </div>
    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Auto Import & Care</p>
  </div>
);

export default LogoKousa;
