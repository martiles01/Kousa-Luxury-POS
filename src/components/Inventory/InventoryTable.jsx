import React from 'react';

const InventoryTable = ({ inventory, onEdit, onAddStock, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
            <th className="px-10 py-6 text-slate-800">Producto / Descripción</th>
            <th className="px-10 py-6">Stock Actual</th>
            <th className="px-10 py-6">Precio Venta</th>
            <th className="px-10 py-6">Categoría</th>
            <th className="px-10 py-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
          {inventory.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-10 py-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl filter saturate-50">{item.icon}</span>
                  <span className="font-black text-sm uppercase tracking-tight">{item.name}</span>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {item.stock} UNIDADES
                </span>
              </td>
              <td className="px-10 py-6 font-mono font-black text-sm">RD${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="px-10 py-6 text-[10px] font-black uppercase opacity-40 tracking-widest text-luxury-blue">{item.category}</td>
              <td className="px-10 py-6 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onAddStock(item.id, item.stock)}
                    className="bg-slate-100 hover:bg-slate-900 hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
