import React from 'react';
import { LogOut } from 'lucide-react';
import LogoKousa from './LogoKousa';

const Sidebar = ({ activeTab, setActiveTab, menuItems, handleLogout, branding }) => {
  const sidebarBg = branding?.sidebarColor || '#0a0f1e';

  return (
    <aside 
      className="w-64 text-white flex flex-col p-6 fixed h-full shadow-2xl z-20"
      style={{ backgroundColor: sidebarBg }}
    >
      <div className="mb-10">
        <LogoKousa branding={branding} />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
              ? 'bg-luxury-red shadow-lg shadow-red-900/20 font-bold'
              : 'hover:bg-white/5 opacity-70 hover:opacity-100'
              }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
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
