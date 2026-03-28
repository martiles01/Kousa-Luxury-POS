import React from 'react';

const EditUserModal = ({
    isOpen,
    onClose,
    editingUser,
    setEditingUser,
    handleUpdateUserRole
}) => {
    if (!isOpen || !editingUser) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Editar Rol de Usuario</h3>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Usuario</p>
                        <p className="font-black text-slate-800">{editingUser.email}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nuevo Rol</label>
                        <select
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none text-slate-800 transition-all"
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        >
                            <option value="Agente">Agente</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>
                    <button
                        onClick={() => handleUpdateUserRole(editingUser.id, editingUser.role)}
                        className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900"
                    >
                        GUARDAR CAMBIOS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
