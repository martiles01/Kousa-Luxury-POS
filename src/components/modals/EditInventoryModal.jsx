import React from 'react';

const EditInventoryModal = ({
    isOpen,
    onClose,
    editingItem,
    setEditingItem,
    handleUpdateProduct
}) => {
    if (!isOpen || !editingItem) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Editar Producto</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Modificar Atributos de Inventario</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <form onSubmit={handleUpdateProduct} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre del Producto</label>
                        <input
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800 transition-all"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Precio RD$</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-luxury-red transition-all"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoría</label>
                            <select
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none text-slate-800 transition-all"
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            >
                                <option value="Producto">Producto</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Accesorio">Accesorio</option>
                                <option value="Químicos">Químicos</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Icono</label>
                        <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            {['📦', '🥤', '🍺', '🧊', '🍫', '🌲', '🧼', '✨', '🔧', '🧴', '🍟', '💧'].map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setEditingItem({ ...editingItem, icon })}
                                    className={`text-2xl p-2 rounded-xl hover:bg-white hover:scale-110 transition-all ${editingItem.icon === icon ? 'bg-luxury-blue shadow-lg scale-110' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900">
                        GUARDAR CAMBIOS
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditInventoryModal;
