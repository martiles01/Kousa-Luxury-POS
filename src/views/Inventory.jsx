import React from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Inventory = ({ 
    inventory, 
    setIsInventoryModalOpen, 
    setEditingItem, 
    setIsEditModalOpen, 
    handleDeleteProduct, 
    fetchData 
}) => {
    return (
        <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-dark text-white">
                <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Stock</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Suministros y Accesorios</p>
                </div>
                <button
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="bg-luxury-red px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
                >
                    + Nuevo Item
                </button>
            </div>
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
                                            onClick={() => {
                                                setEditingItem({ ...item });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                                            title="Editar Producto"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await supabase.from('inventory').update({ stock: item.stock + 10 }).eq('id', item.id);
                                                fetchData();
                                            }}
                                            className="bg-slate-100 hover:bg-slate-900 hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                                            title="Sumar 10"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(item.id)}
                                            className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                                            title="Eliminar"
                                        >
                                            <span className="font-bold">×</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
