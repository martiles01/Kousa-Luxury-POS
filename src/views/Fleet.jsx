import React from 'react';
import { Plus, Building } from 'lucide-react';

const Fleet = ({ 
    companies, 
    fleetVehicles, 
    handleDeleteCompany, 
    setIsCompanyModalOpen, 
    setSelectedCompanyForFleet, 
    setIsFleetModalOpen 
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl sticky top-0 z-10 mx-1">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-luxury-blue text-white rounded-2xl shadow-lg">
                        <Building size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Cuentas Corporativas</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión de Flotillas y Créditos</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCompanyModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-blue transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                    <Plus size={16} /> Nueva Empresa
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {companies.map(company => (
                    <div key={company.id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col relative group">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteCompany(company.id)} className="text-slate-300 hover:text-red-500 transition-colors text-xl font-bold">×</button>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-luxury-blue text-2xl font-black shadow-inner">
                                {company.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{company.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">RNC: {company.rnc || '---'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Pendiente</p>
                                <p className={`text-lg font-black ${Number(company.balance) > 0 ? 'text-luxury-red' : 'text-emerald-500'}`}>
                                    RD${Number(company.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehículos</p>
                                <p className="text-lg font-black text-slate-800">
                                    {fleetVehicles.filter(v => v.company_id === company.id).length} Unidades
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div>
                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Flotilla Registrada</h5>
                                <div className="flex flex-wrap gap-2">
                                    {fleetVehicles.filter(v => v.company_id === company.id).slice(0, 8).map(vehicle => (
                                        <span key={vehicle.plate} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black font-mono">
                                            {vehicle.plate}
                                        </span>
                                    ))}
                                    <button
                                        className="px-3 py-1.5 bg-luxury-blue/10 text-luxury-blue rounded-lg text-[10px] font-black hover:bg-luxury-blue hover:text-white transition-all"
                                        onClick={() => {
                                            setSelectedCompanyForFleet(company);
                                            setIsFleetModalOpen(true);
                                        }}
                                    >
                                        + Gestionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {companies.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-20">
                        <Building size={80} className="mx-auto mb-4" />
                        <p className="text-2xl font-black uppercase tracking-tighter">No hay empresas registradas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fleet;
