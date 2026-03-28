import React from 'react';

const InventoryModal = ({
    isOpen,
    onClose,
    itemsToCreate,
    setItemsToCreate,
    handleAddInventoryItem
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Nuevo Producto</h3>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <form onSubmit={handleAddInventoryItem} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre del Producto</label>
                        <input
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-slate-800 transition-all"
                            value={itemsToCreate.name}
                            onChange={(e) => setItemsToCreate({ ...itemsToCreate, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Precio RD$</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-luxury-red transition-all"
                                value={itemsToCreate.price}
                                onChange={(e) => setItemsToCreate({ ...itemsToCreate, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Stock Inicial</label>
                            <input
                                required
                                type="number"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-slate-800 transition-all"
                                value={itemsToCreate.stock}
                                onChange={(e) => setItemsToCreate({ ...itemsToCreate, stock: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoría del Producto</label>
                        <select
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold appearance-none text-slate-800 transition-all"
                            value={itemsToCreate.category}
                            onChange={(e) => setItemsToCreate({ ...itemsToCreate, category: e.target.value })}
                        >
                            <option value="Agua">Aguas</option>
                            <option value="Cerveza">Cervezas</option>
                            <option value="Licores">Alcoholes y Licores</option>
                            <option value="Energizantes">Bebidas Energizantes</option>
                            <option value="Refrescos">Refrescos / Sodas</option>
                            <option value="Accesorio">Accesorios</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Químicos">Químicos</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Icono</label>
                        <div className="grid grid-cols-6 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            {['📦', '🥤', '🍺', '🧊', '🍫', '🌲', '🧼', '✨', '🔧', '🧴', '🍟', '💧'].map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setItemsToCreate({ ...itemsToCreate, icon })}
                                    className={`text-2xl p-2 rounded-xl hover:bg-white hover:scale-110 transition-all ${itemsToCreate.icon === icon ? 'bg-luxury-blue shadow-lg scale-110' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full py-6 bg-luxury-red text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 transition-all hover:bg-red-800">
                        AGREGAR AL INVENTARIO
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InventoryModal;
