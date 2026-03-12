import React, { useState, useEffect } from 'react';
import { Plus, History, DollarSign, Edit2, Car } from 'lucide-react';

export const FleetModal = ({ isOpen, onClose, company, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', rnc: '', phone: '', email: '', 
    credit_limit: 0, address: '', contact_person: '', representative_phone: ''
  });

  useEffect(() => {
    if (company) setFormData({ ...company });
    else setFormData({ name: '', rnc: '', phone: '', email: '', credit_limit: 0, address: '', contact_person: '', representative_phone: '' });
  }, [company, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
            {company ? 'Editar Empresa' : 'Nueva Empresa'}
          </h3>
          <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400 hover:text-slate-900">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Razón Social</label>
            <input
              required
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">RNC</label>
              <input
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.rnc}
                onChange={(e) => setFormData({ ...formData, rnc: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Teléfono Empresa</label>
              <input
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Límite de Crédito RD$</label>
            <input
              type="number"
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
              value={formData.credit_limit}
              onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Persona de Contacto</label>
            <input
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
            {company ? 'GUARDAR CAMBIOS' : 'REGISTRAR EMPRESA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const VehicleModal = ({ isOpen, onClose, vehicle, companyId, companies, onSubmit }) => {
  const [formData, setFormData] = useState({ plate: '', model: '', company_id: '' });

  useEffect(() => {
    if (vehicle) setFormData({ ...vehicle });
    else setFormData({ plate: '', model: '', company_id: companyId || '' });
  }, [vehicle, companyId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-lg shadow-2xl scale-in-center">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
            {vehicle ? 'Editar Vehículo' : 'Vincular Vehículo'}
          </h3>
          <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Empresa</label>
            <select
              required
              disabled={!!companyId && !vehicle}
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
              value={formData.company_id}
              onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
            >
              <option value="">Seleccionar empresa...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Placa</label>
              <input
                required
                disabled={!!vehicle}
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold uppercase"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modelo</label>
              <input
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-luxury-blue outline-none font-bold"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-6 bg-luxury-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            {vehicle ? 'GUARDAR CAMBIOS' : 'VINCULAR A FLOTA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const FleetHistoryModal = ({ isOpen, onClose, company, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[4rem] p-12 w-full max-w-3xl shadow-2xl scale-in-center overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{company?.name}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Historial de Transacciones y Pagos</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 p-5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">×</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
          {history.length === 0 && <p className="text-center py-20 text-slate-300 font-bold italic">No hay movimientos registrados</p>}
          {history.map((item, idx) => (
            <div key={idx} className={`p-6 rounded-[2.5rem] border ${item.type === 'SALE' ? 'bg-red-50/30 border-red-100/50' : 'bg-emerald-50/30 border-emerald-100/50'} flex justify-between items-center group hover:bg-white transition-all`}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-xl shadow-sm ${item.type === 'SALE' ? 'bg-luxury-red text-white' : 'bg-emerald-500 text-white'}`}>
                  {item.type === 'SALE' ? <Car size={24} /> : <DollarSign size={24} />}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{item.type === 'SALE' ? `SERVICIO: ${item.services?.name || 'Lavado'}` : 'PAGO RECIBIDO'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {new Date(item.date).toLocaleString()} {item.vehicle_plate ? `— PLACA: ${item.vehicle_plate}` : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black ${item.type === 'SALE' ? 'text-luxury-red' : 'text-emerald-600'}`}>
                  {item.type === 'SALE' ? '-' : '+'} RD${Number(item.amount).toLocaleString()}
                </p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Balance Actualizado</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FleetPaymentModal = ({ isOpen, onClose, company, onSubmit }) => {
  const [formData, setFormData] = useState({ amount: '', method: 'Efectivo', notes: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-md shadow-2xl scale-in-center">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Registrar Pago</h3>
            <p className="text-[10px] font-black text-luxury-red uppercase tracking-widest mt-1">{company?.name}</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400">×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deuda Pendiente</span>
            <span className="text-xl font-black text-luxury-red">RD${Number(company?.current_balance || 0).toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Monto del Pago</label>
            <input
              required
              type="number"
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-black text-xl text-emerald-600"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Método de Pago</label>
            <select
              required
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            >
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Transferencia">🔄 Transferencia</option>
              <option value="Cheque">📄 Cheque</option>
            </select>
          </div>

          <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
            CONFIRMAR PAGO
          </button>
        </form>
      </div>
    </div>
  );
};
