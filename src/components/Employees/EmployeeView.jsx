import React from 'react';
import { Users } from 'lucide-react';

const EmployeeView = ({ 
  employees, 
  commissions, 
  onOpenEmployeeModal, 
  onDeleteEmployee 
}) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Commissions Summary */}
      <div className="bg-white rounded-[3rem] shadow-sm p-10 border border-slate-100">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Reporte de Comisiones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commissions.map(emp => (
            <div key={emp.id} className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-luxury-blue transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-luxury-blue shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-800 uppercase text-sm">{emp.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.services_count} Servicios realizados</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Total Ventas</span>
                  <span className="text-slate-600">RD${emp.total_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-end border-t border-slate-200 pt-2">
                  <span className="text-[10px] font-black uppercase text-luxury-red">Comisión Ganada</span>
                  <span className="text-xl font-black text-luxury-red">RD${emp.commission_earned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          ))}
          {commissions.length === 0 && (
            <div className="col-span-full py-10 text-center opacity-20 italic font-bold">Sin datos de comisiones en este periodo</div>
          )}
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-blue text-white">
          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Personal</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Nómina y Comisiones</p>
          </div>
          <button
            onClick={() => onOpenEmployeeModal()}
            className="bg-white text-luxury-blue px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg"
          >
            + Nuevo Empleado
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6 text-slate-800">Nombre / Rol</th>
                <th className="px-10 py-6">Cédula</th>
                <th className="px-10 py-6">Teléfono</th>
                <th className="px-10 py-6 text-center">Tasa Comisión</th>
                <th className="px-10 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-luxury-blue">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-mono text-sm">{emp.cedula || '---'}</td>
                  <td className="px-10 py-6 font-mono text-sm">{emp.phone || '---'}</td>
                  <td className="px-10 py-6 text-center">
                    <span className="px-3 py-1 bg-blue-50 text-luxury-blue rounded-full text-xs font-black">
                      {emp.commission_rate}%
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onOpenEmployeeModal(emp)}
                        className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center opacity-20">
                    <Users size={64} className="mx-auto mb-4" />
                    <p className="text-xl font-black uppercase">No hay empleados registrados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
