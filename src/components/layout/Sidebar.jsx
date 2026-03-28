import React from 'react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import LogoKousa from '../common/Logo';
import { MENU_ITEMS } from '../../utils/constants';

const Sidebar = ({ onLogout }) => {
    return (
        <aside className="w-64 bg-luxury-dark text-white flex flex-col p-6 fixed h-full shadow-2xl z-20">
            <div className="mb-10">
                <LogoKousa />
            </div>

            <nav className="flex-1 space-y-2">
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

            <div className="pt-6 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 opacity-70 hover:opacity-100 transition-all text-slate-400"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
