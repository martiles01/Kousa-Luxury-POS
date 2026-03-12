import React from 'react';
import { ShoppingCart, Car } from 'lucide-react';

const WashCard = ({ item, onUpdateProgress, onDeleteWash, onPay }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative group">
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onDeleteWash(item.id)} className="text-slate-300 hover:text-luxury-red transition-colors text-xl font-bold">×</button>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center font-mono font-black text-xl text-white shadow-xl shadow-slate-900/20">
          {item.vehicle_plate}
        </div>
        <div>
          <h4 className="font-black text-slate-800 uppercase tracking-tight leading-tight">{item.vehicle_model}</h4>
          <p className="text-[10px] font-black text-luxury-blue uppercase tracking-[0.2em] mt-1">{item.services?.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Estado: {item.status}</span>
          <span className="text-sm font-black text-slate-800">{item.progress}%</span>
        </div>
        <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
          <div className="h-full bg-luxury-red rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(185,28,28,0.4)]" style={{ width: `${item.progress}%` }}></div>
        </div>
        <div className="flex gap-2 pt-4">
          {item.progress < 100 ? (
            <>
              <button onClick={() => onUpdateProgress(item.id, item.progress)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-dark transition-all active:scale-95 shadow-lg shadow-slate-900/10">Avanzar</button>
              <button onClick={() => onUpdateProgress(item.id, 80)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"><Car size={16} className="text-slate-400" /></button>
            </>
          ) : (
            <button
              onClick={() => onPay(item)}
              className="flex-1 py-4 bg-luxury-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> Cobrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WashCard;
