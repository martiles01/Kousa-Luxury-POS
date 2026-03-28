import React from 'react';
import { LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import LogoKousa from '../common/Logo';
import { MENU_ITEMS } from '../../utils/constants';

const Sidebar = ({ onLogout, isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}
            <aside className={`w-64 bg-luxury-dark text-white flex flex-col p-6 fixed h-full shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="mb-10 flex justify-between items-center">
                    <LogoKousa />
                    <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-luxury-red shadow-lg shadow-red-900/20 font-bold'
                                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`
                        }
                    >
                        {item.icon && <item.icon size={20} />}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/10 shrink-0 mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 opacity-70 hover:opacity-100 transition-all text-slate-400"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
