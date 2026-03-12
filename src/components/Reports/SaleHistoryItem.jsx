import React from 'react';
import { BarChart3 } from 'lucide-react';

const SaleHistoryItem = ({ sale, onPrint }) => {
  return (
    <div className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm font-black text-luxury-blue group-hover:bg-luxury-blue group-hover:text-white transition-colors">#</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-black text-slate-800 text-sm uppercase">Venta #{sale.id.slice(0, 5)}</p>
            {sale.invoice_type === 'fiscal' && (
              <span className="text-[8px] font-black bg-luxury-blue text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Fiscal</span>
            )}
            {sale.services ? (
              <span className="text-[8px] font-black bg-luxury-red text-white px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">Lavado</span>
            ) : (
              <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider">📦 Prod</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            {new Date(sale.created_at).toLocaleDateString()} — {sale.payment_method}
            {sale.client_name && <span className="text-slate-600 border-l border-slate-300 pl-1 ml-1">{sale.client_name}</span>}
          </p>
        </div>
      </div>
      <div className="text-right flex items-center gap-4">
        <div className="text-right">
          <span className="font-black text-luxury-red text-lg block leading-none">RD${Number(sale.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${sale.payment_method === 'Efectivo' ? 'text-emerald-500' : 'text-blue-500'}`}>{sale.payment_method}</span>
        </div>
        <button
          onClick={() => onPrint(sale)}
          className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-luxury-blue shadow-sm"
        >
          <BarChart3 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SaleHistoryItem;
