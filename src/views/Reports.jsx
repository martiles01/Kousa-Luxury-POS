import React from 'react';
import { BarChart3, Car } from 'lucide-react';

const Reports = ({ 
    reportFilter, 
    setReportFilter, 
    revenueBreakdown, 
    typeFilter, 
    setTypeFilter, 
    salesHistory, 
    serviceMetrics, 
    handlePrintInvoice 
}) => {
    return (
        <div className="space-y-10 text-slate-800 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl sticky top-0 z-10 mx-1">
                <h3 className="text-xl font-black uppercase tracking-tight ml-4">Periodo de Reporte</h3>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {[
                        { id: 'today', label: 'Hoy' },
                        { id: 'week', label: '7 Días' },
                        { id: 'month', label: 'Mes' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setReportFilter(f.id)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportFilter === f.id ? 'bg-luxury-red text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-luxury-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Recaudación Total</p>
                    <h4 className="text-3xl font-black mt-2 tracking-tighter">RD${(revenueBreakdown.washes + revenueBreakdown.products).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Servicios</p>
                    <h4 className="text-3xl font-black mt-2 tracking-tighter text-luxury-red">RD${revenueBreakdown.washes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Venta Productos</p>
                    <h4 className="text-3xl font-black mt-2 tracking-tighter text-luxury-blue">RD${revenueBreakdown.products.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                </div>
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Estado Contable</p>
                    <h4 className="text-2xl font-black mt-2 tracking-tighter text-emerald-600 uppercase">Auditado</h4>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm p-10 border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Historial de Ventas</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transacciones en periodo seleccionado</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Todos</button>
                            <button onClick={() => setTypeFilter('services')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'services' ? 'bg-white shadow-sm text-luxury-red' : 'text-slate-400 hover:text-slate-600'}`}>Servicios</button>
                            <button onClick={() => setTypeFilter('products')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === 'products' ? 'bg-white shadow-sm text-luxury-blue' : 'text-slate-400 hover:text-slate-600'}`}>Productos</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {salesHistory
                            .filter(sale => {
                                if (typeFilter === 'services') return sale.services;
                                if (typeFilter === 'products') return sale.sale_items && sale.sale_items.length > 0;
                                return true;
                            })
                            .map(sale => (
                                <div key={sale.id} className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center hover:bg-white border border-transparent hover:border-slate-100 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm font-black text-luxury-blue group-hover:bg-luxury-blue group-hover:text-white transition-colors">#</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-black text-slate-800 text-sm uppercase">Venta #{sale.id.slice(0, 5)}</p>
                                                {sale.invoice_type === 'fiscal' && (
                                                    <span className="text-[8px] font-black bg-luxury-blue text-white px-2 py-0.5 rounded-md uppercase tracking-wider">Fiscal</span>
                                                )}
                                                {sale.services ? (
                                                    <span className="text-[8px] font-black bg-luxury-red text-white px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1"><Car size={8} /> Lavado</span>
                                                ) : (
                                                    <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">📦 Prod</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                {new Date(sale.created_at).toLocaleDateString()} — {sale.payment_method}
                                                {sale.client_name && <span className="text-slate-600 border-l border-slate-300 pl-1 ml-1">{sale.client_name}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="font-black text-luxury-red text-lg block leading-none">RD${Number(sale.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${sale.payment_method === 'Efectivo' ? 'text-emerald-500' : 'text-blue-500'}`}>{sale.payment_method}</span>
                                        </div>
                                        <button
                                            onClick={() => handlePrintInvoice(sale)}
                                            className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-luxury-blue shadow-sm"
                                            title="Imprimir Factura"
                                        >
                                            <BarChart3 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        {salesHistory.length === 0 && <p className="text-center py-20 opacity-20 italic font-black">No hay transacciones en este periodo</p>}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm p-10 border border-slate-100 h-fit">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Servicios Top</h3>
                    <div className="space-y-6">
                        {serviceMetrics.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black">{idx + 1}</div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">{m.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cant: {m.count}</p>
                                    </div>
                                </div>
                                <div className="text-luxury-red"><BarChart3 size={16} /></div>
                            </div>
                        ))}
                        {serviceMetrics.length === 0 && <p className="text-center py-10 opacity-20 italic font-bold">Sin datos</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
