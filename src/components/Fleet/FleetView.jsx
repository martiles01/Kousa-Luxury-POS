import React, { useState } from 'react';
import { Package, FileText, DollarSign, History, Edit2, Plus, Car, Trash2 } from 'lucide-react';

const FleetView = ({ 
  companies, 
  fleetVehicles, 
  onOpenHistory, 
  onOpenPayment, 
  onOpenFleetModal, 
  onOpenVehicleModal,
  onDeleteCompany
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Empresas</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{companies.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-red-50 text-luxury-red rounded-3xl flex items-center justify-center shadow-lg border border-red-100">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Deuda Total</p>
            <p className="text-3xl font-black text-luxury-red tracking-tighter">
              RD${companies.reduce((acc, c) => acc + Number(c.current_balance || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg border border-emerald-100">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Crédito Libre</p>
            <p className="text-3xl font-black text-emerald-600 tracking-tighter">
              RD${companies.reduce((acc, c) => acc + Math.max(0, Number(c.credit_limit || 0) - Number(c.current_balance || 0)), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-luxury-blue text-white">
          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase">Gestión de Flotillas</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Clientes Corporativos y Vehículos</p>
          </div>
          <button
            onClick={() => onOpenFleetModal()}
            className="bg-white text-luxury-blue px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg"
          >
            + Nueva Empresa
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-6 text-slate-800">Empresa / RNC</th>
                <th className="px-10 py-6">Representante</th>
                <th className="px-10 py-6">Deuda Actual / Límite</th>
                <th className="px-10 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-800 font-medium">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-luxury-blue">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">{company.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">RNC: {company.rnc || '---'}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {fleetVehicles
                            .filter(v => v.company_id === company.id)
                            .map(vehicle => (
                              <button
                                key={vehicle.plate}
                                onClick={() => onOpenVehicleModal(vehicle)}
                                className="text-[9px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 uppercase hover:bg-luxury-blue hover:text-white transition-all flex items-center gap-1 group"
                              >
                                {vehicle.plate} {vehicle.model ? `(${vehicle.model})` : ''}
                                <Edit2 size={8} className="opacity-0 group-hover:opacity-100" />
                              </button>
                            ))
                          }
                          {fleetVehicles.filter(v => v.company_id === company.id).length === 0 && (
                            <span className="text-[9px] font-bold text-slate-300 italic">Sin vehículos asignados</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="font-black text-sm uppercase">{company.contact_person || '---'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{company.representative_phone || ''}</p>
                  </td>
                  <td className="px-10 py-6">
                    <div>
                      <p className={`font-black text-sm ${Number(company.current_balance || 0) > 0 ? 'text-luxury-red' : 'text-emerald-600'}`}>
                        RD${Number(company.current_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Límite: RD${Number(company.credit_limit || 0).toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onOpenHistory(company)}
                        className="bg-slate-100 hover:bg-slate-900 hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                        title="Ver Historial"
                      >
                        <History size={16} />
                      </button>
                      <button
                        onClick={() => onOpenPayment(company)}
                        className="bg-emerald-50 hover:bg-emerald-600 hover:text-white p-3 rounded-xl text-emerald-600 transition-all shadow-sm active:scale-90"
                        title="Registrar Pago"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button
                        onClick={() => onOpenFleetModal(company)}
                        className="bg-slate-100 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-slate-600 transition-all shadow-sm active:scale-90"
                        title="Editar Empresa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onOpenVehicleModal(null, company.id)}
                        className="bg-blue-50 hover:bg-luxury-blue hover:text-white p-3 rounded-xl text-luxury-blue transition-all shadow-sm active:scale-90"
                        title="Vincular Vehículo"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteCompany(company.id)}
                        className="bg-red-50 hover:bg-luxury-red hover:text-white p-3 rounded-xl text-luxury-red transition-all shadow-sm active:scale-90"
                        title="Eliminar Empresa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center opacity-20">
                    <Car size={64} className="mx-auto mb-4" />
                    <p className="text-xl font-black uppercase">No hay empresas registradas</p>
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

export default FleetView;
