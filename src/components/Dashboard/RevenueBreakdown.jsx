import React from 'react';

const RevenueBreakdown = ({ breakdown }) => {
  const total = breakdown.washes + breakdown.products || 1;
  const washWidth = `${Math.max(5, (breakdown.washes / total) * 100)}%`;
  const productWidth = `${Math.max(5, (breakdown.products / total) * 100)}%`;

  return (
    <div className="md:col-span-1 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
      <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Desglose de Ingresos</h3>
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servicios de Lavado</span>
            <span className="text-sm font-black text-luxury-red">RD${breakdown.washes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div
              className="h-full bg-luxury-red transition-all duration-1000"
              style={{ width: washWidth }}
            ></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ventas de Productos</span>
            <span className="text-sm font-black text-luxury-blue">RD${breakdown.products.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div
              className="h-full bg-luxury-blue transition-all duration-1000"
              style={{ width: productWidth }}
            ></div>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Basado en filtros actuales</p>
    </div>
  );
};

export default RevenueBreakdown;
