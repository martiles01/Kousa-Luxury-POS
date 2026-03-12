import React from 'react';

const Header = ({ activeTabLabel }) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">
          {activeTabLabel}
        </h2>
        <p className="text-gray-500 text-sm">Operaciones en tiempo real — {new Date().toLocaleDateString('es-DO')}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="bg-red-100 text-luxury-red px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
          SUCURSAL CENTRAL
        </span>
      </div>
    </header>
  );
};

export default Header;
