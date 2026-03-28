import React from 'react';
import { LogOut, Plus, Settings, FileText } from 'lucide-react';

const Config = ({
    currentUserRole,
    setIsUserModalOpen,
    userProfiles,
    setEditingUser,
    setIsEditUserModalOpen,
    handleDeleteUserProfile,
    session,
    ncfSequences,
    handleUpdateNCF,
    handleLogout
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] shadow-xl p-10 border border-slate-100 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-luxury-blue text-white rounded-3xl shadow-lg shadow-blue-900/20">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Configuraciones</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ajustes Técnicos y de Facturación</p>
                    </div>
                </div>

                {currentUserRole === 'Administrador' ? (
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Secuencias NCF</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comprobantes Fiscales</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ncfSequences.map(seq => (
                                <div key={seq.id} className="bg-white p-6 rounded-3xl border border-slate-200">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                                {seq.type === 'final' ? 'Consumidor Final' : 'Crédito Fiscal'}
                                            </span>
                                            <h5 className="text-2xl font-black text-slate-800 mt-2 tracking-tighter">{seq.prefix}</h5>
                                        </div>
                                        <div className={`w-3 h-3 rounded-full ${seq.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Número Actual</label>
                                            <div className="flex gap-2 mt-1">
                                                <input
                                                    type="number"
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-black text-slate-800 outline-none focus:border-luxury-blue"
                                                    defaultValue={seq.current_number}
                                                    onBlur={(e) => handleUpdateNCF(seq.id, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Límite</span>
                                            <span className="text-[10px] font-black text-slate-800">{seq.max_number}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-luxury-blue rounded-full"
                                                style={{ width: `${(seq.current_number / (seq.max_number || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">!</div>
                        <p className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Tu cuenta no tiene permisos para realizar configuraciones técnicas.</p>
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-center text-slate-400">
                    <div className="text-[10px] font-black uppercase tracking-widest">Rol / Sesión</div>
                    <div className="font-bold text-sm text-slate-800">
                        <span className="text-luxury-red uppercase mr-2 tracking-widest">{currentUserRole}</span>
                        {session?.user?.email}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <button
                    onClick={handleLogout}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                    <LogOut size={20} /> CERRAR SESIÓN
                </button>
            </div>
        </div>
    );
};

export default Config;
