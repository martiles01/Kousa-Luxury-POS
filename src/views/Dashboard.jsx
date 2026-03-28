import React from 'react';
import { Car, ShoppingCart, FileText, Plus, Package, BarChart3, Settings, Users, Layout, Eye, EyeOff, Save } from 'lucide-react';

const Dashboard = ({ 
  stats, 
  revenueBreakdown, 
  ncfSequences, 
  washQueue, 
  serviceMetrics, 
  salesHistory, 
  setIsWashModalOpen, 
  setActiveTab,
  dashboardConfig,
  setDashboardConfig,
  isDashboardCustomizing,
  setIsDashboardCustomizing
}) => {
  const toggleWidget = (widgetId) => {
    setDashboardConfig(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Dashboard Header with Customization Trigger */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                <Layout size={18} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Dashboard Principal</h2>
        </div>
        <button 
            onClick={() => setIsDashboardCustomizing(!isDashboardCustomizing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isDashboardCustomizing 
                ? 'bg-luxury-red text-white shadow-lg shadow-red-900/20' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
        >
            <Settings size={14} className={isDashboardCustomizing ? 'animate-spin-slow' : ''} />
            {isDashboardCustomizing ? 'Finalizar Edición' : 'Personalizar Vista'}
        </button>
      </div>

      {/* Customization Panel Overlay */}
      {isDashboardCustomizing && (
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4 duration-300 border border-white/10 mx-1 mb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Modo Edición</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Activa o desactiva módulos según tu flujo de trabajo</p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl text-luxury-red animate-pulse">
                    <Save size={20} />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                    { id: 'quickAccess', label: 'Accesos', icon: Package },
                    { id: 'statsCards', label: 'Tarjetas', icon: BarChart3 },
                    { id: 'activityQueue', label: 'Cola', icon: Car },
                    { id: 'revenueBreakdown', label: 'Ingresos', icon: ShoppingCart },
                    { id: 'popularServices', label: 'Populares', icon: Users },
                    { id: 'recentSales', label: 'Ventas', icon: FileText },
                    { id: 'newOrderCard', label: 'Acción', icon: Plus }
                ].map(widget => (
                    <button
                        key={widget.id}
                        onClick={() => toggleWidget(widget.id)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all border ${
                            dashboardConfig[widget.id] 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-black/20 border-white/5 text-white/30 grayscale'
                        }`}
                    >
                        <widget.icon size={20} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{widget.label}</span>
                        {dashboardConfig[widget.id] ? <Eye size={12} className="text-emerald-400" /> : <EyeOff size={12} />}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* Quick Access Section */}
      {dashboardConfig.quickAccess && (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 px-1 ${isDashboardCustomizing && 'opacity-50 pointer-events-none'}`}>
            {[
            { id: 'pos', label: 'Caja POS', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600', hover: 'hover:bg-emerald-600 hover:text-white', path: 'pos' },
            { id: 'queue', label: 'Cola Lavado', icon: Car, color: 'bg-luxury-red/10 text-luxury-red', hover: 'hover:bg-luxury-red hover:text-white', path: 'queue' },
            { id: 'inventory', label: 'Inventario', icon: Package, color: 'bg-luxury-blue/10 text-luxury-blue', hover: 'hover:bg-luxury-blue hover:text-white', path: 'inventory' },
            { id: 'reports', label: 'Reportes', icon: BarChart3, color: 'bg-slate-100 text-slate-600', hover: 'hover:bg-slate-900 hover:text-white', path: 'reports' }
            ].map((link) => (
            <button
                key={link.id}
                onClick={() => setActiveTab(link.path)}
                className={`flex items-center gap-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all duration-300 group ${link.hover}`}
            >
                <div className={`p-3 rounded-2xl transition-all duration-300 ${link.color} group-hover:bg-white/20 group-hover:text-white`}>
                <link.icon size={20} />
                </div>
                <span className="font-black uppercase text-[10px] tracking-widest">{link.label}</span>
            </button>
            ))}
        </div>
      )}

      {/* Stats Cards Section */}
      {dashboardConfig.statsCards && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1 ${isDashboardCustomizing && 'opacity-50 pointer-events-none'}`}>
            <div className="bg-luxury-red p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Lavados Activos</p>
                <div className="flex items-center justify-between mt-4">
                    <h4 className="text-4xl font-black">{stats.activeWashes}</h4>
                    <div className="p-3 bg-white/10 rounded-2xl"><Car size={24} /></div>
                </div>
            </div>
            <div className="bg-luxury-dark p-8 rounded-[2.5rem] text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Recaudación Total</p>
                <div className="flex items-center justify-between mt-4">
                    <h4 className="text-4xl font-black text-emerald-400">RD${(revenueBreakdown.washes + revenueBreakdown.products).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                    <div className="p-3 bg-white/10 rounded-2xl"><ShoppingCart size={24} /></div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] text-slate-800 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Bahías en Uso</p>
                <div className="flex items-center justify-between mt-4">
                    <h4 className="text-4xl font-black text-luxury-blue">{stats.activeBays}</h4>
                    <div className="p-3 bg-slate-50 rounded-2xl text-luxury-blue"><Car size={24} /></div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] text-slate-800 shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Alerta NCF</p>
                <div className="flex items-center justify-between mt-4">
                    <div>
                    <h4 className="text-2xl font-black text-slate-800 whitespace-nowrap">
                        {ncfSequences.find(s => s.is_active && s.type === 'final')?.prefix || 'B02'}
                        <span className="text-luxury-red text-sm ml-2">({Math.max(0, (ncfSequences.find(s => s.is_active && s.type === 'final')?.limit_number || 0) - (ncfSequences.find(s => s.is_active && s.type === 'final')?.current_number || 0))})</span>
                    </h4>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><FileText size={24} /></div>
                </div>
            </div>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-1 ${isDashboardCustomizing && 'opacity-50 pointer-events-none'}`}>
        {/* Activity Queue Section */}
        {dashboardConfig.activityQueue && (
            <div className="md:col-span-2 bg-white p-6 lg:p-8 rounded-[3rem] shadow-sm border border-slate-50">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Actividad en Cola</h3>
                <div className="space-y-4">
                    {washQueue.slice(0, 4).map(w => (
                    <div key={w.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-luxury-red shadow-sm">{w.vehicle_plate.slice(0, 2)}</div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{w.vehicle_plate}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{w.services?.name}</p>
                        </div>
                        </div>
                        <div className="flex gap-2">
                        {w.client_phone && (
                            <a
                            href={`https://wa.me/${w.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(w.status === 'completed'
                                ? `Hola! Tu vehículo ${w.vehicle_model} [${w.vehicle_plate}] está listo para retirar. Total a pagar: RD$${Number(w.services?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por preferir Kousa Luxury!`
                                : `Hola! Tu vehículo ${w.vehicle_model} [${w.vehicle_plate}] ha iniciado su proceso de lavado en Kousa Luxury.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
                            title="Enviar WhatsApp"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </a>
                        )}
                        <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center">{w.status}</span>
                        </div>
                    </div>
                    ))}
                    {washQueue.length === 0 && <p className="text-center py-10 text-slate-300 font-bold italic">No hay actividad reciente</p>}
                </div>
                <button onClick={() => setActiveTab('car')} className="w-full mt-6 text-xs font-black text-luxury-blue hover:underline uppercase tracking-widest">Ver cola completa</button>
            </div>
        )}

        {/* Revenue Breakdown Section */}
        {dashboardConfig.revenueBreakdown && (
            <div className="md:col-span-1 bg-white p-6 lg:p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Desglose de Ingresos</h3>
                <div className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servicios de Lavado</span>
                        <span className="text-sm font-black text-luxury-red">RD${revenueBreakdown.washes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div
                        className="h-full bg-luxury-red transition-all duration-1000"
                        style={{ width: `${Math.max(5, (revenueBreakdown.washes / (revenueBreakdown.washes + revenueBreakdown.products || 1)) * 100)}%` }}
                        ></div>
                    </div>
                    </div>
                    <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ventas de Productos</span>
                        <span className="text-sm font-black text-luxury-blue">RD${revenueBreakdown.products.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div
                        className="h-full bg-luxury-blue transition-all duration-1000"
                        style={{ width: `${Math.max(5, (revenueBreakdown.products / (revenueBreakdown.washes + revenueBreakdown.products || 1)) * 100)}%` }}
                        ></div>
                    </div>
                    </div>
                </div>
                <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Basado en filtros actuales</p>
            </div>
        )}

        {/* Action Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:col-span-3 md:col-span-3">
            {/* Popular Services Section */}
            {dashboardConfig.popularServices && (
                <div className="bg-white p-6 lg:p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Servicios Populares</h3>
                    <div className="space-y-4">
                    {serviceMetrics.slice(0, 3).map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                            <span className="font-bold text-xs text-slate-700">{m.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-luxury-red bg-red-50 px-2 py-1 rounded-md">{m.count}</span>
                        </div>
                    ))}
                    {serviceMetrics.length === 0 && <p className="text-center py-6 text-slate-300 italic text-xs">Sin datos</p>}
                    </div>
                </div>
            )}

            {/* Recent Sales Section */}
            {dashboardConfig.recentSales && (
                <div className="bg-white p-6 lg:p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Ventas Recientes</h3>
                    <div className="space-y-4">
                    {salesHistory.slice(0, 3).map(sale => (
                        <div key={sale.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                        <div>
                            <p className="font-black text-slate-800 text-[10px] uppercase">#{sale.id.slice(0, 5)}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{sale.payment_method}</p>
                        </div>
                        <span className="font-black text-luxury-red text-xs">RD${Number(sale.total_amount).toLocaleString()}</span>
                        </div>
                    ))}
                    {salesHistory.length === 0 && <p className="text-center py-6 text-slate-300 italic text-xs">Sin transacciones</p>}
                    </div>
                </div>
            )}

            {/* New Order Action Card */}
            {dashboardConfig.newOrderCard && (
                <div className="bg-luxury-blue p-6 lg:p-8 rounded-[3rem] text-white shadow-lg shadow-blue-900/10 flex flex-col justify-center items-center text-center group hover:shadow-2xl hover:shadow-blue-900/20 transition-all">
                    <div className="relative mb-4">
                        <Plus className="opacity-30 group-hover:scale-110 group-hover:rotate-90 transition-all" size={48} />
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                    </div>
                    <h3 className="text-xl font-black mb-1">Nueva Orden</h3>
                    <p className="text-white/60 text-[10px] mb-6 max-w-[150px] uppercase font-bold tracking-widest leading-relaxed">Registro rápido de servicios</p>
                    <button
                    onClick={() => setIsWashModalOpen(true)}
                    className="bg-white text-luxury-blue px-8 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase text-[10px] tracking-widest"
                    >
                    REGISTRAR
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
