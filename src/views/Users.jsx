import React from 'react';
import { Plus, Shield, UserCheck, XCircle } from 'lucide-react';

const Users = ({
    currentUserRole,
    setIsUserModalOpen,
    userProfiles,
    setEditingUser,
    setIsEditUserModalOpen,
    handleDeleteUserProfile,
    session
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl sticky top-0 z-10 mx-1">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-luxury-blue text-white rounded-2xl shadow-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Gestión de Accesos</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seguridad y Roles del Sistema</p>
                    </div>
                </div>
                {currentUserRole === 'Administrador' && (
                    <button
                        onClick={() => setIsUserModalOpen(true)}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-blue transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={16} /> Crear Acceso
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                {userProfiles.map((user) => (
                    <div key={user.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${user.role === 'Administrador' ? 'bg-red-50 text-luxury-red' : 'bg-blue-50 text-luxury-blue'}`}>
                                <UserCheck size={24} />
                            </div>
                            {currentUserRole === 'Administrador' && user.email !== session?.user?.email && (
                                <button
                                    onClick={() => handleDeleteUserProfile(user.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    title="Eliminar Acceso"
                                >
                                    <XCircle size={20} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="font-black text-slate-800 text-lg truncate" title={user.email}>{user.email}</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                    user.role === 'Administrador' 
                                    ? 'bg-luxury-red text-white' 
                                    : 'bg-luxury-blue text-white'
                                }`}>
                                    {user.role}
                                </span>
                                {user.email === session?.user?.email && (
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                        Tú
                                    </span>
                                )}
                            </div>
                        </div>

                        {currentUserRole === 'Administrador' && (
                            <div className="mt-8 pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => {
                                        setEditingUser(user);
                                        setIsEditUserModalOpen(true);
                                    }}
                                    className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-blue hover:text-white transition-all shadow-inner"
                                >
                                    Cambiar Permisos
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {userProfiles.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mx-1">
                    <Shield className="mx-auto mb-4 text-slate-200" size={64} />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Cargando perfiles de seguridad...</p>
                </div>
            )}
        </div>
    );
};

export default Users;
