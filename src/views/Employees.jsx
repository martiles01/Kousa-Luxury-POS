import React from 'react';
import { Plus, Users } from 'lucide-react';

const Employees = ({ 
    employees, 
    setIsEmployeeModalOpen, 
    handleDeleteEmployee 
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl sticky top-0 z-10 mx-1">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-luxury-red text-white rounded-2xl shadow-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Gestión de Personal</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lavadores y Staff</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEmployeeModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-red transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                    <Plus size={16} /> Agregar Empleado
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Comisión</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{emp.name}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs font-bold text-slate-500">{emp.phone || '---'}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-widest">{emp.role}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-luxury-red">{emp.commission_rate}%</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`w-3 h-3 rounded-full inline-block ${emp.active ? 'bg-emerald-500' : 'bg-slate-300 shadow-inner'}`}></span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => handleDeleteEmployee(emp.id)}
                                        className="p-3 bg-red-50 text-luxury-red rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-luxury-red hover:text-white"
                                    >
                                        <span className="font-bold">×</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center opacity-20 italic font-black">No hay empleados registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;
