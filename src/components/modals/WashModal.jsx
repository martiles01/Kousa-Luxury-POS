import React from 'react';
import { Plus, Users } from 'lucide-react';

const WashModal = ({
    isOpen,
    onClose,
    newWash,
    setNewWash,
    handleAddWash,
    fleetVehicles,
    companies,
    employees,
    services
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] p-10 w-full max-w-xl shadow-2xl scale-in-center overflow-y-auto max-h-[95vh] border-4 border-luxury-red/5">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">NUEVO SERVICIO</h3>
                    <button onClick={onClose} className="bg-slate-50 p-4 rounded-full text-slate-400 hover:text-slate-900 transition-colors">×</button>
                </div>

                <form onSubmit={handleAddWash} className="space-y-8">
                    {/* Tipo de Vehículo */}
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
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    placeholder="Ej: A123456"
                                    required
                                    className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all font-black text-xl font-mono uppercase tracking-tighter"
                                    value={newWash.plate}
                                    onChange={(e) => {
                                        const plate = e.target.value.toUpperCase();
                                        setNewWash({ ...newWash, plate });
                                    }}
                                />
                                {fleetVehicles.find(v => v.plate === newWash.plate) && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <span className="text-[9px] font-black bg-luxury-blue text-white px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Flotilla</span>
                                    </div>
                                )}
                            </div>
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
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Asignar Lavador (Personal)</label>
                        <div className="relative">
                            <select
                                className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-luxury-red outline-none transition-all appearance-none text-slate-800 font-bold pr-12"
                                value={newWash.employee_id}
                                onChange={(e) => setNewWash({ ...newWash, employee_id: e.target.value })}
                            >
                                <option value="">Seleccionar lavador...</option>
                                {employees.filter(emp => emp.active).map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><Users size={16} /></div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(
                            newWash.type === 'moto'
                                ? ['CG', 'Loncin', 'Yamaha', 'Suzuki', 'Bajaj']
                                : newWash.gama === 'alta'
                                    ? ['BMW', 'MB', 'Audi', 'Porsche', 'Rover']
                                    : newWash.gama === 'media'
                                        ? ['Mazda', 'Ford', 'VW', 'Chevy', 'Jeep']
                                        : ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan']
                        ).map(brand => (
                            <button
                                key={brand}
                                type="button"
                                onClick={() => setNewWash({ ...newWash, model: brand })}
                                className="text-[9px] font-black px-3 py-2 bg-slate-100 hover:bg-luxury-blue hover:text-white rounded-xl transition-all text-slate-500 uppercase tracking-tighter border border-transparent hover:border-luxury-blue"
                            >
                                {brand}
                            </button>
                        ))}
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
                                <option disabled className="text-slate-300">——— Otros Servicios ———</option>
                                {services.map(s => (
                                    <option key={`all-${s.id}`} value={s.id}>{s.name} — RD${s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><Plus size={16} /></div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            className="flex-1 py-6 bg-luxury-blue text-white rounded-[1.8rem] font-black hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/40 uppercase text-xs tracking-[0.3em] active:scale-95"
                        >
                            REGISTRAR SERVICIO
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WashModal;
