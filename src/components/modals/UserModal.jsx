import React from 'react';

const UserModal = ({
    isOpen,
    onClose,
    newUser,
    setNewUser,
    handleCreateUser
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center border border-white/20">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Registrar Acceso</h3>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                        <input
                            required
                            type="email"
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Contraseña</label>
                            <input
                                required
                                type="password"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Rol de Usuario</label>
                            <select
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none text-slate-800 transition-all"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="Agente">Agente</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all hover:bg-blue-900">
                        CREAR ACCESO
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
