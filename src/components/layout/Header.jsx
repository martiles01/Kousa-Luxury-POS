import React from 'react';
import { MENU_ITEMS } from '../../utils/constants';
import { useLocation } from 'react-router-dom';

const Header = ({ reportFilter, setReportFilter }) => {
    const location = useLocation();
    const activeItem = MENU_ITEMS.find(i => i.path === location.pathname) || MENU_ITEMS[0];

    return (
        <header className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">
                    {activeItem.label}
                </h2>
                <p className="text-gray-500 text-sm">Operaciones en tiempo real — {new Date().toLocaleDateString('es-DO')}</p>
            </div>
            <div className="flex items-center space-x-4">
                {activeItem.id === 'dashboard' && (
                    <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 shadow-sm mr-4">
                        {[
                            { id: 'today', label: 'Hoy' },
                            { id: 'week', label: '7 Días' },
                            { id: 'month', label: 'Mes' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setReportFilter(f.id)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportFilter === f.id ? 'bg-luxury-red text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
                <span className="bg-red-100 text-luxury-red px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                    SUCURSAL CENTRAL
                </span>
            </div>
        </header>
    );
};

export default Header;
