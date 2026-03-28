import React from 'react';

const EmployeeModal = ({
    isOpen,
    onClose,
    newEmployee,
    setNewEmployee,
    handleAddEmployee
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Nuevo Colaborador</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registro de Personal y Comisiones</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
                </div>
                <form onSubmit={handleAddEmployee} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre Completo</label>
                        <input
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-slate-800 transition-all"
                            placeholder="Ej. Juan Pérez"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Teléfono</label>
                            <input
                                type="tel"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-slate-800 transition-all"
                                placeholder="809-000-0000"
                                value={newEmployee.phone}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Comisión %</label>
                            <input
                                required
                                type="number"
                                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none font-bold text-luxury-red transition-all"
                                value={newEmployee.commission_rate}
                                onChange={(e) => setNewEmployee({ ...newEmployee, commission_rate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Puesto / Rol</label>
                        <select
                            required
                            className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold appearance-none text-slate-800 transition-all"
                            value={newEmployee.role}
                            onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        >
                            <option value="Lavador">Lavador</option>
                            <option value="Pulidor">Pulidor</option>
                            <option value="Detallador">Detallador VIP</option>
                            <option value="Cajero">Cajero / Recepción</option>
                            <option value="Gerente">Gerencia</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-luxury-red">
                        REGISTRAR EMPRESA
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
