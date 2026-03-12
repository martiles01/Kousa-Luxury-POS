import React from 'react';
import { Plus } from 'lucide-react';

const NewWashModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  newWash, 
  setNewWash, 
  services, 
  employees = [], 
  companies = [],
  isFleetVehicle,
  setIsFleetVehicle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-xl shadow-2xl scale-in-center overflow-y-auto max-h-[95vh] border-4 border-luxury-red/5">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter">NUEVO SERVICIO</h3>
          <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400 hover:text-slate-900 transition-colors">×</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Categoría de Vehículo</label>
            <div className="flex gap-4 p-2 bg-slate-50 rounded-3xl border border-slate-100">
              <button
                type="button"
                onClick={() => setNewWash({ ...newWash, type: 'car', gama: 'estandar' })}
                className={`flex-1 py-4 rounded-2xl font-black transition-all text-xs tracking-widest ${newWash.type === 'car' ? 'bg-white text-luxury-red shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                CARRO / SUV
              </button>
              <button
                type="button"
                onClick={() => setNewWash({ ...newWash, type: 'moto', gama: 'moto' })}
                className={`flex-1 py-4 rounded-2xl font-black transition-all text-xs tracking-widest ${newWash.type === 'moto' ? 'bg-white text-luxury-blue shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                MOTOCICLETA
              </button>
            </div>
          </div>

          {newWash.type === 'car' && (
            <div className="flex gap-2 p-1 bg-slate-50/50 rounded-2xl">
              {['estandar', 'media', 'alta'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setNewWash({ ...newWash, gama: g })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${newWash.gama === g ? 'bg-luxury-dark text-white' : 'text-slate-400 hover:bg-slate-200'}`}
                >
                  {g === 'estandar' ? 'Económico' : g === 'media' ? 'Gama Media' : 'Gama Alta'}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Teléfono / WhatsApp (Opcional)</label>
            <input
              type="tel"
              placeholder="Ej: 8095551234"
              className="w-full p-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-green-500 outline-none transition-all font-mono font-bold text-slate-800"
              value={newWash.client_phone}
              onChange={(e) => setNewWash({ ...newWash, client_phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Número de Placa</label>
              <input
                type="text"
                placeholder="Ej: A123456"
                required
                className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-mono font-black uppercase text-slate-800 text-xl tracking-tighter"
                value={newWash.plate}
                onChange={(e) => setNewWash({ ...newWash, plate: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Marca / Modelo</label>
              <input
                type="text"
                placeholder="Ej: Toyota Hilux"
                className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all text-slate-800 font-bold"
                value={newWash.model}
                onChange={(e) => setNewWash({ ...newWash, model: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Asignar Empleado</label>
              <select
                className="w-full mt-2 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all text-slate-800 font-bold"
                value={newWash.employee_id || ''}
                onChange={(e) => setNewWash({ ...newWash, employee_id: e.target.value })}
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">¿Es un Vehículo de Flota?</label>
              <div className="mt-2 flex flex-col gap-4">
                <select
                  className={`w-full p-5 rounded-3xl bg-slate-50 border-2 outline-none transition-all font-bold ${isFleetVehicle ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-800'}`}
                  value={isFleetVehicle?.company_id || ''}
                  onChange={(e) => {
                    const companyId = e.target.value;
                    if (!companyId) {
                      setIsFleetVehicle(null);
                    } else {
                      const company = companies.find(c => c.id === companyId);
                      setIsFleetVehicle({ company_id: companyId, companies: { name: company.name } });
                    }
                  }}
                >
                  <option value="">No es de flota / Particular</option>
                  {companies.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name} {comp.rnc ? `(RNC: ${comp.rnc})` : ''}</option>
                  ))}
                </select>
                {isFleetVehicle && (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black">✓</div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Identificado como Flota</p>
                      <p className="text-sm font-black text-emerald-900">{isFleetVehicle.companies?.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Seleccionar Servicio</label>
            <div className="relative">
              <select
                required
                className="w-full mt-1 p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all appearance-none text-slate-800 font-bold pr-12"
                value={newWash.service_id}
                onChange={(e) => setNewWash({ ...newWash, service_id: e.target.value })}
              >
                <option value="">Buscar servicio...</option>
                {services.filter(s => {
                  const name = s.name.toLowerCase();
                  if (newWash.type === 'moto') return name.includes('motor');
                  if (newWash.gama === 'alta') return name.includes('alta') || name.includes('luxury') || name.includes('vip');
                  if (newWash.gama === 'media') return !name.includes('básico') && !name.includes('motor');
                  return name.includes('básico') || name.includes('express');
                }).map(s => (
                  <option key={s.id} value={s.id}>{s.name} — RD${s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><Plus size={16} /></div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-6 bg-luxury-blue text-white rounded-[1.8rem] font-black hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/40 uppercase text-xs tracking-[0.3em] active:scale-95"
          >
            REGISTRAR SERVICIO
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewWashModal;
