import React from 'react';

const CompanyModal = ({
    isOpen,
    onClose,
    newCompany,
    setNewCompany,
    handleAddCompany
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Nueva Empresa</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Crédito y Flotillas Corporativas</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <form onSubmit={handleAddCompany} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Razón Social / Nombre</label>
                        <input
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                            placeholder="Ej. Constructora X, S.A."
                            value={newCompany.name}
                            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">RNC</label>
                            <input
                                required
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                                placeholder="101-XXXXX-X"
                                value={newCompany.rnc}
                                onChange={(e) => setNewCompany({ ...newCompany, rnc: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teléfono</label>
                            <input
                                type="tel"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                                placeholder="809-XXX-XXXX"
                                value={newCompany.phone}
                                onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email de Contacto</label>
                        <input
                            type="email"
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold text-slate-800"
                            placeholder="contabilidad@empresa.com"
                            value={newCompany.email}
                            onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-luxury-blue">
                        REGISTRAR EMPRESA
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanyModal;
