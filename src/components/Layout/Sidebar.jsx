import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import LogoKousa from './LogoKousa';

const Sidebar = ({ activeTab, setActiveTab, menuItems, handleLogout, branding }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarBg = branding?.sidebarColor || '#0a0f1e';

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <aside
      className="w-64 text-white flex flex-col p-6 h-full shadow-2xl"
      style={{ backgroundColor: sidebarBg }}
    >
      <div className="mb-10">
        <LogoKousa branding={branding} />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
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

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-30">
        {sidebarContent}
      </div>

      {/* Mobile: hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-luxury-dark text-white p-3 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 flex-shrink-0 z-50">
            {sidebarContent}
            <button
              className="absolute top-4 right-4 text-white/50 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
