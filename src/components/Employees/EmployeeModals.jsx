import React, { useState, useEffect } from 'react';

export const EmployeeModal = ({ isOpen, onClose, employee, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', role: 'Lavador', commission_rate: 15,
    cedula: '', address: '', emergency_contact: '', emergency_phone: '',
    join_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (employee) setFormData({ ...employee });
    else setFormData({
      name: '', phone: '', role: 'Lavador', commission_rate: 15,
      cedula: '', address: '', emergency_contact: '', emergency_phone: '',
      join_date: new Date().toISOString().split('T')[0]
    });
  }, [employee, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
          <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-full">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre Completo</label>
              <input
                required
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cédula</label>
              <input
                placeholder="001-0000000-0"
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono</label>
              <input
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol</label>
              <select
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Lavador">Lavador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Detallador">Detallador</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">% Comisión</label>
              <input
                type="number"
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.commission_rate}
                onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
            {employee ? 'GUARDAR CAMBIOS' : 'REGISTRAR EMPLEADO'}
          </button>
        </form>
      </div>
    </div>
  );
};
