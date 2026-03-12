import React from 'react';

const QueueItem = ({ item, onUpdateProgress, onDeleteWash, onPay }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-luxury-red shadow-sm">
          {item.vehicle_plate.slice(0, 2)}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{item.vehicle_plate}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.services?.name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {item.client_phone && (
          <a
            href={`https://wa.me/${item.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(item.status === 'completed'
              ? `Hola! Tu vehículo ${item.vehicle_model} [${item.vehicle_plate}] está listo para retirar. Total a pagar: RD$${Number(item.services?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por preferir Kousa Luxury!`
              : `Hola! Tu vehículo ${item.vehicle_model} [${item.vehicle_plate}] ha iniciado su proceso de lavado en Kousa Luxury.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
            title="Enviar WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>
        )}
        <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center">
          {item.status}
        </span>
      </div>
    </div>
  );
};

export default QueueItem;
